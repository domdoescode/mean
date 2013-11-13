/**
 * Module dependencies.
 */
var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , logger = require('bunyan')
  , _ = require('lodash')

// Load configurations
  , properties = require('./properties')()
  , auth = require('./lib/middleware/auth')
  , mongoose = require('mongoose')

// Define paths
  , modelsPath = __dirname + '/app/models'
  , controllersPath = __dirname + '/app/controllers'

// Bootstrap db connection
  , db = mongoose.connect(properties.db)

// Bootstrap models
  , walk = function (path) {

    // Remove first argument for passing to routes
    var walkArgs = []
    for (var i = 1; i < arguments.length; i++) {
      walkArgs.push(arguments[i])
    }

    fs.readdirSync(path).forEach(function (file) {
      var newPath = path + '/' + file
        , stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js$)/.test(file)) {

          // Models only take one argument
          if (walkArgs.length === 0) {
            require(newPath)

          // Routes take more (but remove the path)
          } else {
            var route = require(newPath)
            route.apply(this, walkArgs)
          }
        }
      } else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
  }

walk(modelsPath)

// Bootstrap passport config
require('./lib/passport')(passport)

var app = express()

// Express settings
require('./app')(app, passport, db)

// Bootstrap routes
walk(controllersPath, app, passport, auth)

// Start the app by listening on <port>
app.listen(properties.port)
console.log('Express app started on port ' + properties.port)

// Expose app
exports = module.exports = app