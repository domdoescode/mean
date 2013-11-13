var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User')
  , properties = require('../properties')()

module.exports = function (passport) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, function (err, user) {
      done(err, user)
    })
  })

  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email'
    , passwordField: 'password'
    },
    function (email, password, done) {
      User.findOne({
        email: email
      }, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          })
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          })
        }
        return done(null, user)
      })
    }
  ))

  if (properties.twitter) {
    var TwitterStrategy = require('passport-twitter').Strategy

    // Use Twitter strategy
    passport.use(new TwitterStrategy({
        consumerKey: properties.twitter.clientID
      , consumerSecret: properties.twitter.clientSecret
      , callbackURL: properties.twitter.callbackURL
      },
      function (token, tokenSecret, profile, done) {
        User.findOne({
          'twitter.id_str': profile.id
        }, function (err, user) {
          if (err) {
            return done(err)
          }
          if (!user) {
            user = new User({
              name: profile.displayName,
              username: profile.username,
              provider: 'twitter',
              twitter: profile._json
            })
            user.save(function (err) {
              if (err) console.log(err)
              return done(err, user)
            })
          } else {
            return done(err, user)
          }
        })
      }
    ))
  }

  if (properties.twitter) {
    var FacebookStrategy = require('passport-facebook').Strategy

    // Use Facebook strategy
    passport.use(new FacebookStrategy({
        clientID: properties.facebook.clientID
      , clientSecret: properties.facebook.clientSecret
      , callbackURL: properties.facebook.callbackURL
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({
          'facebook.id': profile.id
        }, function (err, user) {
          if (err) {
            return done(err)
          }
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              username: profile.username,
              provider: 'facebook',
              facebook: profile._json
            })
            user.save(function (err) {
              if (err) console.log(err)
              return done(err, user)
            })
          } else {
            return done(err, user)
          }
        })
      }
    ))
  }

  if (properties.github) {
    var GitHubStrategy = require('passport-github').Strategy

    // Use Github strategy
    passport.use(new GitHubStrategy({
        clientID: properties.github.clientID
      , clientSecret: properties.github.clientSecret
      , callbackURL: properties.github.callbackURL
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({
          'github.id': profile.id
        }, function (err, user) {
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              username: profile.username,
              provider: 'github',
              github: profile._json
            })
            user.save(function (err) {
              if (err) console.log(err)
              return done(err, user)
            })
          } else {
            return done(err, user)
          }
        })
      }
    ))
  }

  if (properties.google) {
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

    // Use Google strategy
    passport.use(new GoogleStrategy({
        clientID: properties.google.clientID
      , clientSecret: properties.google.clientSecret
      , callbackURL: properties.google.callbackURL
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({
          'google.id': profile.id
        }, function (err, user) {
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              username: profile.username,
              provider: 'google',
              google: profile._json
            })
            user.save(function (err) {
              if (err) console.log(err)
              return done(err, user)
            })
          } else {
            return done(err, user)
          }
        })
      }
    ))
  }
}