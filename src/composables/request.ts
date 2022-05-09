const host = 'http://localhost:3000'

enum methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

interface headers {
  'Content-Type'?: string|undefined
}

async function _request(method: methods, path: string, body: object|FormData|undefined|string) {
  if (path[0] !== '/')
    path = `/${path}`

  const headers: headers = {}
  if (!(body instanceof FormData)) {
    body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${host}${path}`, {
    method,
    headers, // ts error can be ignored (hopefully)
    credentials: 'include',
    body,
  })
  let response = await res.text()
  try {
    response = JSON.parse(response)
  }
  catch (err) {}

  return response
}

export default {
  get: async(path: string) => await _request(methods.GET, path, undefined),
  post: async(path: string, body: object|FormData|undefined = undefined) => await _request(methods.POST, path, body),
  patch: async(path: string, body: object|FormData|undefined = undefined) => await _request(methods.PATCH, path, body),
  delete: async(path: string) => await _request(methods.DELETE, path, undefined),
}
