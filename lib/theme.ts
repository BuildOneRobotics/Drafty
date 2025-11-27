export const themes = {
  beige: { bg: '#f5f0e8', accent: '#b8803d', text: '#3d3328', surface: '#fdf9f3' },
  ocean: { bg: '#d1ecfd', accent: '#0ea5e9', text: '#0a3a5c', surface: '#f0f9ff' },
  forest: { bg: '#c6f6d5', accent: '#22c55e', text: '#0f3d1f', surface: '#f0fdf4' },
  sunset: { bg: '#ead9ff', accent: '#a855f7', text: '#4a1d75', surface: '#faf5ff' },
}

export const fonts = {
  inter: 'Inter, sans-serif',
  serif: 'Georgia, serif',
  mono: 'Courier New, monospace',
  system: '-apple-system, BlinkMacSystemFont, sans-serif',
}

export function applyTheme(themeId: string, fontId: string) {
  const theme = themes[themeId as keyof typeof themes] || themes.beige
  const font = fonts[fontId as keyof typeof fonts] || fonts.inter
  
  document.documentElement.style.setProperty('--bg-color', theme.bg)
  document.documentElement.style.setProperty('--accent-color', theme.accent)
  document.documentElement.style.setProperty('--text-color', theme.text)
  document.documentElement.style.setProperty('--surface-color', theme.surface)
  document.documentElement.style.setProperty('--font-family', font)
  
  localStorage.setItem('theme', themeId)
  localStorage.setItem('font', fontId)
}

export function loadTheme() {
  const themeId = localStorage.getItem('theme') || 'beige'
  const fontId = localStorage.getItem('font') || 'inter'
  applyTheme(themeId, fontId)
}
