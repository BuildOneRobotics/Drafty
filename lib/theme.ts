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

const themes: {[key: string]: {accent: string, text: string, bg: string}} = {
  forest: { accent: '#22c55e', text: '#15803d', bg: '#f0fdf4' },
  phoenix: { accent: '#dc2626', text: '#991b1b', bg: '#fef2f2' },
  pink: { accent: '#ec4899', text: '#be185d', bg: '#fdf2f8' },
  ocean: { accent: '#0ea5e9', text: '#0c4a6e', bg: '#f0f9ff' },
  sunset: { accent: '#f97316', text: '#7c2d12', bg: '#fff7ed' },
  sunshine: { accent: '#eab308', text: '#713f12', bg: '#fefce8' },
}

export function applyTheme(themeId: string, fontId: string, brightness: number, darkMode: boolean) {
  const theme = themes[themeId] || themes.forest
  
  if (darkMode) {
    document.documentElement.style.setProperty('--bg-color', '#1a1a1a')
    document.documentElement.style.setProperty('--accent-color', theme.accent)
    document.documentElement.style.setProperty('--text-color', '#ffffff')
    document.documentElement.style.setProperty('--surface-color', '#2d2d2d')
  } else {
    document.documentElement.style.setProperty('--bg-color', theme.bg)
    document.documentElement.style.setProperty('--accent-color', theme.accent)
    document.documentElement.style.setProperty('--text-color', theme.text)
    document.documentElement.style.setProperty('--surface-color', '#ffffff')
  }
  
  const font = fonts[fontId] || fonts.inter
  document.documentElement.style.setProperty('--font-family', font)
  
  localStorage.setItem('theme', themeId)
  localStorage.setItem('font', fontId)
  localStorage.setItem('brightness', brightness.toString())
  localStorage.setItem('darkMode', darkMode.toString())
}

export function loadTheme() {
  const theme = localStorage.getItem('theme') || 'forest'
  const font = localStorage.getItem('font') || 'inter'
  const brightness = parseInt(localStorage.getItem('brightness') || '50')
  const darkMode = localStorage.getItem('darkMode') === 'true'
  applyTheme(theme, font, brightness, darkMode)
}
