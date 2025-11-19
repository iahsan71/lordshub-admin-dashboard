import React, { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set dark theme by default
    document.documentElement.classList.add('dark')
  }, [])

  return <>{children}</>
}
