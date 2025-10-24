import { type Customer, type InsertCustomer, type Subscription, type InsertSubscription, type Note, type InsertNote, type User, type InsertUser, type LessonsLearned, type InsertLessonsLearned, type Feedback, type InsertFeedback, users, customers, subscriptions, notes, lessonsLearned, feedback } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import type { Store } from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
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
  
  getLessonsLearned(id: string): Promise<LessonsLearned | undefined>;
  getAllLessonsLearned(): Promise<LessonsLearned[]>;
  createLessonsLearned(lessonsLearned: InsertLessonsLearned): Promise<LessonsLearned>;
  updateLessonsLearned(id: string, lessonsLearned: Partial<InsertLessonsLearned>): Promise<LessonsLearned | undefined>;
  deleteLessonsLearned(id: string): Promise<boolean>;
  
  getFeedback(id: string): Promise<Feedback | undefined>;
  getAllFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: string, feedback: Partial<InsertFeedback>): Promise<Feedback | undefined>;
  deleteFeedback(id: string): Promise<boolean>;
  
  sessionStore: Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values({
        ...insertCustomer,
        name: insertCustomer.name ?? insertCustomer.company,
        email: insertCustomer.email ?? "",
      })
      .returning();
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updated] = await db
      .update(customers)
      .set(updates)
      .where(eq(customers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }

  async getSubscriptionsByCustomer(customerId: string): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.customerId, customerId));
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async getNote(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }

  async getNotesByCustomer(customerId: string): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.customerId, customerId));
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values(insertNote)
      .returning();
    return note;
  }

  async getLessonsLearned(id: string): Promise<LessonsLearned | undefined> {
    const [lesson] = await db.select().from(lessonsLearned).where(eq(lessonsLearned.id, id));
    return lesson || undefined;
  }

  async getAllLessonsLearned(): Promise<LessonsLearned[]> {
    return await db.select().from(lessonsLearned);
  }

  async createLessonsLearned(insertLessonsLearned: InsertLessonsLearned): Promise<LessonsLearned> {
    const [lesson] = await db
      .insert(lessonsLearned)
      .values(insertLessonsLearned)
      .returning();
    return lesson;
  }

  async updateLessonsLearned(id: string, updates: Partial<InsertLessonsLearned>): Promise<LessonsLearned | undefined> {
    const [updated] = await db
      .update(lessonsLearned)
      .set(updates)
      .where(eq(lessonsLearned.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteLessonsLearned(id: string): Promise<boolean> {
    const result = await db.delete(lessonsLearned).where(eq(lessonsLearned.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getFeedback(id: string): Promise<Feedback | undefined> {
    const [item] = await db.select().from(feedback).where(eq(feedback.id, id));
    return item || undefined;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [item] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return item;
  }

  async updateFeedback(id: string, updates: Partial<InsertFeedback>): Promise<Feedback | undefined> {
    const [updated] = await db
      .update(feedback)
      .set(updates)
      .where(eq(feedback.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteFeedback(id: string): Promise<boolean> {
    const result = await db.delete(feedback).where(eq(feedback.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
