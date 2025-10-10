import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  software: text("software").notNull(),
  site: text("site"),
  opportunityName: text("opportunity_name"),
  renewalAmount: decimal("renewal_amount", { precision: 10, scale: 2 }),
  renewalExpirationDate: timestamp("renewal_expiration_date"),
  responsibleSalesperson: text("responsible_salesperson"),
  pilotCustomer: boolean("pilot_customer").notNull().default(false),
  churn: boolean("churn").notNull().default(false),
  churnReason: text("churn_reason"),
  status: text("status").notNull().default("active"),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  productName: text("product_name").notNull(),
  renewalDate: timestamp("renewal_date").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("healthy"),
  billingCycle: text("billing_cycle").notNull(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  content: text("content").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Software types available in the system
export const SOFTWARE_TYPES = [
  "Uptime360",
  "ViewPoint"
] as const;

export type SoftwareType = typeof SOFTWARE_TYPES[number];

// Lessons Learned phases
export const LESSONS_LEARNED_PHASES = [
  "Initiate",
  "Root Cause Analysis",
  "Implementation",
  "Closed"
] as const;

export type LessonsLearnedPhase = typeof LESSONS_LEARNED_PHASES[number];

export const lessonsLearned = pgTable("lessons_learned", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  phase: text("phase").notNull().default("Initiate"),
  customerId: varchar("customer_id").references(() => customers.id),
  software: text("software"),
  initiatedBy: text("initiated_by").notNull(),
  initiatedDate: timestamp("initiated_date").notNull().default(sql`now()`),
  rootCauseAnalysis: text("root_cause_analysis"),
  implementationPlan: text("implementation_plan"),
  implementationNotes: text("implementation_notes"),
  closedDate: timestamp("closed_date"),
  closedBy: text("closed_by"),
  outcome: text("outcome"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true }).extend({
  software: z.enum(SOFTWARE_TYPES),
  renewalExpirationDate: z.preprocess(
    (val) => {
      if (!val || (typeof val === 'string' && val.trim() === "")) return null;
      return val;
    },
    z.coerce.date().nullable().refine(
      (date) => date === null || !isNaN(date.getTime()),
      { message: "Invalid date format" }
    )
  ),
});
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true });
export const insertLessonsLearnedSchema = createInsertSchema(lessonsLearned).omit({ 
  id: true, 
  initiatedDate: true 
}).extend({
  phase: z.enum(LESSONS_LEARNED_PHASES),
  software: z.enum(SOFTWARE_TYPES).nullable().optional(),
  customerId: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  rootCauseAnalysis: z.string().nullable().optional(),
  implementationPlan: z.string().nullable().optional(),
  implementationNotes: z.string().nullable().optional(),
  closedDate: z.preprocess(
    (val) => {
      if (!val || (typeof val === 'string' && val.trim() === "")) return null;
      return val;
    },
    z.coerce.date().nullable().optional()
  ),
  closedBy: z.string().nullable().optional(),
  outcome: z.string().nullable().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertLessonsLearned = z.infer<typeof insertLessonsLearnedSchema>;
export type LessonsLearned = typeof lessonsLearned.$inferSelect;
