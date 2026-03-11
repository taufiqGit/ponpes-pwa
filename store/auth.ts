import { create } from 'zustand'

export type AuthUser = {
  id?: string
  name?: string
  usr_full_name?: string
  email?: string
  role?: string
}

type AuthState = {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
