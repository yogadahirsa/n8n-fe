// lib/db.ts
import postgres from 'postgres';

// Create a singleton connection (important for hot reload in dev mode)
const sql = postgres(process.env.DATABASE_URL, { ssl: false });

export default sql;
