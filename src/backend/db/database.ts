import { drizzle } from "db0/integrations/drizzle/index";

export const useDrizzleDatabase = (name?: string) => {
  const db = useDatabase(name);
  return drizzle(db);
};
