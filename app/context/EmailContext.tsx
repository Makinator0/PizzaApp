import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react"
import { useMMKVString } from "react-native-mmkv"

export type EmailContextType = {
  authEmail: string
  setAuthEmail: (email: string) => void
  validationError: string
}

export const EmailContext = createContext<EmailContextType | null>(null)

export const EmailProvider: FC<PropsWithChildren> = ({ children }) => {
  const [rawEmail, setRawEmail] = useMMKVString("EmailProvider.email")
  const authEmail = rawEmail ?? ""
  const setAuthEmail = (value: string) => setRawEmail(value)

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    //if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  return (
    <EmailContext.Provider value={{ authEmail, setAuthEmail, validationError }}>
      {children}
    </EmailContext.Provider>
  )
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) throw new Error("useEmail must be used within an EmailProvider")
  return context
}
