import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// Single shared connection pool for the app.
// postgres.js manages pooling internally — no need for a separate pool wrapper.
const client = postgres(connectionString, { max: 10 })

export const db = drizzle(client, { schema })
