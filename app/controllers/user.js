/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , User = mongoose.model('User')

module.exports = function (app) {
  app.get('/users', function (req, res, next) {
    res.render('users')
  })
}