'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const themes = [
  { id: 'beige', name: 'Warm Beige', bg: '#faf8f5', accent: '#c17d4a', text: '#4a3f35' },
  { id: 'ocean', name: 'Ocean Blue', bg: '#f0f9ff', accent: '#0284c7', text: '#1e3a8a' },
  { id: 'forest', name: 'Forest Green', bg: '#f0fdf4', accent: '#16a34a', text: '#14532d' },
  { id: 'sunset', name: 'Sunset Purple', bg: '#faf5ff', accent: '#9333ea', text: '#581c87' },
  { id: 'slate', name: 'Modern Slate', bg: '#f8fafc', accent: '#475569', text: '#1e293b' },
]

const fonts = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'serif', name: 'Serif Classic', family: 'Georgia, serif' },
  { id: 'mono', name: 'Monospace', family: 'Courier New, monospace' },
  { id: 'comic', name: 'Playful', family: 'Comic Sans MS, cursive' },
]

export default function Settings() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState('beige')
  const [selectedFont, setSelectedFont] = useState('inter')

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#4a3f35] mb-8">⚙️ Settings</h1>

        <div className="space-y-8">
          {/* Themes Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e8d5c4]">
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">🎨 Themes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    selectedTheme === theme.id
                      ? 'border-[#c17d4a] shadow-lg'
                      : 'border-[#e8d5c4] hover:border-[#c17d4a]'
                  }`}
                  style={{ backgroundColor: theme.bg }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold" style={{ color: theme.text }}>
                      {theme.name}
                    </span>
                    {selectedTheme === theme.id && <span className="text-xl">✓</span>}
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.bg }}></div>
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.text }}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Fonts Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e8d5c4]">
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">🔤 Fonts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    selectedFont === font.id
                      ? 'border-[#c17d4a] shadow-lg bg-[#f5ebe1]'
                      : 'border-[#e8d5c4] hover:border-[#c17d4a] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#4a3f35]">{font.name}</span>
                    {selectedFont === font.id && <span className="text-xl">✓</span>}
                  </div>
                  <p style={{ fontFamily: font.family }} className="text-[#8b6f47]">
                    The quick brown fox jumps
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e8d5c4]">
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">👤 Account</h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-medium transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
