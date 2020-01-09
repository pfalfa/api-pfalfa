const { gundb, util } = require('../utils')

const register = (req, res) => {
  const { email, passphare, hint } = req.body
  if (!email || !passphare || !hint) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const user = gundb.gun.user().recall({ sessionStorage: false })
  user.create(email, passphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })

    /** login */
    user.auth(email, passphare, ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })

      /** create profile */
      const data = ack.sea
      data.profile = { email, hint }
      user.get('profile').put(data.profile, ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })

        /** create user */
        const userProfile = { email, hint, pwd: passphare }
        gundb.gun.get(`user/${email}`).put(userProfile, ack => {
          if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })
          return res.status(201).json({ success: true, message: 'User created successfully', data })
        })
      })
    })
  })

  // api
  //   .post(api.host.ihub, 'auth/register', { email, passphare, hint })
  //   .then(resp => {
  //     const { success, message, data } = resp
  //     return res.status(success ? 201 : 400).json({ success, message, data, paginate: null })
  //   })
  //   .catch(error => {
  //     return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
  //   })
}

const login = (req, res) => {
  const { email, passphare } = req.body
  if (!email || !passphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const user = gundb.gun.user().recall({ sessionStorage: false })
  user.auth(email, passphare, ack => {
    if (ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })

    const data = { email: ack.put.alias, pub: ack.put.pub }
    return res.status(200).json({ success: true, message: 'User login successfully', data, paginate: null })
  })

  // api
  //   .post(api.host.ihub, 'auth/login', { email, passphare })
  //   .then(resp => {
  //     const { success, message, data } = resp
  //     return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
  //   })
  //   .catch(error => {
  //     return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
  //   })
}

const forgot = (req, res) => {
  const { email, hint } = req.body
  if (!email || !hint) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  gundb.gun.get(`user/${email}`).once(data => {
    if (!data) return res.status(400).json({ success: false, message: 'User not found', data: null })
    if (data.hint !== hint)
      return res.status(400).json({ success: false, message: 'Recovery hint not correct', data: null, paginate: null })

    delete data._
    data.temp = util.randomPassword()
    gundb.gun.get(`user/${email}`).put(data, ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })
      return res.status(200).json({ success: true, message: 'Temp password has been send', data: data.temp, paginate: null })
    })
  })

  // api
  //   .post(api.host.ihub, 'auth/forgot', { email, hint })
  //   .then(resp => {
  //     const { success, message, data } = resp
  //     return res.status(200).json({ success, message, data, paginate: null })
  //   })
  //   .catch(error => {
  //     return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
  //   })
}

const reset = (req, res) => {
  const { email, oldPassphare, newPassphare } = req.body
  if (!email || !oldPassphare || !newPassphare)
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  gundb.gun.get(`user/${email}`).once(data => {
    if (!data) return res.status(400).json({ success: false, message: 'User not found', data: null })
    if (data.temp.toString().trim() !== oldPassphare.toString().trim())
      return res.status(400).json({ success: false, message: 'Temp password not correct', data: null })

    const user = gundb.gun.user().recall({ sessionStorage: false })
    user.auth(
      email,
      data.pwd,
      ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

        delete data._
        delete data.temp
        data.pwd = newPassphare
        gundb.gun.get(`user/${email}`).put(data, ack => {
          if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
          return res.status(200).json({ success: true, message: 'Reset password successfully', data: null })
        })
      },
      { change: newPassphare }
    )
  })

  // api
  //   .post(api.host.ihub, 'auth/reset', { email, oldPassphare, newPassphare })
  //   .then(resp => {
  //     const { success, message, data } = resp
  //     return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
  //   })
  //   .catch(error => {
  //     return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
  //   })
}

const changePassphare = (req, res) => {
  const { email, oldPassphare, newPassphare } = req.body
  if (!email || !oldPassphare || !newPassphare)
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const user = gundb.gun.user().recall({ sessionStorage: false })
  user.auth(
    email,
    oldPassphare,
    ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })

      const data = { email, pwd: newPassphare }
      gundb.gun.get(`user/${email}`).put(data, ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null, paginate: null })
        return res.status(200).json({ success: true, message: 'Change password successfully', data: null, paginate: null })
      })
    },
    { change: newPassphare }
  )

  // api
  //   .post(api.host.ihub, 'auth/change-password', { email, oldPassphare, newPassphare })
  //   .then(resp => {
  //     const { success, message, data } = resp
  //     return res.status(success ? 200 : 400).json({ success, message, data, paginate: null })
  //   })
  //   .catch(error => {
  //     return res.status(500).json({ success: false, message: error.message, data: null, paginate: null })
  //   })
}

module.exports = { register, login, forgot, reset, changePassphare }
