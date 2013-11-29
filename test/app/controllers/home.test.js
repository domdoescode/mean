var request = require('supertest')
  , express = require('express')
  , should = require('should')
  , logger = require('../../logger')
  , helpers = require('../../../lib/middleware/helpers')
  , options = { logger: logger }

describe('Home controller', function () {
  describe('Index page - /', function () {
    var url = '/'

    it('should render the homepage if no-one is logged in', function (done) {

      var app = express()
      setupApp(app)

      require('../../../app/controllers/home')(app, options)

      request(app)
        .get(url)
        .expect(200, done)
    })

    it('should render the homepage if user is logged in', function (done) {

      var app = express()
      setupApp(app)

      app.use(function (req, res, next) {
        req.user = { username: 'DominoRecords' }
        next()
      })

      require('../../../app/controllers/home')(app, options)

      request(app)
        .get(url)
        .expect(200, done)
    })

    it('should show current users username if logged in', function (done) {

      var app = express()
      setupApp(app)

      app.use(function (req, res, next) {
        req.user = { username: 'DominoRecords' }
        next()
      })

      require('../../../app/controllers/home')(app, options)

      request(app)
        .get(url)
        .expect(200)
        .end(function (error, res) {
          should(/DominoRecords/.test(res.text))
          done(error)
        })
    })

  })
})

function setupApp(app) {
  app.set('showStackError', true)
  app.set('views', __dirname + '/../../../app/views')
  app.set('view engine', 'jade')
  app.use(helpers)
}