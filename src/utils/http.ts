const BASE_PATH = '/api/sigha-biomedica'

export const apiFetch = (path: string, options?: RequestInit): Promise<Response> =>
  fetch(`${BASE_PATH}${path}`, options)