import { Client } from "pg"

export const truncateDatabase = async () => {
  const client = new Client()
  await client.connect()
  await client.query("DELETE FROM app.users")
  await client.end()
}
