/**
 * Module dependencies.
 */
var postParser = require('../../lib/middleware/post-parser')
  , _ = require('lodash')

module.exports = function (app, options, passport) {
  var logger = options.logger
    , properties = options.properties

    , authenticateOptions =
      { generic:
        { failureRedirect: '/log-in' }
      , facebook:
        { scope:
          [ 'email'
          , 'user_about_me'
          ]
        }
      , google:
        { scope:
          [ 'https://www.googleapis.com/auth/userinfo.profile'
          , 'https://www.googleapis.com/auth/userinfo.email'
          ]
        }
      }

  authenticateOptions.facebook = _.extend({}, authenticateOptions.generic, authenticateOptions.facebook)
  authenticateOptions.google = _.extend({}, authenticateOptions.generic, authenticateOptions.google)

  logger.info('Setting up auth routes')

  app.post('/auth/log-in', postParser(), passport.authenticate('local', {
    failureRedirect: '/log-in',
    failureFlash: 'Invalid email or password.'
  }), function (req, res) {
    res.redirect('/')
  })

  app.get('/auth/log-out', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  if (properties.facebook) {
    var facebookAuthMiddleware = passport.authenticate('facebook', authenticateOptions.facebook)

    // Setting the facebook oauth routes
    app.get('/auth/facebook', facebookAuthMiddleware)
    app.get('/auth/facebook/callback', facebookAuthMiddleware, function (req, res) {
      res.redirect('/')
    })
  }

  if (properties.github) {
    var githubAuthMiddleware = passport.authenticate('github', authenticateOptions.generic)

    // Setting the github oauth routes
    app.get('/auth/github', githubAuthMiddleware)
    app.get('/auth/github/callback', githubAuthMiddleware, function (req, res) {
      res.redirect('/')
    })
  }

  if (properties.twitter) {
    var twitterAuthMiddleware = passport.authenticate('twitter', authenticateOptions.generic)

    // Setting the twitter oauth routes
    app.get('/auth/twitter', twitterAuthMiddleware)
    app.get('/auth/twitter/callback', twitterAuthMiddleware, function (req, res) {
      res.redirect('/')
    })
  }

  if (properties.google) {
    var googleAuthMiddleware = passport.authenticate('google', authenticateOptions.google)

    // Setting the google oauth routes
    app.get('/auth/google', googleAuthMiddleware)
    app.get('/auth/google/callback', googleAuthMiddleware, function (req, res) {
      res.redirect('/')
    })
  }
}