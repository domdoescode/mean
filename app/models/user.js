/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , authTypes =
    [ 'github'
    , 'twitter'
    , 'facebook'
    , 'google'
    ]

module.exports = function (logger, connection) {
  logger.info('Setting up user model')

  /**
   * User Schema
   */
  var UserSchema = new Schema(
    { name:
      { type: String
      }
    , email:
      { type: String
      , default: null
      }
    , username:
      { type: String
      , unique: true
      , default: null
      }
    , provider:
      { type: String
      , default: 'native'
      }
    , hashedPassword:
      { type: String
      , default: null
      }
    , salt:
      { type: String
      , default: null
      }
    , github: {}
    , twitter: {}
    , facebook: {}
    , google: {}
    }
  )

  /**
   * Virtuals
   */
  UserSchema.virtual('password').set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password)
  }).get(function () {
    return this._password
  })

  /**
   * Validations
   */

  // Email validation
  UserSchema.path('email').validate(function (email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true
    return email && email.length
  }, 'Email cannot be blank')

  // Email must be unique, regardless of strategy
  UserSchema.path('email').validate(function (email, callback) {
    var User = connection.model('User')
    User.findOne({ email: email }, function (error, user) {
      if (user) return callback(false)
      callback(true)
    })
  }, 'Email is already in use')

  UserSchema.path('username').validate(function (username) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true
    return username && username.length
  }, 'Username cannot be blank')

  // Username must be unique, regardless of strategy
  UserSchema.path('username').validate(function (username, callback) {
    var User = connection.model('User')
    User.findOne({ username: username }, function (error, user) {
      if (user) return callback(false)
      callback(true)
    })
  }, 'Username is already in use')

  UserSchema.path('hashedPassword').validate(function (hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true
    return hashedPassword && hashedPassword.length
  }, 'Password cannot be blank')

  /**
   * Methods
   */
  UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashedPassword
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
      return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
      if (!password) return ''
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    }
  }

  connection.model('User', UserSchema)
}