import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

db.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err))

export { db }
