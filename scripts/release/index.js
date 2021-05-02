const crypto = require('crypto')

console.log(crypto.createHash('md5', { outputLength: 12 }).update('scripts/buildPlugins/common/config.js').digest('hex'))
