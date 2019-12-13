const fetch = require('node-fetch')
const config = require('../config')

const hostApi = config.api.dev
const headerOptions = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
}

async function get(endpoint, headerAuth = null) {
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

async function post(endpoint, payload, headerAuth = null) {
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

async function put(endpoint, payload, headerAuth = null) {
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

async function del(endpoint, headerAuth = null) {
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

const api = {
  get,
  post,
  put,
  del,
}

module.exports = api
