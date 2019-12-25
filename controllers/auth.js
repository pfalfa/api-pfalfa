const { api } = require('../utils')

const register = (req, res) => {
  const { email, passphare, hint } = req.body
  if (!email || !passphare || !hint) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { email, passphare, hint }
  api
    .post(api.host.ihub, 'auth/register', payload)
    .then(resp => {
      const { success, message, data } = resp
      return res.status(success ? 201 : 400).json({ success, message, data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
    })
}

const login = (req, res) => {
  const { email, passphare } = req.body
  if (!email || !passphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { email, passphare }
  api
    .post(api.host.ihub, 'auth/login', payload)
    .then(resp => {
      const { success, message, data } = resp
      return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
    })
}

const forgot = (req, res) => {
  const { email, hint } = req.body
  if (!email || !hint) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { email, hint }
  api
    .post(api.host.ihub, 'auth/forgot', payload)
    .then(resp => {
      const { success, message, data } = resp
      return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
    })
}

const reset = (req, res) => {
  const { email, oldPassphare, newPassphare } = req.body
  if (!email || !oldPassphare || !newPassphare)
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { email, oldPassphare, newPassphare }
  api
    .post(api.host.ihub, 'auth/reset', payload)
    .then(resp => {
      const { success, message, data } = resp
      return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
    })
}

const changePassphare = (req, res) => {
  const { email, oldPassphare, newPassphare } = req.body
  if (!email || !oldPassphare || !newPassphare)
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { email, oldPassphare, newPassphare }
  api
    .post(api.host.ihub, 'auth/change-password', payload)
    .then(resp => {
      const { success, message, data } = resp
      return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
    })
}

module.exports = { register, login, forgot, reset, changePassphare }
