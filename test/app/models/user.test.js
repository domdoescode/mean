var logger = require('../../logger')
  , mongoose = require('mongoose')
  , connection

describe('User model', function () {
  before(function (done) {
    var dbName = Math.round(Math.random() * 1000000).toString(36)
    connection = mongoose.createConnection('mongodb://localhost/test' + dbName)

    mongoose.models = {}
    mongoose.modelSchemas = {}

    connection.once('open', function callback () {
      require('../../../app/models/user')(logger)
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