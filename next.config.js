module.exports = {
  webpack: (config, { webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    config.plugins.push(new webpack.IgnorePlugin(/pg-native/, /\/pg\//))
    return config
  },
}
