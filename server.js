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
    fs.readdirSync(path).forEach(function (file) {
      var newPath = path + '/' + file
        , stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js$)/.test(file)) {
          require(newPath)
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
require(__dirname + '/app/controllers/auth')(app, passport)
require(__dirname + '/app/controllers/home')(app)
require(__dirname + '/app/controllers/user')(app)

// Start the app by listening on <port>
app.listen(properties.port)
console.log('Express app started on port ' + properties.port)

// Expose app
exports = module.exports = app