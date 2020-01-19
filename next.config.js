require('dotenv').config() // for local .env (not used in prod)

module.exports = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
}
