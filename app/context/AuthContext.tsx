import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react"
import { useMMKVString } from "react-native-mmkv"

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  setAuthToken: (token?: string) => void
  getAuthToken: () => string | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken")

  const getAuthToken = useCallback((): string | null => {
    return authToken ?? null
  }, [authToken])

  const logout = useCallback(() => {
    setAuthToken(undefined)
  }, [setAuthToken])

  const value: AuthContextType = {
    isAuthenticated: !!authToken,
    authToken,
    setAuthToken,
    getAuthToken,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
