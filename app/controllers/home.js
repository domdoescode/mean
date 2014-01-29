module.exports = function (app, options) {
  var logger = options.logger

  logger.info('Setting up home routes')

  app.get('/templates/:name', function (req, res) {
    var name = req.params.name;
    res.render('../views/templates/' + name);
  })



  app.get('/*', function (req, res) {
    if(req.user) {
      role = req.user.role;
      username = req.user.username;
      _id = req.user._id;
      
      res.cookie('user', JSON.stringify({
        'username': username,
        'role': role,
        '_id': _id
      }))
    }
    res.render('home')
  })

 
}