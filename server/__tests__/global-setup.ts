import env from "./test-env"

process.env.JWT_SECRET = env.JWT_SECRET
process.env.SERVER_URL = env.SERVER_URL

export default () => {
  console.log("\n\nJEST SETUP\n")
}
