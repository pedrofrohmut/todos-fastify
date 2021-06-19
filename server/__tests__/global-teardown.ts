import { truncateDatabase } from "./utils/functions/database.functions"

export default async () => {
  console.log("\nJEST SETUP\n")
  await truncateDatabase()
}
