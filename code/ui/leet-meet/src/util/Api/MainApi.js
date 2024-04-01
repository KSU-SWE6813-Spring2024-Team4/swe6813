import { encodeFormBody, getBearerToken, getOptions, parseJwt } from './ApiUtils';

function getUrl(path) {
  let baseUrl = ""
  switch (process.env.NODE_ENV) {
    case 'development':
      baseUrl = 'http://127.0.0.1:5000'
      break
    case 'production':
      baseUrl = 'http://10.128.0.5'
  }

  return `${baseUrl}${path}`
}

export async function getUsers() {
  try {
    const res = await fetch(getUrl('/user/list'), getOptions({ method: 'GET' }));
    const json = await res.json()
    if (res.status !== 200) {
      return Promise.reject(json)
    }

    return Promise.resolve(json)
  } catch (err) {
    throw err
  }
}

export async function getGames() {
  try {
    const res = await fetch(getUrl('/games/list'), getOptions({ method: 'GET' }));

    const json = await res.json()
    if (res.status !== 200) {
      return Promise.reject(json)
    }

    return Promise.resolve(json)
  } catch (err) {
    throw err
  }
}

export async function getFollowedGames(uid) {
  try {
    const res = await fetch(getUrl(`/user/game/show/${uid}`), getOptions({ method: 'GET' }));

    const json = await res.json()
    return res.status === 200 ? Promise.resolve({ games: json.flatMap(({ game }) => game), userId: uid }) : Promise.reject(json);
  } catch (err) {
    throw err
  }
}

export async function followGame(gid) {
  try {
    const Authorization = getBearerToken();
    const { sub: uid } = parseJwt(Authorization);
    
    const body = { gid, uid };

    const res = await fetch(getUrl('/user/game/add'), getOptions({
      headers: { Authorization, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormBody(body), 
      method: 'POST'
    }));

    const text = await res.text()
    if (text.toLowerCase().includes('error')) {
      throw new Error(text);
    }

    const json = JSON.parse(text);
    return res.status === 200 ? Promise.resolve(json) : Promise.reject(json);
  } catch (err) {
    throw err
  }
}

export async function unfollowGame(gid) {
  try {
    const Authorization = getBearerToken();
    const { sub: uid } = parseJwt(Authorization);
    
    const body = { gid, uid };

    const res = await fetch(getUrl('/user/game/delete'), getOptions({
      headers: { Authorization, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormBody(body), 
      method: 'DELETE'
    }));

    const json = await res.json()
    return res.status === 200 ? Promise.resolve(json) : Promise.reject(json);
  } catch (err) {
    throw err
  }
}

export async function getFollowedUsers() {
  try {
    const Authorization = getBearerToken();
    const res = await fetch(getUrl('/user/follow/list'), getOptions({
      headers: { Authorization },
      method: 'GET'
    }));

    const json = await res.json()
    if (res.status !== 200) {
      return Promise.reject(json)
    }

    return Promise.resolve(json)
  } catch (err) {
    throw err
  }
}

export async function followUser({ followedUserId: follow_user_id }) {
  try {
    const Authorization = getBearerToken();
    const res = await fetch(getUrl('/user/follow/add'), getOptions({
      headers: { Authorization },
      body: JSON.stringify({ follow_user_id }), 
      method: 'POST'
    }))

    const json = await res.json()
    if (res.status !== 200) {
      return Promise.reject(json)
    }

    return Promise.resolve(json)
  } catch (err) {
    throw err
  }
}

export async function unfollowUser({ followedUserId: follow_user_id }) {
  try {
  } catch {
  }
}