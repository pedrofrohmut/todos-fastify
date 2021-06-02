/* eslint-disable */
module.exports = {
  async redirects() {
    return [
      {
        source: "/api",
        destination: "/docs",
        permanent: true
      }
    ]
  }
}
