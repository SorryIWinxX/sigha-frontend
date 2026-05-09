const BASE_PATH = import.meta.env.VITE_API_URL

export const apiFetch = (path: string, options?: RequestInit): Promise<Response> =>
  fetch(`${BASE_PATH}${path}`, options)
