import { createContext, ReactNode, useState, useContext } from 'react'
import { setCookie, destroyCookie, parseCookies } from 'nookies'
import api from '../services/api'

interface User {
  name: string
  email: string
}

interface AuthData {
  user: User
  signIn(data: User): Promise<void>
  // signOut(): Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | undefined>()

  const client_id = 'ju16a6m81mhid5ue1z3v2g0uh'

  const fetchPosts = async ({ sl_token, page }) => {
    const requestPosts = {
      params: {
        sl_token,
        page: 1,
      },
    }
    return api.get('/posts', requestPosts)
  }

  const signIn = async ({ name, email }) => {
    const sl_token = parseCookies(null, 'supermetrics-auth')[
      'supermetrics-auth'
    ]
    console.log(sl_token)

    if (typeof sl_token === 'undefined') {
      const userInfo = await api.post('/register', { client_id, name, email })
      const sl_token = userInfo.data.data.sl_token
      console.log(userInfo)
      setCookie(null, 'supermetrics-auth', sl_token)
      const posts = fetchPosts({ sl_token, page: 1 })
      return
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  return context
}
