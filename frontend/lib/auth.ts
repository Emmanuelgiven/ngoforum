import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export interface User {
  user_id: number
  email: string
  exp: number
}

export const setAuthTokens = (access: string, refresh: string) => {
  Cookies.set('access_token', access, { expires: 7 })
  Cookies.set('refresh_token', refresh, { expires: 30 })
}

export const getAccessToken = (): string | undefined => {
  return Cookies.get('access_token')
}

export const getRefreshToken = (): string | undefined => {
  return Cookies.get('refresh_token')
}

export const removeAuthTokens = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
}

export const isAuthenticated = (): boolean => {
  const token = getAccessToken()
  if (!token) return false

  try {
    const decoded = jwtDecode<User>(token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const getUser = (): User | null => {
  const token = getAccessToken()
  if (!token) return null

  try {
    return jwtDecode<User>(token)
  } catch {
    return null
  }
}
