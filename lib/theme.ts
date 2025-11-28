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

export function applyTheme(fontId: string, brightness: number, darkMode: boolean) {
  if (darkMode) {
    document.documentElement.style.setProperty('--bg-color', '#1a1a1a')
    document.documentElement.style.setProperty('--accent-color', '#22c55e')
    document.documentElement.style.setProperty('--text-color', '#ffffff')
    document.documentElement.style.setProperty('--surface-color', '#2d2d2d')
  } else {
    document.documentElement.style.setProperty('--bg-color', '#f0fdf4')
    document.documentElement.style.setProperty('--accent-color', '#22c55e')
    document.documentElement.style.setProperty('--text-color', '#15803d')
    document.documentElement.style.setProperty('--surface-color', '#ffffff')
  }
  
  const font = fonts[fontId] || fonts.inter
  document.documentElement.style.setProperty('--font-family', font)
  
  localStorage.setItem('font', fontId)
  localStorage.setItem('brightness', brightness.toString())
  localStorage.setItem('darkMode', darkMode.toString())
}

export function loadTheme() {
  const font = localStorage.getItem('font') || 'inter'
  const brightness = parseInt(localStorage.getItem('brightness') || '50')
  const darkMode = localStorage.getItem('darkMode') === 'true'
  applyTheme(font, brightness, darkMode)
}
