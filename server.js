/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , bunyan = require('bunyan')

// Configure logger
  , logger = bunyan.createLogger({ name: 'MEAN Stack' })

// Load configurations
  , properties = require('./properties')()
  , auth = require('./lib/middleware/auth')
  , mongoose = require('mongoose')

// Bootstrap db connection
  , connection = mongoose.createConnection(properties.db)

// Once connected, set everything up
connection.once('open', function connectionOpen() {
  // Bootstrap models
; [ 'user'
  ].forEach(function (model) {
    require(__dirname + '/app/models/' + model)(logger, connection)
  })

  var options =
      { logger: logger
      , properties: properties
      }

  // Bootstrap passport config
  require('./lib/passport')(passport, connection, options)

  var app = express()

  // Express settings
  require('./app')(app, logger, passport, connection)

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
})