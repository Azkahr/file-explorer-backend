import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

export const folders = mysqlTable('folders', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    parentId: int('parent_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})