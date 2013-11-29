module.exports = function (req, res, next) {
  res.locals.req = req

  res.locals.isActive = function (link) {
    return req.url.indexOf(link) !== -1 ? 'active' : ''
  }

  next()
}