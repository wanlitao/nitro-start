import { drizzle } from "db0/integrations/drizzle/index";
import { eq } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export default defineEventHandler(async (event) => {
  const db = useDatabase();

  const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    firstName: text("firstName"),
    lastName: text("lastName"),
    email: text("email"),
  });

  // Create users table
  await db.sql`DROP TABLE IF EXISTS users`;
  await db.sql`CREATE TABLE IF NOT EXISTS users ("id" TEXT PRIMARY KEY, "firstName" TEXT, "lastName" TEXT, "email" TEXT)`;

  // Add a new user
  const userId = String(Math.round(Math.random() * 10_000));
  await db.sql`INSERT INTO users VALUES (${userId}, 'John', 'Doe', '')`;

  const drizzleDb = drizzle(db);

  // Query for users
  const rows = await drizzleDb.select().from(users).where(eq(users.id, userId));

  return {
    rows,
  };
});
