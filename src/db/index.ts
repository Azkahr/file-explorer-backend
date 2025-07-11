import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise'
import * as schema from './schema'
import 'dotenv/config'

const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL
})

export const db = drizzle(connection, { 
    schema,
    mode: 'default'
})
export * from './schema'