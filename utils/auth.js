const { gun } = require('./gundb')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || authorization === '') {
    return res.status(403).json({ success: false, message: 'Authorization header not provided or empty', data: null, paginate: null })
  }

  try {
    gun.user(authorization).once(data => {
      if (data) {
        req.UserAuth = { alias: data.alias, pub: data.pub, epub: data.epub }
        next()
      } else {
        return res
          .status(403)
          .json({ success: false, message: 'You do not have enough permission to perform this action', data: null, paginate: null })
      }
    })
  } catch (error) {
    console.error(error)
  }
}
