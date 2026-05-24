export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiGet(path) {
  const response = await fetch(`${API_URL}${path}`)

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Falha ao carregar dados.')
  }

  return response.json()
}
