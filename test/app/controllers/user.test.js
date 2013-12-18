var request = require('supertest')
  , express = require('express')
  , mongoose = require('mongoose')
  , logger = require('../../logger')
  , options = { logger: logger }
  , connection

var app = express()

describe('User controller', function () {
  before(function (done) {
    var dbName = Math.round(Math.random() * 1000000).toString(36)
      , host = process.env.WERCKER_MONGODB_HOST || 'localhost'

    connection = mongoose.createConnection('mongodb://' + host + '/test' + dbName)

    connection.once('open', function callback () {
      require('../../../app/models/user')(logger, connection)
      var user = require('../../../app/controllers/user')(app, options)
      done()
    })
  })

  it('should')

  after(function (done) {
    connection.db.dropDatabase(function (error) {
      connection.close()
      done(error)
    })
  })
})
