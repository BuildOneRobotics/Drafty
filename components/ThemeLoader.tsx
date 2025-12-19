'use client'

import { useEffect } from 'react'
import { loadTheme } from '@/lib/theme'

export default function ThemeLoader() {
  useEffect(() => {
    // Load theme on mount
    loadTheme()
  }, [])

  return null
}
