/**
 * Module dependencies.
 */
var properties = require('../../properties')()
  , postParser = require('../../lib/middleware/post-parser')

module.exports = function (app, logger, passport) {
  logger.info('Setting up auth routes')

  app.post('/auth/log-in', postParser(), passport.authenticate('local', {
    failureRedirect: '/sign-in',
    failureFlash: 'Invalid email or password.'
  }), function (req, res) {
    res.redirect('/')
  })

  app.get('/auth/log-out', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  if (properties.facebook) {
    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.render('users/sign-in', {
        title: 'Signin',
        message: req.flash('error')
      })
    })

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.redirect('/')
    })
  }

  if (properties.github) {
    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.render('users/sign-in', {
        title: 'Signin',
        message: req.flash('error')
      })
    })

    app.get('/auth/github/callback', passport.authenticate('github', {
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.redirect('/')
    })
  }

  if (properties.twitter) {
    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.render('users/sign-in', {
        title: 'Signin',
        message: req.flash('error')
      })
    })

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.redirect('/')
    })
  }

  if (properties.google) {
    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
      failureRedirect: '/sign-in',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), function (req, res) {
      res.redirect('/')
    })

    app.get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/sign-in'
    }), function (req, res) {
      res.redirect('/')
    })
  }
}