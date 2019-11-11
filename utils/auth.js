const fetch = require('node-fetch')
const config = require('../config')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || authorization === '') {
    return res.status(403).json({ success: false, message: 'Authorization header not provided or empty', data: null, paginate: null })
  }

  fetch(`${config.ihub.host}/users`, {
    method: 'GET',
    // credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: authorization,
    },
  })
    .then(response => response.json())
    .then(result => {
      if (result && !result.success)
        return res
          .status(403)
          .json({ success: false, message: 'You do not have enough permission to perform this action', data: null, paginate: null })

      req.UserAuth = result.data
      next()
    })
    .catch(error => console.error('Auth Error ', error))
}
