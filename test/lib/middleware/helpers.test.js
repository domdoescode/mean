var request = require('supertest')
  , express = require('express')
  , helpers = require('../../../lib/middleware/helpers')

var app = express()

app.set('views', __dirname + '/templates')
app.set('view engine', 'jade')

app.use(helpers)

app.get('/req', function (req, res) {
  res.render('req')
})

app.get('/is-active', function (req, res) {
  res.render('is-active')
})

app.get('/is-not-active', function (req, res) {
  res.render('is-active')
})

describe('helpers middleware', function () {

  describe('res.locals.req', function () {

    it('should have request object available in the view', function (done) {
      request(app)
        .get('/req')
        .expect(200)
        .expect('/req', done)
    })

  })

  describe('res.locals.isActive()', function () {

    it('should have isActive function available in the view', function (done) {
      request(app)
        .get('/is-active')
        .expect(200)
        .expect('active', done)
    })

    it('should output "active" if route is the same as current url', function (done) {
      request(app)
        .get('/is-active')
        .expect(200)
        .expect('active', done)
    })

    it('should output nothing if route is different to current url', function (done) {
      request(app)
        .get('/is-not-active')
        .expect(200)
        .expect('', done)
    })

  })

})