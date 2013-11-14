/*
 * A middleware shortcut to exclude the multipart middleware used by express's
 * bodyParser.
 */

var express = require('express')

module.exports = postParser

function postParser(options) {
  var json = express.json(options)
    , urlencoded = express.urlencoded(options)

  return function postParser(req, res, next) {
    json(req, res, function (error) {
      if (error) return next(error)
      urlencoded(req, res, next)
    })
  }
}