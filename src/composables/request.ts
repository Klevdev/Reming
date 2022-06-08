import { useUserStore } from '~/stores/user'
import { useLayoutStore } from '~/stores/layout'

const host = 'http://localhost:3000'

enum methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

interface Headers {
  'Content-Type'?: string|undefined
}

type Data = Object | Array<Object> | []

interface Error {
  message: string
  errors?: Array<Object|string>
}

interface Response {
  data: Data | Boolean
  error: Error | null
}

function _handleErrors(status: Number, resError: Error) {
  const layout = useLayoutStore()
  layout.popup.show({
    type: 'error',
    message: resError.message,
  })
  if (status === 401) {
    useLayoutStore().popup.show({
      message: 'Для доступа к этой странице необходимо авторизоваться',
      type: 'error',
    })
    const user = useUserStore()
    user.logout()
  }
}

async function _request(
  method: methods,
  path: string,
  body: object|FormData|undefined|string,
  silent: boolean): Promise<Response> {
  if (path[0] !== '/')
    path = `/${path}`

  const headers: Headers = {}
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

  if (res.status === 204)
    return { data: {}, error: null }

  let resJson
  try {
    resJson = await res.json()
  }
  catch (error) {
    return { data: {}, error: { message: 'JSON parsing error' } }
  }

  if (Object.prototype.hasOwnProperty.call(resJson, 'refresh')) {
    const user = useUserStore()
    user.refresh(resJson.refresh)
  }
  if (Object.prototype.hasOwnProperty.call(resJson, 'error')) {
    if (!silent)
      _handleErrors(res.status, resJson.error)
    return { data: {} || {}, error: resJson.error }
  }
  return { data: resJson.data || {}, error: null }
}

export default {
  get: async(path: string, silent = false) => await _request(methods.GET, path, undefined, silent),
  post: async(path: string, body: object|FormData|undefined = undefined, silent = false) => await _request(methods.POST, path, body, silent),
  patch: async(path: string, body: object|FormData|undefined = undefined, silent = false) => await _request(methods.PATCH, path, body, silent),
  delete: async(path: string, silent = false) => await _request(methods.DELETE, path, undefined, silent),
}
