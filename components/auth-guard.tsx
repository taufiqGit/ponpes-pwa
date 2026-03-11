'use client'

import { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}

export function RequireAuth({ children }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } else {
      setReady(true)
    }
  }, [])

  if (!ready) return null
  return <>{children}</>
}

export function RedirectIfAuthed({ children }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } else {
      setReady(true)
    }
  }, [])

  if (!ready) return null
  return <>{children}</>
}
