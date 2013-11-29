module.exports = function (app, options) {
  var logger = options.logger

  logger.info('Setting up home routes')

  app.get('/', function (req, res) {
    res.render('home')
  })
}