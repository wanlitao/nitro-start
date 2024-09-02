export default defineNitroPlugin(async (nitroApp) => {
  const db = useDatabase();
  
  // Create users table
  await db.sql`CREATE TABLE IF NOT EXISTS users ("id" TEXT PRIMARY KEY, "firstName" TEXT, "lastName" TEXT, "email" TEXT)`;

  console.log("database tables created");
});
