const fetch = require('node-fetch')
const config = require('../config')

const host = { ihub: config.api.ihub, dev: config.api.dev }
const headerOptions = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
}

async function get(hostApi, endpoint, headerAuth = null) {
  if (headerAuth) {
    headerOptions.Authorization = headerAuth
  }

  return fetch(`${hostApi}/${endpoint}`, {
    method: 'GET',
    // credentials: 'same-origin',
    headers: headerOptions,
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)
}

async function post(hostApi, endpoint, payload, headerAuth = null) {
  if (headerAuth) {
    headerOptions.Authorization = headerAuth
  }

  return fetch(`${hostApi}/${endpoint}`, {
    method: 'POST',
    // credentials: 'same-origin',
    headers: headerOptions,
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)
}

async function put(hostApi, endpoint, payload, headerAuth = null) {
  if (headerAuth) {
    headerOptions.Authorization = headerAuth
  }

  return fetch(`${hostApi}/${endpoint}`, {
    method: 'PUT',
    // credentials: 'same-origin',
    headers: headerOptions,
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)
}

async function del(hostApi, endpoint, headerAuth = null) {
  if (headerAuth) {
    headerOptions.Authorization = headerAuth
  }

  return fetch(`${hostApi}/${endpoint}`, {
    method: 'DELETE',
    // credentials: 'same-origin',
    headers: headerOptions,
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)
}

module.exports = api = { host, get, post, put, del }
