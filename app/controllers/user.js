/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , express = require('express')
  , User = mongoose.model('User')
  , properties = require('../../properties')()

module.exports = function (app, passport) {
  app.get('/sign-in', function (req, res) {
    res.render('users/sign-in', {
      title: 'Signin',
      message: req.flash('error')
    })
  })

  app.get('/sign-up', function (req, res) {
    res.render('users/sign-up', {
      title: 'Sign up',
      user: new User()
    })
  })

  app.get('/sign-out', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  //Setting up the users api
  app.post('/users', express.bodyParser(), function (req, res, next) {
    var user = new User(req.body)

    user.provider = 'local'
    user.save(function (err) {
      if (err) {
        return res.render('users/sign-up', {
          errors: err,
          user: user
        })
      }
      req.logIn(user, function (err) {
        if (err) return next(err)
        return res.redirect('/')
      })
    })
  })

  app.post('/users/session', express.bodyParser(), passport.authenticate('local', {
    failureRedirect: '/sign-in',
    failureFlash: 'Invalid email or password.'
  }), function (req, res) {
    res.redirect('/')
  })

  app.get('/users/me', function (req, res) {
    res.jsonp(req.user || null)
  })

  app.get('/users/:userId', function (req, res) {
    var user = req.profile

    res.render('users/show', {
      title: user.name,
      user: user
    })
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
    }), function (req, res, next) {
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
    }), function (req, res, next) {
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
    }), function (req, res, next) {
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
    }), function (req, res, next) {
      res.redirect('/')
    })

    app.get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/sign-in'
    }), function (req, res, next) {
      res.redirect('/')
    })
  }

  //Finish with setting up the userId param
  app.param('userId', function (req, res, next, id) {
    User
      .findOne({
        _id: id
      })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })
}