// import * as fs from "fs"
// import * as path from "path"
// import { Client } from "pg"

import * as env from "./test-env"
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
  // const client = new Client()
  // try {
  //   const sqlFile = fs.readFileSync(path.resolve(__dirname + "../../../database/create_database.sql")).toString()
  //   await client.connect()
  //   await client.query(sqlFile)
  // } catch (err) {
  //   console.error("ERROR", err.message)
  // } finally {
  //   await client.end()
  // }
}
