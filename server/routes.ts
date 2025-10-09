import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCustomerSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

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

  const httpServer = createServer(app);

  return httpServer;
}
