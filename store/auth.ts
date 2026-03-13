import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export type AuthUser = {
  id?: string
  name?: string
  usr_full_name?: string
  email?: string
  role?: string
}

type AuthState = {
  user: AuthUser | null
  selectedStudentId: string | null
  setUser: (user: AuthUser | null) => void
  setSelectedStudentId: (id: string | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      selectedStudentId: null,
      setUser: (user) => set({ user }),
      setSelectedStudentId: (id) => set({ selectedStudentId: id }),
      clearUser: () => set({ user: null, selectedStudentId: null }),
    }),
    {
      name: 'auth',
    },
  ),
)
