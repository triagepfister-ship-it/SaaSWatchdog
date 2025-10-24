import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * One-time migration script to hash all plaintext passwords in the database
 * This should be run once after migrating from in-memory storage to PostgreSQL
 */
async function migratePasswords() {
  console.log("Starting password migration...");
  
  try {
    // Get all users
    const allUsers = await db.select().from(users);
    console.log(`Found ${allUsers.length} users to migrate`);
    
    for (const user of allUsers) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        console.log(`User ${user.username} already has hashed password, skipping`);
        continue;
      }
      
      // Hash the plaintext password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update the user with hashed password
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, user.id));
      
      console.log(`Migrated password for user: ${user.username}`);
    }
    
    console.log("Password migration completed successfully!");
  } catch (error) {
    console.error("Error during password migration:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

migratePasswords();
