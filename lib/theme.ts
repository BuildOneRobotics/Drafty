export const themes = {
  beige: { bg: '#faf8f5', accent: '#d4a574', text: '#5a4f45' },
  ocean: { bg: '#f0f9ff', accent: '#7dd3fc', text: '#0c4a6e' },
  forest: { bg: '#f0fdf4', accent: '#86efac', text: '#14532d' },
  sunset: { bg: '#faf5ff', accent: '#d8b4fe', text: '#581c87' },
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
  document.documentElement.style.setProperty('--font-family', font)
  
  localStorage.setItem('theme', themeId)
  localStorage.setItem('font', fontId)
}

export function loadTheme() {
  const themeId = localStorage.getItem('theme') || 'beige'
  const fontId = localStorage.getItem('font') || 'inter'
  applyTheme(themeId, fontId)
}
