var request = require('supertest')
  , should = require('should')
  , express = require('express')
  , postParser= require('../../lib/middleware/post-parser')

var app = express()

app.post('/', postParser(), function (req, res) {
  res.send(req.body)
  res.end()
})

app.post('/files', postParser(), function (req, res) {
  res.send(req.files)
  res.end()
})

describe('post-parser middleware', function () {

  it('should default to {}', function (done) {
    var r = request(app)
      .post('/')
      .expect(200)
      .end(function (error, res) {
        should.deepEqual({}, res.body)
        r.app.close()
        done()
      })
  })

  it('should parse JSON', function (done) {
    var r = request(app)
      .post('/')
      .expect(200)
      .send({ user: 'Dom' })
      .end(function (error, res) {
        should.deepEqual({ user: 'Dom' }, res.body)
        r.app.close()
        done()
      });
  })

  it('should parse x-www-form-urlencoded', function(done){
    var r = request(app)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=Dom')
      .expect(200)
      .end(function (error, res) {
        should.deepEqual({ user: 'Dom' }, res.body)
        r.app.close()
        done();
      });
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

      var r = request(app)
        .post('/')
        .set('Content-Type', 'multipart/form-data; boundary=foo')
        .send(content)
        .end(function (error, res) {
          should.deepEqual({}, res.body)
          r.app.close()
          done()
        })
    })

    it('should not support files', function (done) {
      var r = request(app)
        .post('/files')
        .attach('test', __dirname + '/post-parser.test.js')
        .end(function (error, res) {
          should.deepEqual({}, res.body)
          r.app.close()
          done()
        })
    })
  })
})