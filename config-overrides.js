require('./env-check-script')

const path = require('path')

module.exports = function override (config, env) {
  const extendAlias = {
    '~src': path.resolve(__dirname, 'src')
  }

  if (config.resolve) {
    if (config.resolve.alias) {
      Object.assign(config.resolve.alias, extendAlias)
    } else {
      config.resolve.alias = extendAlias
    }
  } else {
    config.resolve = {
      alias: extendAlias
    }
  }

  return config
}
