const BASE_PATH = '/api/sigha-cd'

export const apiFetch = (path: string, options?: RequestInit): Promise<Response> =>
  fetch(`${BASE_PATH}${path}`, options)