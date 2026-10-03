'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useMemo, useState } from 'react'
import { authClient, signOut as signOutRequest } from '@/lib/auth/client'
import { type CompatSession, type CompatUser, toCompatSession } from '@/lib/auth/shared'

type AuthContextType = {
  user: CompatUser | null
  session: CompatSession['session']
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { data, isPending } = authClient.useSession()

  const compatSession = useMemo(
    () => toCompatSession(data?.session ?? null, data?.user ?? null),
    [data?.session, data?.user],
  )

  const signOut = async () => {
    setIsSigningOut(true)
    await signOutRequest()
    router.push('/auth/sign-in')
    router.refresh()
    setIsSigningOut(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user: compatSession.user,
        session: compatSession.session,
        isLoading: isPending || isSigningOut,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
