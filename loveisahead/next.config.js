require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    SERVER_PORT: process.env.SERVER_PORT,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  }
}
