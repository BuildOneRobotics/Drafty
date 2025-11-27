'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { applyTheme } from '@/lib/theme'

const themes = [
  { id: 'beige', name: 'Warm Beige', bg: '#faf8f5', accent: '#c17d4a' },
  { id: 'ocean', name: 'Ocean Blue', bg: '#f0f9ff', accent: '#0284c7' },
  { id: 'forest', name: 'Forest Green', bg: '#f0fdf4', accent: '#16a34a' },
  { id: 'sunset', name: 'Sunset Purple', bg: '#faf5ff', accent: '#9333ea' },
]

const fonts = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'serif', name: 'Serif', family: 'Georgia, serif' },
  { id: 'mono', name: 'Mono', family: 'Courier New, monospace' },
  { id: 'system', name: 'System', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
]



export default function Settings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'customize' | 'friends' | 'privacy'>('account')
  const [selectedTheme, setSelectedTheme] = useState('beige')
  const [selectedFont, setSelectedFont] = useState('inter')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme') || 'beige'
      const font = localStorage.getItem('font') || 'inter'
      setSelectedTheme(theme)
      setSelectedFont(font)
    }
  }, [])
  const [searchUsername, setSearchUsername] = useState('')
  const [friends, setFriends] = useState<string[]>([])


  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleAddFriend = () => {
    if (searchUsername && !friends.includes(searchUsername)) {
      setFriends([...friends, searchUsername])
      setSearchUsername('')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color,#faf8f5)] transition-colors duration-[2000ms]" style={{ fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4a3f35] mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 bg-white rounded-2xl shadow-lg p-4 border border-[#e8d5c4] h-fit">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === 'account' ? 'bg-[#f5ebe1] text-[#c17d4a] font-semibold' : 'hover:bg-[#faf8f5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Account</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('customize')}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === 'customize' ? 'bg-[#f5ebe1] text-[#c17d4a] font-semibold' : 'hover:bg-[#faf8f5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span>Customize</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('friends')}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === 'friends' ? 'bg-[#f5ebe1] text-[#c17d4a] font-semibold' : 'hover:bg-[#faf8f5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Friends</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                activeTab === 'privacy' ? 'bg-[#f5ebe1] text-[#c17d4a] font-semibold' : 'hover:bg-[#faf8f5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Privacy</span>
              </div>
            </button>
          </div>

          <div className="flex-1">
            {activeTab === 'account' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e8d5c4]">
                <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Account Settings</h2>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-medium transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            )}

            {activeTab === 'customize' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e8d5c4]">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Themes</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setSelectedTheme(theme.id)
                          applyTheme(theme.id, selectedFont)
                        }}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                          selectedTheme === theme.id ? 'border-[#c17d4a] shadow-lg' : 'border-[#e8d5c4]'
                        }`}
                        style={{ backgroundColor: theme.bg }}
                      >
                        <div className="font-semibold text-sm mb-2" style={{ color: theme.accent }}>
                          {theme.name}
                        </div>
                        <div className="flex gap-1">
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.bg }}></div>
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e8d5c4]">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Fonts</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => {
                          setSelectedFont(font.id)
                          applyTheme(selectedTheme, font.id)
                        }}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                          selectedFont === font.id ? 'border-[#c17d4a] shadow-lg' : 'border-[#e8d5c4]'
                        }`}
                      >
                        <div className="font-semibold text-[#4a3f35] mb-2">{font.name}</div>
                        <p style={{ fontFamily: font.family }} className="text-sm text-[#8b6f47]">
                          The quick brown fox
                        </p>
                      </button>
                    ))}
                  </div>
                </div>


              </div>
            )}

            {activeTab === 'friends' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e8d5c4]">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Add Friends</h2>
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                      placeholder="Search username..."
                      className="flex-1 px-4 py-3 border-2 border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#c17d4a] transition-colors"
                    />
                    <button
                      onClick={handleAddFriend}
                      className="bg-gradient-to-r from-[#c17d4a] to-[#d4956f] text-white px-6 py-3 rounded-xl hover:from-[#a86a3d] hover:to-[#c17d4a] font-medium transition-all"
                    >
                      Add
                    </button>
                  </div>

                  <h3 className="font-bold text-[#4a3f35] mb-4">Your Friends</h3>
                  <div className="space-y-2">
                    {friends.length === 0 ? (
                      <p className="text-[#8b6f47] text-sm">No friends yet. Search and add friends!</p>
                    ) : (
                      friends.map((friend) => (
                        <div key={friend} className="flex items-center justify-between p-3 bg-[#f5ebe1] rounded-xl">
                          <span className="font-medium text-[#4a3f35]">{friend}</span>
                          <button 
                            onClick={() => setFriends(friends.filter(f => f !== friend))}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e8d5c4]">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Share Documents</h2>
                  <p className="text-[#8b6f47] mb-4">Select notes or notebooks to share with friends</p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 bg-[#f5ebe1] rounded-xl cursor-pointer hover:bg-[#f0e5d5] transition-colors">
                      <input type="checkbox" className="w-5 h-5 text-[#c17d4a] rounded" />
                      <span className="text-[#4a3f35]">My First Note</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-[#f5ebe1] rounded-xl cursor-pointer hover:bg-[#f0e5d5] transition-colors">
                      <input type="checkbox" className="w-5 h-5 text-[#c17d4a] rounded" />
                      <span className="text-[#4a3f35]">Math Notebook</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e8d5c4]">
                <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Privacy Settings</h2>
                <p className="text-[#8b6f47]">Your data is encrypted and stored securely in GitHub Gist</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
