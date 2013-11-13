/**
 * Module dependencies.
 */
var express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , properties = require('./properties')()

module.exports = function(app, passport, db) {
  app.set('showStackError', true)

  if (properties.env === 'development') {
    // Prettify HTML during development
    app.locals.pretty = true
  }

  // Should be placed before express.static
  app.use(express.compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  // Setting the fav icon and static folder
  app.use(express.favicon())
  app.use(express.static(properties.root + '/public'))

  // Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'))
  }

  // Set views path, template engine and default layout
  app.set('views', properties.root + '/app/views')
  app.set('view engine', 'jade')

  // Enable jsonp
  app.enable('jsonp callback')

  app.configure(function() {
    // cookieParser should be above session
    app.use(express.cookieParser())

    app.use(express.methodOverride())

    // Express/Mongo session storage
    app.use(express.session({
      secret: properties.session.secret,
      store: new MongoStore({
        db: db.connection.db,
        collection: 'sessions'
      })
    }))

    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())

    // routes should be at the last
    app.use(app.router)

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly,
    // but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
      // Treat as 404
      if (~err.message.indexOf('not found')) return next()

      // Log it
      console.error(err.stack)

      // Error page
      res.status(500).render('500', {
        error: err.stack
      })
    })

    // Assume 404 since no middleware responded
    app.use(function(req, res, next) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      })
    })

  })
}