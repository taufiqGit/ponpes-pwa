'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': '#ffffff',
          '--normal-text': '#2a8b3e',
          '--normal-border': '#2a8b3e',
          '--success-bg': '#ffffff',
          '--success-text': '#2a8b3e',
          '--success-border': '#2a8b3e',
          '--info-bg': '#ffffff',
          '--info-text': '#2a8b3e',
          '--info-border': '#2a8b3e',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
