import env from "./test-env"
import { truncateDatabase } from "./utils/functions/database.functions"

process.env.JWT_SECRET = env.JWT_SECRET
process.env.SERVER_URL = env.SERVER_URL

process.env.PGUSER = env.PGUSER
process.env.PGPASSWORD = env.PGPASSWORD
process.env.PGHOST = env.PGHOST
process.env.PGPORT = env.PGPORT.toString()
process.env.PGDATABASE = env.PGDATABASE

export default async () => {
  console.log("\n\nJEST SETUP\n")
  await truncateDatabase()
}
