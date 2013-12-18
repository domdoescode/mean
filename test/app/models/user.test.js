var logger = require('../../logger')
  , mongoose = require('mongoose')
  , should = require('should')
  , userFixtures = require('./fixtures/user')
  , crypto = require('crypto')
  , connection
  , User

describe('User model', function () {
  before(function (done) {
    var dbName = Math.round(Math.random() * 1000000).toString(36)
      , host = process.env.WERCKER_MONGODB_HOST || 'localhost'

    connection = mongoose.createConnection('mongodb://' + host + '/test' + dbName)

    connection.once('open', function callback () {
      require('../../../app/models/user')(logger, connection)

      User = connection.model('User')
      var user = new User(userFixtures.existingValidUser)
      user.save(function (error) {
        done(error)
      })
    })
  })

  describe('user.save()', function () {
    describe('username validation', function () {
      it('should error if user does not have a username set', function (done) {
        var user = new User()

        user.save(function (error, newUser) {
          should.exist(error)
          should.exist(error.errors)
          should.exist(error.errors.username)

          should.not.exist(newUser)
          error.errors.username.message.should.equal('Username cannot be blank')
          done()
        })
      })

      it('should error if username is already in use', function (done) {
        var user = new User(userFixtures.existingValidUser)

        user.save(function (error, newUser) {
          should.exist(error)
          should.exist(error.errors)
          should.exist(error.errors.username)

          should.not.exist(newUser)
          error.errors.username.message.should.equal('Username is already in use')
          done()
        })
      })
    })

    describe('email validation', function () {
      it('should error if user does not have an email address set', function (done) {
        var user = new User()

        user.save(function (error, newUser) {
          should.exist(error)
          should.exist(error.errors)
          should.exist(error.errors.email)

          should.not.exist(newUser)
          error.errors.email.message.should.equal('Email cannot be blank')
          done()
        })
      })

      it('should error if email address is already in use', function (done) {
        var user = new User(userFixtures.existingValidUser)

        user.save(function (error, newUser) {
          should.exist(error)
          should.exist(error.errors)
          should.exist(error.errors.email)

          should.not.exist(newUser)
          error.errors.email.message.should.equal('Email is already in use')
          done()
        })
      })
    })

    describe('password validation', function () {
      it('should error if user does not have an password set', function (done) {
        var user = new User()

        user.save(function (error, newUser) {
          should.exist(error)
          should.exist(error.errors)
          should.exist(error.errors.hashedPassword)

          should.not.exist(newUser)
          error.errors.hashedPassword.message.should.equal('Password cannot be blank')
          done()
        })
      })
    })

    describe('oAuth validation', function () {
      it('should error if Github ID is already in use')
    })

    describe('valid', function () {
      it('should save if user has valid native sign-up details', function (done) {
        var user = new User(userFixtures.newValidUser)

        user.save(function (error, newUser) {
          should.not.exist(error)
          should.exist(newUser)

          newUser.hashedPassword.should.not.equal(userFixtures.newValidUser.password)
          newUser.provider.should.equal('native')
          newUser.email.should.equal(userFixtures.newValidUser.email)
          newUser.username.should.equal(userFixtures.newValidUser.username)

          done()
        })
      })

      it('should save if user has valid Github sign-up details', function (done) {
        var user = new User(userFixtures.validGithubUser)

        user.save(function (error, newUser) {
          should.not.exist(error)
          should.exist(newUser)

          newUser.email.should.equal(userFixtures.validGithubUser.email)
          newUser.provider.should.equal(userFixtures.validGithubUser.provider)

          done()
        })
      })
    })
  })

  describe('user.password', function () {
    it('should return non-hashed value when getting the users password prior to save', function (done) {
      var user = new User()
      user.password = 'passw0rd'

      user.password.should.equal('passw0rd')
      done()
    })

    it('should set hashedPassword and salt when setting the users password prior to save', function (done) {
      var user = new User()
      user.password = 'passw0rd'

      user.password.should.equal('passw0rd')
      user.hashedPassword.should.not.equal(null)
      user.salt.should.not.equal(null)
      done()
    })
  })

  describe('user.authenticate()', function () {
    it('should return false if hashed password is not the same as provided password', function (done) {
      var user = new User(userFixtures.existingValidUser)
        , authentication = user.authenticate('notPass')

      authentication.should.equal(false)
      done()
    })

    it('should return true if hashed password is the same as provided password', function (done) {
      var user = new User(userFixtures.existingValidUser)
        , authentication = user.authenticate('passw0rd')

      authentication.should.equal(true)
      done()
    })
  })

  describe('user.makeSalt()', function () {
    it('should return a pseudo-random string each time it is run', function (done) {
      var user = new User(userFixtures.existingValidUser)
        , saltOne = user.makeSalt()
        , saltTwo = user.makeSalt()

      saltOne.should.not.equal(saltTwo)
      done()
    })
  })

  describe('user.encryptPassword()', function () {
    it('should return blank if no password is passed through', function (done) {
      var user = new User(userFixtures.existingValidUser)
        , encryptedPassword = user.encryptPassword()

      encryptedPassword.should.equal('')
      done()
    })

    it('should generate a hashed password based on the salt', function (done) {
      var user = new User(userFixtures.existingValidUser)
        , password = 'new passw0rd'
        , encryptedPassword = user.encryptPassword(password)
        , expectedPassword = crypto.createHmac('sha1', user.salt).update(password).digest('hex')

      encryptedPassword.should.equal(expectedPassword)
      done()
    })
  })

  after(function (done) {
    connection.db.dropDatabase(function (error) {
      connection.close()
      done(error)
    })
  })
})
