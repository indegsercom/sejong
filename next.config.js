const modes = {
  master: 'PROD',
  develop: 'STAGE',
}

module.exports = {
  env: {
    MODE: modes[process.env.NOW_GITHUB_COMMIT_REF] || 'LOCAL',
  },
  webpack: (config, { webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    config.plugins.push(new webpack.IgnorePlugin(/pg-native/, /\/pg\//))
    return config
  },
}
