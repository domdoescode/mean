/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

module.exports = function (logger, connection) {
  logger.info('Setting up view model')

  /**
   * User Schema
   */
  var ViewSchema = new Schema(
    { name:
      { type: String
      }
    , beacons:
      { type: Object
      , default: null
      }
    , date_created:
      { type: Date
      , default: new Date()
      }
    }
  )


  /**
   * Methods
   */
  ViewSchema.methods = {


  }

  connection.model('View', ViewSchema)
}