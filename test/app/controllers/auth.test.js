var request = require('supertest')
  , express = require('express')
  , passport = require('passport')
  , logger = require('../../logger')

var app = express()
  , auth = require('../../../app/controllers/auth')(app, logger, passport)

describe('Auth controller', function () {

})