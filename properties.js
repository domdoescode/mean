var _ = require('lodash')
  , path = require('path')

  , baseProperties =
    { port: 4100
    , root: __dirname
    , session:
      { secret: 'dayz-G0n3-b____ai' }
    , db: 'mongodb://localhost/beacons-cms'
    , dbOptions:
      { native_parser: true }
    }

  , properties =
    { development:
      { port: 4100 }
    }


module.exports = function () {
  var env = process.env.NODE_ENV || 'development'
  return _.extend({ environment: env }, baseProperties, properties[env])
}