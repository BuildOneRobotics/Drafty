const themes: {[key: string]: {bg: string, accent: string, text: string, surface: string}} = {
  beige: { bg: '#f5f0e8', accent: '#b8803d', text: '#3d3328', surface: '#fdf9f3' },
  ocean: { bg: '#d1ecfd', accent: '#0ea5e9', text: '#0c4a6e', surface: '#e0f2fe' },
  forest: { bg: '#c6f6d5', accent: '#22c55e', text: '#15803d', surface: '#dcfce7' },
  sunset: { bg: '#ead9ff', accent: '#a855f7', text: '#6b21a8', surface: '#f3e8ff' },
  sunshine: { bg: '#fef3c7', accent: '#f59e0b', text: '#92400e', surface: '#fef08a' },
}

const fonts: {[key: string]: string} = {
  inter: 'Inter, sans-serif',
  calibri: 'Calibri, sans-serif',
  georgia: 'Georgia, serif',
  verdana: 'Verdana, sans-serif',
  tahoma: 'Tahoma, sans-serif',
  courier: 'Courier New, monospace',
  trebuchet: 'Trebuchet MS, sans-serif',
  arial: 'Arial, sans-serif',
}

export function applyTheme(themeId: string, fontId: string, brightness: number, darkMode: boolean) {
  const theme = themes[themeId] || themes.beige
  
  if (darkMode) {
    document.documentElement.style.setProperty('--bg-color', '#1a1a1a')
    document.documentElement.style.setProperty('--accent-color', '#fbbf24')
    document.documentElement.style.setProperty('--text-color', '#ffffff')
    document.documentElement.style.setProperty('--surface-color', '#2d2d2d')
  } else {
    const adjustBrightness = (hex: string, factor: number) => {
      const num = parseInt(hex.slice(1), 16)
      const amt = Math.round(2.55 * factor)
      const R = Math.min(255, (num >> 16) + amt)
      const G = Math.min(255, (num >> 8 & 0x00FF) + amt)
      const B = Math.min(255, (num & 0x0000FF) + amt)
      return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
    }
    
    const brightnessFactor = (brightness - 50) / 10
    document.documentElement.style.setProperty('--bg-color', adjustBrightness(theme.bg, brightnessFactor))
    document.documentElement.style.setProperty('--accent-color', theme.accent)
    document.documentElement.style.setProperty('--text-color', theme.text)
    document.documentElement.style.setProperty('--surface-color', adjustBrightness(theme.surface, brightnessFactor))
  }
  
  const font = fonts[fontId] || fonts.inter
  document.documentElement.style.setProperty('--font-family', font)
  
  localStorage.setItem('theme', themeId)
  localStorage.setItem('font', fontId)
  localStorage.setItem('brightness', brightness.toString())
  localStorage.setItem('darkMode', darkMode.toString())
}

export function loadTheme() {
  const theme = localStorage.getItem('theme') || 'beige'
  const font = localStorage.getItem('font') || 'inter'
  const brightness = parseInt(localStorage.getItem('brightness') || '50')
  const darkMode = localStorage.getItem('darkMode') === 'true'
  applyTheme(theme, font, brightness, darkMode)
}
