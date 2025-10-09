import { type Customer, type InsertCustomer, type Subscription, type InsertSubscription, type Note, type InsertNote, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import type { Store } from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionsByCustomer(customerId: string): Promise<Subscription[]>;
  getAllSubscriptions(): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  getNote(id: string): Promise<Note | undefined>;
  getNotesByCustomer(customerId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  
  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private customers: Map<string, Customer>;
  private subscriptions: Map<string, Subscription>;
  private notes: Map<string, Note>;
  public sessionStore: Store;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.subscriptions = new Map();
    this.notes = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      site: insertCustomer.site && insertCustomer.site.trim() !== "" ? insertCustomer.site : null,
      opportunityName: insertCustomer.opportunityName && insertCustomer.opportunityName.trim() !== "" ? insertCustomer.opportunityName : null,
      renewalAmount: (insertCustomer.renewalAmount !== undefined && insertCustomer.renewalAmount !== null && insertCustomer.renewalAmount.toString().trim() !== "") ? insertCustomer.renewalAmount : null,
      renewalExpirationDate: insertCustomer.renewalExpirationDate ?? null,
      responsibleSalesperson: insertCustomer.responsibleSalesperson && insertCustomer.responsibleSalesperson.trim() !== "" ? insertCustomer.responsibleSalesperson : null,
      churn: insertCustomer.churn ?? false,
      churnReason: insertCustomer.churnReason && insertCustomer.churnReason.trim() !== "" ? insertCustomer.churnReason : null,
      status: insertCustomer.status ?? "active"
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existing = this.customers.get(id);
    if (!existing) return undefined;
    
    const updated: Customer = {
      ...existing,
      ...updates,
      id,
      site: updates.site !== undefined ? (updates.site && updates.site.trim() !== "" ? updates.site : null) : existing.site,
      opportunityName: updates.opportunityName !== undefined ? (updates.opportunityName && updates.opportunityName.trim() !== "" ? updates.opportunityName : null) : existing.opportunityName,
      renewalAmount: updates.renewalAmount !== undefined ? (updates.renewalAmount !== null && updates.renewalAmount.toString().trim() !== "" ? updates.renewalAmount : null) : existing.renewalAmount,
      renewalExpirationDate: updates.renewalExpirationDate !== undefined ? updates.renewalExpirationDate : existing.renewalExpirationDate,
      responsibleSalesperson: updates.responsibleSalesperson !== undefined ? (updates.responsibleSalesperson && updates.responsibleSalesperson.trim() !== "" ? updates.responsibleSalesperson : null) : existing.responsibleSalesperson,
      churn: updates.churn !== undefined ? updates.churn : existing.churn,
      churnReason: updates.churnReason !== undefined ? (updates.churnReason && updates.churnReason.trim() !== "" ? updates.churnReason : null) : existing.churnReason,
    };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsByCustomer(customerId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.customerId === customerId
    );
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = { 
      ...insertSubscription, 
      id,
      status: insertSubscription.status ?? "healthy"
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async getNotesByCustomer(customerId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.customerId === customerId
    );
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const createdAt = new Date();
    const note: Note = { ...insertNote, id, createdAt };
    this.notes.set(id, note);
    return note;
  }
}

export const storage = new MemStorage();
