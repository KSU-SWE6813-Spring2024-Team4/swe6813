/**
 * Constructs request options with defaults + passed in options
 * @param {object} opts 
 * @returns {RequestInit}
 */
export function getOptions(opts) {
  const { headers, ...rest } = opts;

  return {
    headers: { 'Content-Type': 'application/json', ...headers }, 
    ...rest
  };
};

export function getBearerToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('no token');
  }

  return `Bearer ${token}`;
}

export function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var json = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(json);
}

export const encodeFormBody = body => Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');