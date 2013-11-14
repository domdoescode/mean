/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , express = require('express')
  , User = mongoose.model('User')

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

  app.get('/users/me', function (req, res) {
    res.jsonp(req.user || null)
  })

  app.get('/users/:username', function (req, res) {
    var user = req.profile

    res.render('users/profile', {
      title: user.name,
      user: user
    })
  })

  //Finish with setting up the userId param
  app.param('username', function (req, res, next, username) {
    User
      .findOne({
        username: username
      })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + username))
        req.profile = user
        next()
      })
  })
}