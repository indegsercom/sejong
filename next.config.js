require('dotenv').config()
const path = require('path')

module.exports = {
  webpack: config => {
    config.resolve.modules.push(path.resolve(__dirname, 'src'))

    return config
  },
}
