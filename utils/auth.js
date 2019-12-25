const api = require('./api')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || authorization === '') {
    return res.status(403).json({ success: false, message: 'Authorization header not provided or empty', data: null, paginate: null })
  }

  api
    .get(api.host.ihub, `users/${authorization}`)
    .then(resp => {
      const { success, message, data } = resp
      if (!success) return res.status(403).json({ success: false, message, data: null })
      req.UserAuth = data
      next()
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message, data: null })
    })
}
