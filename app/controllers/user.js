/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , postParser = require('../../lib/middleware/post-parser')

module.exports = function (app, logger) {
  logger.info('Setting up user routes')

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
  app.post('/users', postParser(), function (req, res, next) {
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