import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCustomerSchema, insertLessonsLearnedSchema, insertFeedbackSchema, insertUserSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // User management routes
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const users = await storage.getAllUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
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
      
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) return res.sendStatus(404);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
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
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.patch("/api/customers/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const partialCustomerSchema = insertCustomerSchema.partial();
      const validatedData = partialCustomerSchema.parse(req.body);
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
