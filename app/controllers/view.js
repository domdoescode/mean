module.exports = function (app, options) {
  var logger = options.logger
    , connection = options.connection
    , View = connection.model('View')



  logger.info('Setting up view routes')

  app.post('/api/view', function (req, res) {

    var view = new View(req.body)
    view.save(function (err) {
      if (err) {
        return res.send(500);
      }

      res.json(view);

    })
  })


  app.get('/api/views', function (req, res) {

    logger.info('Getting all Views')
    View.find().exec(function (err, views){

      if ( err ){
        return res.send(500);
      }

      res.json(views);
    })
  })
}