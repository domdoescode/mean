var request = require('supertest')
  , express = require('express')
  , postParser= require('../../../lib/middleware/post-parser')

var app = express()

app.post('/', postParser(), function (req, res) {
  res.send(req.body)
  res.end()
})

app.post('/files', postParser(), function (req, res) {
  res.send(req.files)
  res.end()
})

app.use(function (error, req, res, next) {
  res.send(error)
  res.end()
})

describe('post-parser middleware', function () {

  it('should default to {}', function (done) {
    request(app)
      .post('/')
      .expect(200)
      .expect({}, done)
  })

  it('should parse JSON', function (done) {
    request(app)
      .post('/')
      .expect(200)
      .send({ user: 'Dom' })
      .expect({ user: 'Dom' }, done)
  })

  it('should fail gracefully with invalid JSON', function(done){
    request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{"user"')
      .expect({ body: '{"user"', status: 400 }, done)
  })

  it('should parse x-www-form-urlencoded', function(done){
    request(app)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=Dom')
      .expect(200)
      .expect({ user: 'Dom' }, done)
  })

  describe('with multipart/form-data', function () {
    it('should not populate req.body', function (done) {
      var content =
          [ '--foo\r\n'
          , 'Content-Disposition: form-data; name="user"\r\n'
          , '\r\n'
          , 'Dom'
          , '\r\n--foo--'
          ].join()

      request(app)
        .post('/')
        .set('Content-Type', 'multipart/form-data; boundary=foo')
        .send(content)
        .expect({}, done)
    })

    it('should not support files', function (done) {
      request(app)
        .post('/files')
        .attach('test', __dirname + '/post-parser.test.js')
        .expect({}, done)
    })
  })
})