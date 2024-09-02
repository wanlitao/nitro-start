import { eq } from "drizzle-orm";
import { useDrizzleDatabase } from "~/db/database";
import { paging } from "~/db/query/paging";
import { users, User } from "~/db/schema/users";

export default defineEventHandler(async (event) => {
  const drizzleDb = useDrizzleDatabase();

  // Add a new user
  const userId = String(Math.round(Math.random() * 10_000));
  await drizzleDb.insert(users).values({
    id: userId,
    firstName: "John",
    lastName: "Doe",
  });

  // Query for users
  let query = drizzleDb
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .$dynamic();
  query = paging(query);

  const rows: User[] = await query;

  return {
    rows,
  };
});
