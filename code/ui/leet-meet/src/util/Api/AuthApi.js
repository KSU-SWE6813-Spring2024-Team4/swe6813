import { getOptions } from './ApiUtils';

function getUrl(path) {
  let baseUrl = ""
  switch (process.env.NODE_ENV) {
    case 'development':
      baseUrl = 'http://localhost:8080'
      break
    case 'production':
      baseUrl = 'TODO'
  }

  return `${baseUrl}${path}`
}

/**
 * @param {string} token 
 * @returns {string}
 */
function stripToken(token) {
  return token.replace('Bearer ', '')
}

export async function register({ username, password }) {
  try {
    const res = await fetch(getUrl('/register'), getOptions({
      body: JSON.stringify({ username, password }), 
      method: "POST" 
    }))
    const json = await res.json()
    if (res.status !== 201) {
      return Promise.reject(json)
    }

    localStorage.setItem('token', stripToken(res.headers.get('Authorization')))
    return Promise.resolve(json)
  } catch (err) {
    throw err
  }
}

export async function login({ username, password }) {
  try {
    const res = await fetch(getUrl('/login'), getOptions({ 
      body: JSON.stringify({ username, password }), 
      method: "POST" 
    }))
    const json = await res.json()
    if (res.status !== 200) {
      return Promise.reject(json)
    }

    localStorage.setItem('token', stripToken(res.headers.get('Authorization')))
    return Promise.resolve(json)
  } catch (err) {
    throw err
  }
}

export async function checkToken(token) {
  try {
    const res = await fetch(getUrl('/validate-token'), getOptions({ 
      body: JSON.stringify({ token }), 
      method: "POST" 
    }))
    const isValid = await res.text()
    return Promise.resolve(Boolean(isValid))
  } catch (err) {
    throw err
  }
}