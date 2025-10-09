import { type Customer, type InsertCustomer, type Subscription, type InsertSubscription, type Note, type InsertNote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionsByCustomer(customerId: string): Promise<Subscription[]>;
  getAllSubscriptions(): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  getNote(id: string): Promise<Note | undefined>;
  getNotesByCustomer(customerId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private subscriptions: Map<string, Subscription>;
  private notes: Map<string, Note>;

  constructor() {
    this.customers = new Map();
    this.subscriptions = new Map();
    this.notes = new Map();
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
      accountManager: insertCustomer.accountManager ?? null,
      status: insertCustomer.status ?? "active"
    };
    this.customers.set(id, customer);
    return customer;
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
