/**
 * Module dependencies.
 */
var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , bunyan = require('bunyan')

// Configure logger
  , logger = bunyan.createLogger({ name: 'MEAN Stack' })

// Load configurations
  , properties = require('./properties')()
  , auth = require('./lib/middleware/auth')
  , mongoose = require('mongoose')

// Define paths
  , modelsPath = __dirname + '/app/models'

// Bootstrap db connection
  , db = mongoose.connect(properties.db)

// Bootstrap models
  , walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
      var newPath = path + '/' + file
        , stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js$)/.test(file)) {
          require(newPath)(logger, db)
        }
      } else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
  }

walk(modelsPath)

var options =
    { logger: logger
    , properties: properties
    }

// Bootstrap passport config
require('./lib/passport')(passport, options)

var app = express()

// Express settings
require('./app')(app, logger, passport, db)

// Bootstrap routes
require(__dirname + '/app/controllers/auth')(app, options, passport)
require(__dirname + '/app/controllers/home')(app, options)
require(__dirname + '/app/controllers/user')(app, options)

// Start the app by listening on <port>
app.listen(properties.port)

logger.info('Express app started on port', properties.port)
logger.info('App is in', properties.environment, 'environment')

// Expose app
exports = module.exports = app