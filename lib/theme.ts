export const themes = {
  beige: { bg: '#f5f0e8', accent: '#b8803d', text: '#3d3328', surface: '#fdf9f3' },
  ocean: { bg: '#d1ecfd', accent: '#0ea5e9', text: '#0a3a5c', surface: '#f0f9ff' },
  forest: { bg: '#c6f6d5', accent: '#22c55e', text: '#0f3d1f', surface: '#f0fdf4' },
  sunset: { bg: '#ead9ff', accent: '#a855f7', text: '#4a1d75', surface: '#faf5ff' },
  sunshine: { bg: '#fef3c7', accent: '#f59e0b', text: '#78350f', surface: '#fffbeb' },
}

export const fonts = {
  inter: 'Inter, sans-serif',
  serif: 'Georgia, serif',
  mono: 'Courier New, monospace',
  system: '-apple-system, BlinkMacSystemFont, sans-serif',
}

export function adjustBrightness(themeId: string, brightness: number) {
  const baseTheme = themes[themeId as keyof typeof themes] || themes.beige
  const factor = 1 + (brightness - 50) / 100
  
  const adjustColor = (hex: string) => {
    const r = Math.min(255, Math.round(parseInt(hex.slice(1, 3), 16) * factor))
    const g = Math.min(255, Math.round(parseInt(hex.slice(3, 5), 16) * factor))
    const b = Math.min(255, Math.round(parseInt(hex.slice(5, 7), 16) * factor))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  
  return {
    bg: adjustColor(baseTheme.bg),
    accent: adjustColor(baseTheme.accent),
    text: adjustColor(baseTheme.text),
    surface: adjustColor(baseTheme.surface),
  }
}

export function applyTheme(themeId: string, fontId: string, brightness: number = 50, darkMode: boolean = false) {
  const theme = darkMode ? {
    bg: '#1a1a1a',
    accent: '#fbbf24',
    text: '#e5e7eb',
    surface: '#2d2d2d'
  } : adjustBrightness(themeId, brightness)
  
  const font = fonts[fontId as keyof typeof fonts] || fonts.inter
  
  document.documentElement.style.setProperty('--bg-color', theme.bg)
  document.documentElement.style.setProperty('--accent-color', theme.accent)
  document.documentElement.style.setProperty('--text-color', theme.text)
  document.documentElement.style.setProperty('--surface-color', theme.surface)
  document.documentElement.style.setProperty('--font-family', font)
  
  localStorage.setItem('theme', themeId)
  localStorage.setItem('font', fontId)
  localStorage.setItem('brightness', brightness.toString())
  localStorage.setItem('darkMode', darkMode.toString())
}

export function loadTheme() {
  const themeId = localStorage.getItem('theme') || 'beige'
  const fontId = localStorage.getItem('font') || 'inter'
  const brightness = parseInt(localStorage.getItem('brightness') || '50')
  const darkMode = localStorage.getItem('darkMode') === 'true'
  applyTheme(themeId, fontId, brightness, darkMode)
}
