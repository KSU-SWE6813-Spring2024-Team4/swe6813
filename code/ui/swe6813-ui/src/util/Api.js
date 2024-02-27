let baseUrl = ""
switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = 'http://localhost:8080'
    break
  case 'production':
    // TODO: REPLACE WITH REAL URL ONCE DEPLOYED
    baseUrl = 'TODO'
}

export async function register({ username, password }) {
  const opts = { 
    body: JSON.stringify({ username, password }), 
    headers: { 'Content-Type': 'application/json' },
    method: "POST" 
  }

  try {
    const res = await fetch(`${baseUrl}/register`, opts)
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
  const opts = { 
    body: JSON.stringify({ username, password }), 
    headers: { 'Content-Type': 'application/json' },
    method: "POST" 
  }

  try {
    const res = await fetch(`${baseUrl}/login`, opts)
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

/**
 * @param {string} token 
 * @returns {string}
 */
function stripToken(token) {
  return token.replace('Bearer ', '')
}