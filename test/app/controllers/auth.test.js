var request = require('supertest')
  , express = require('express')
  , should = require('should')
  , logger = require('../../logger')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , userFixtures = require('../models/fixtures/user')
  , flash = require('connect-flash')
  , connection
  , options =
    { logger: logger
    , properties: {}
    }

describe('Auth controller', function () {
  before(function (done) {
    var dbName = Math.round(Math.random() * 1000000).toString(36)
    connection = mongoose.createConnection('mongodb://localhost/test' + dbName)

    connection.once('open', function () {
      require('../../../app/models/user')(logger, connection)

      var User = connection.model('User')
        , user = new User(userFixtures.validUser)

      user.save(function (error) {
        done(error)
      })

    })
  })

  describe('Native auth - /auth/log-in', function () {
    var url = '/auth/log-in'

    it('should 302 redirect if no log in details are passed', function (done) {

      options.properties = { }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .post(url)
        .expect(302)
        .end(function (error, res) {
          res.headers['location'].should.equal('/sign-in')
          done(error)
        })
    })

    it('should 302 redirect if invalid log in details are passed', function (done) {

      options.properties = { }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .post(url)
        .send({ email: 'dom@test.com', password: 'no' })
        .expect(302)
        .end(function (error, res) {
          console.log(res)
          res.headers['location'].should.equal('/sign-in')
          done(error)
        })
    })
  })

  describe('Facebook auth - /auth/facebook', function () {
    var url = '/auth/facebook'

    it('should 404 if Facebook is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 200 if Facebook is defined in properties', function (done) {

      options.properties = { facebook: true }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(200, done)
    })
  })

  describe('Twitter auth - /auth/twitter', function () {
    var url = '/auth/twitter'

    it('should 404 if Twitter is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 200 if Twitter is defined in properties', function (done) {

      options.properties = { twitter: true }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(200, done)
    })
  })

  describe('Google auth - /auth/google', function () {
    var url = '/auth/google'

    it('should 404 if Google is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 200 if Google is defined in properties', function (done) {

      options.properties = { google: true }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(200, done)
    })
  })

  describe('Github auth - /auth/github', function () {
    var url = '/auth/github'

    it('should 404 if Github is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 200 if Github is defined in properties', function (done) {

      options.properties = { github: true }

      var app = express()

      require('../../../lib/passport')(passport, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(200, done)
    })
  })

  after(function (done) {
    connection.db.dropDatabase(function (error) {
      connection.close()
      done(error)
    })
  })
})