var request = require('supertest')
  , express = require('express')
  , should = require('should')
  , logger = require('../../logger')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , helpers = require('../../../lib/middleware/helpers')
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
      , host = process.env.WERCKER_MONGODB_HOST || 'localhost'

    connection = mongoose.createConnection('mongodb://' + host + '/test' + dbName)

    connection.once('open', function () {
      require('../../../app/models/user')(logger, connection)

      var User = connection.model('User')
        , user = new User(userFixtures.existingValidUser)

      user.save(function (error) {
        done(error)
      })

    })
  })

//==============================================================================
//  Native Auth
//==============================================================================
//------------------------------------------------------------------------------
//  Native Auth - Login
//------------------------------------------------------------------------------
  describe('Native auth - /auth/log-in', function () {
    var url = '/auth/log-in'

    it('should 302 redirect if no log in details are passed', function (done) {

      options.properties = { }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .post(url)
        .expect(302)
        .end(function (error, res) {
          res.headers['location'].should.equal('/log-in')
          done(error)
        })
    })

    it('should 302 redirect if invalid log in details are passed', function (done) {

      options.properties = { }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .post(url)
        .send({ email: 'dom@test.com', password: 'no' })
        .expect(302)
        .end(function (error, res) {
          res.headers['location'].should.equal('/log-in')
          done(error)
        })
    })
  })
//------------------------------------------------------------------------------
//  Native Auth - Forgot
//------------------------------------------------------------------------------
  describe('Native auth - /auth/forgot', function () {
    var url = '/auth/forgot'

    it('should 200', function (done) {
      options.properties = { }

      var app = express()
      setupApp(app)

      // require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(200, done)
    })
  })


//==============================================================================
//  Facebook Auth
//==============================================================================

  describe('Facebook auth - /auth/facebook', function () {
    var url = '/auth/facebook'

    it('should 404 if Facebook is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 302 if Facebook is defined in properties', function (done) {

      options.properties =
        { facebook:
          { clientID: '576070102479260'
          , clientSecret: '0d27924fa2fb638677d46923916e4321'
          , callbackURL: '/auth/facebook/callback'
          }
        }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(302, done)
    })
  })

//==============================================================================
//  Twitter Auth
//==============================================================================

  describe('Twitter auth - /auth/twitter', function () {
    var url = '/auth/twitter'

    it('should 404 if Twitter is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 302 if Twitter is defined in properties', function (done) {

      options.properties =
        { twitter:
          { clientID: 'DajrqNKXtC4QLpl77AvYw'
          , clientSecret: '2s456NYgtnUodPBkKKMptynmScS80Lq2RHgNac1FCs'
          }
        }

      var app = express()

      app.use(express.cookieParser())
      app.use(express.session({ secret: 's3cr3t' }))
      app.use(flash())

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(302, done)
    })
  })

//==============================================================================
//  Google Auth
//==============================================================================

  describe('Google auth - /auth/google', function () {
    var url = '/auth/google'

    it('should 404 if Google is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it.skip('should 200 if Google is defined in properties', function (done) {

      options.properties = { google: true }

      var app = express()

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(200, done)
    })
  })

//==============================================================================
//  Github Auth
//==============================================================================

  describe('Github auth - /auth/github', function () {
    var url = '/auth/github'

    it('should 404 if Github is not defined in properties', function (done) {

      options.properties = { }

      var app = express()

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(404, done)
    })

    it('should 302 if Github is defined in properties', function (done) {

      options.properties =
        { github:
          { clientID: '4fa5818ad0525b2a03f9'
          , clientSecret: 'fc46fb965cb56873b0cfc77c2818f93491df370f'
          }
        }

      var app = express()

      require('../../../lib/passport')(passport, connection, options)
      require('../../../app/controllers/auth')(app, options, passport)

      request(app)
        .get(url)
        .expect(302, done)
    })
  })


  after(function (done) {
    connection.db.dropDatabase(function (error) {
      connection.close()
      done(error)
    })
  })
})

function setupApp(app) {
  app.set('showStackError', true)
  app.set('views', __dirname + '/../../../app/views')
  app.set('view engine', 'jade')
  app.use(helpers)
}