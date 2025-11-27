export const themes = {
  beige: { bg: '#faf8f5', accent: '#c8934d', text: '#4a3f35' },
  ocean: { bg: '#e0f2fe', accent: '#38bdf8', text: '#0c4a6e' },
  forest: { bg: '#dcfce7', accent: '#4ade80', text: '#14532d' },
  sunset: { bg: '#f3e8ff', accent: '#c084fc', text: '#581c87' },
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
