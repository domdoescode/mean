module.exports = function (app, logger) {
  logger.info('Setting up home routes')

  app.get('/', function (req, res) {
    res.render('home')
  })
}