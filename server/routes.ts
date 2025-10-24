import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage-db";
import { setupAuth } from "./auth";
import { insertCustomerSchema, updateCustomerSchema, insertLessonsLearnedSchema, insertFeedbackSchema, insertUserSchema } from "@shared/schema";

// Server-side attachment validation constants
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/png',
  'image/jpeg',
];

// Validate and normalize attachment payload
function validateAndNormalizeAttachment(attachmentData?: string, attachmentMimeType?: string): { 
  valid: boolean; 
  error?: string; 
  normalizedData?: string;
} {
  if (!attachmentData) {
    return { valid: true }; // No attachment is valid
  }

  // Validate MIME type first
  if (!attachmentMimeType || !ALLOWED_ATTACHMENT_TYPES.includes(attachmentMimeType)) {
    return { valid: false, error: "Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, TXT, PNG, and JPEG files are allowed." };
  }

  try {
    // Extract base64 portion (after comma if data URI, entire string otherwise)
    const base64Data = attachmentData.includes(',') ? attachmentData.split(',')[1] : attachmentData;
    
    // Remove all whitespace from base64 (security: prevent padding attacks)
    const cleanBase64 = base64Data.replace(/\s/g, '');
    
    // Validate sanitized base64 length BEFORE decoding (prevent oversized requests)
    // Maximum theoretical base64 length for 5MB: ceil(5_242_880 / 3) * 4 ≈ 6,990,508 chars
    const MAX_BASE64_LENGTH = Math.ceil((MAX_ATTACHMENT_SIZE / 3) * 4) + 1000; // +1000 for padding
    if (cleanBase64.length > MAX_BASE64_LENGTH) {
      return { valid: false, error: "Attachment data exceeds maximum allowed size." };
    }
    
    // Decode base64 to actual bytes
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // Validate actual decoded payload size
    if (buffer.length > MAX_ATTACHMENT_SIZE) {
      return { valid: false, error: "File size exceeds 5MB limit." };
    }

    // Re-encode to get normalized base64 (prevents storage bloat)
    const normalizedBase64 = buffer.toString('base64');
    
    // Reconstruct data URI from scratch using validated MIME type (security: prevent prefix bloat)
    const normalizedData = `data:${attachmentMimeType};base64,${normalizedBase64}`;

    return { valid: true, normalizedData };
  } catch (error) {
    return { valid: false, error: "Invalid attachment data." };
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Helper function to check if user has admin access
  const isUserAdmin = (username?: string) => {
    return username === "Stephen" || username === "Anvesh";
  };

  // User management routes (restricted to Stephen and Anvesh)
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only Stephen and Anvesh can access user management
    if (!isUserAdmin(req.user?.username)) {
      return res.status(403).json({ error: "Access denied. Only Stephen and Anvesh can manage users." });
    }
    
    const users = await storage.getAllUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only Stephen and Anvesh can create users
    if (!isUserAdmin(req.user?.username)) {
      return res.status(403).json({ error: "Access denied. Only Stephen and Anvesh can manage users." });
    }
    
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only Stephen and Anvesh can update users
    if (!isUserAdmin(req.user?.username)) {
      return res.status(403).json({ error: "Access denied. Only Stephen and Anvesh can manage users." });
    }
    
    try {
      const partialUserSchema = insertUserSchema.partial();
      const validatedData = partialUserSchema.parse(req.body);
      
      // If username is being updated, check if it already exists
      if (validatedData.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== req.params.id) {
          return res.status(400).json({ error: "Username already exists" });
        }
      }
      
      // Hash password if it's being updated
      const updateData = { ...validatedData };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      
      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) return res.sendStatus(404);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only Stephen and Anvesh can delete users
    if (!isUserAdmin(req.user?.username)) {
      return res.status(403).json({ error: "Access denied. Only Stephen and Anvesh can manage users." });
    }
    
    // Prevent deleting your own account
    if (req.user?.id === req.params.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    
    const success = await storage.deleteUser(req.params.id);
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  });

  // Customer CRUD routes
  app.get("/api/customers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const customers = await storage.getAllCustomers();
    res.json(customers);
  });

  app.get("/api/customers/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const customer = await storage.getCustomer(req.params.id);
    if (!customer) return res.sendStatus(404);
    res.json(customer);
  });

  app.post("/api/customers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Validate and normalize attachment payload server-side
      const attachmentValidation = validateAndNormalizeAttachment(
        validatedData.attachmentData, 
        validatedData.attachmentMimeType
      );
      if (!attachmentValidation.valid) {
        return res.status(400).json({ error: attachmentValidation.error });
      }
      
      // Use normalized attachment data to prevent storage bloat
      if (attachmentValidation.normalizedData) {
        validatedData.attachmentData = attachmentValidation.normalizedData;
      }
      
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.patch("/api/customers/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = updateCustomerSchema.parse(req.body);
      
      // Validate and normalize attachment payload server-side
      const attachmentValidation = validateAndNormalizeAttachment(
        validatedData.attachmentData, 
        validatedData.attachmentMimeType
      );
      if (!attachmentValidation.valid) {
        return res.status(400).json({ error: attachmentValidation.error });
      }
      
      // Use normalized attachment data to prevent storage bloat
      if (attachmentValidation.normalizedData) {
        validatedData.attachmentData = attachmentValidation.normalizedData;
      }
      
      const customer = await storage.updateCustomer(req.params.id, validatedData);
      if (!customer) return res.sendStatus(404);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const success = await storage.deleteCustomer(req.params.id);
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  });

  // Lessons Learned CRUD routes
  app.get("/api/lessons-learned", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const lessonsLearned = await storage.getAllLessonsLearned();
    res.json(lessonsLearned);
  });

  app.get("/api/lessons-learned/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const lessonsLearned = await storage.getLessonsLearned(req.params.id);
    if (!lessonsLearned) return res.sendStatus(404);
    res.json(lessonsLearned);
  });

  app.post("/api/lessons-learned", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertLessonsLearnedSchema.parse(req.body);
      const lessonsLearned = await storage.createLessonsLearned(validatedData);
      res.status(201).json(lessonsLearned);
    } catch (error) {
      res.status(400).json({ error: "Invalid lessons learned data" });
    }
  });

  app.patch("/api/lessons-learned/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const partialLessonsLearnedSchema = insertLessonsLearnedSchema.partial();
      const validatedData = partialLessonsLearnedSchema.parse(req.body);
      const lessonsLearned = await storage.updateLessonsLearned(req.params.id, validatedData);
      if (!lessonsLearned) return res.sendStatus(404);
      res.json(lessonsLearned);
    } catch (error) {
      res.status(400).json({ error: "Invalid lessons learned data" });
    }
  });

  app.delete("/api/lessons-learned/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const success = await storage.deleteLessonsLearned(req.params.id);
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  });

  // Feedback CRUD routes
  app.get("/api/feedback", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const feedback = await storage.getAllFeedback();
    res.json(feedback);
  });

  app.get("/api/feedback/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const feedback = await storage.getFeedback(req.params.id);
    if (!feedback) return res.sendStatus(404);
    res.json(feedback);
  });

  app.post("/api/feedback", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  app.patch("/api/feedback/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const partialFeedbackSchema = insertFeedbackSchema.partial();
      const validatedData = partialFeedbackSchema.parse(req.body);
      const feedback = await storage.updateFeedback(req.params.id, validatedData);
      if (!feedback) return res.sendStatus(404);
      res.json(feedback);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  app.delete("/api/feedback/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const success = await storage.deleteFeedback(req.params.id);
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);

  return httpServer;
}
