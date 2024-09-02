import { SQLiteSelect } from "drizzle-orm/sqlite-core";

export const paging = <TSelect extends SQLiteSelect>(
  qb: TSelect,
  page: number = 1,
  pageSize: number = 10
) => {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
};
