require('dotenv').config() // for local .env (not used in prod)

module.exports = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  webpack: (config, { webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    config.plugins.push(new webpack.IgnorePlugin(/pg-native/, /\/pg\//))
    return config
  },
}
