'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { applyTheme } from '@/lib/theme'

const themes = [
  { id: 'beige', name: 'Warm Beige', bg: '#f5f0e8', accent: '#b8803d' },
  { id: 'ocean', name: 'Ocean Blue', bg: '#d1ecfd', accent: '#0ea5e9' },
  { id: 'forest', name: 'Forest Green', bg: '#c6f6d5', accent: '#22c55e' },
  { id: 'sunset', name: 'Sunset Purple', bg: '#ead9ff', accent: '#a855f7' },
]

const fonts = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'serif', name: 'Serif', family: 'Georgia, serif' },
  { id: 'mono', name: 'Mono', family: 'Courier New, monospace' },
  { id: 'system', name: 'System', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
]



export default function Settings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'customize' | 'friends' | 'files' | 'privacy'>('account')
  const [folders, setFolders] = useState([{id: '1', name: 'General', color: '#b8803d'}])
  const [exportSelected, setExportSelected] = useState<string[]>([])
  const [fadeOut, setFadeOut] = useState(false)

  const handleTabChange = (tab: 'account' | 'customize' | 'friends' | 'files' | 'privacy') => {
    if (tab !== activeTab) {
      setFadeOut(true)
      setTimeout(() => {
        setActiveTab(tab)
        setFadeOut(false)
      }, 300)
    }
  }
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
  const [pendingRequests, setPendingRequests] = useState<string[]>([])
  const [sentRequests, setSentRequests] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])


  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleSearch = () => {
    if (searchUsername.length > 0) {
      // Mock user database - in real app this would be an API call
      const mockUsers = ['alice', 'bob', 'charlie', 'david', 'emma']
      const exactMatch = mockUsers.filter(u => u === searchUsername.toLowerCase())
      setSearchResults(exactMatch)
    } else {
      setSearchResults([])
    }
  }

  const handleSendRequest = (username: string) => {
    if (!friends.includes(username) && !sentRequests.includes(username)) {
      setSentRequests([...sentRequests, username])
      setSearchUsername('')
      setSearchResults([])
    }
  }

  const handleAcceptRequest = (username: string) => {
    setFriends([...friends, username])
    setPendingRequests(pendingRequests.filter(u => u !== username))
  }

  const handleRejectRequest = (username: string) => {
    setPendingRequests(pendingRequests.filter(u => u !== username))
  }

  const handleRemoveFriend = (username: string) => {
    setFriends(friends.filter(f => f !== username))
  }

  const handleToggleNote = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter(id => id !== noteId))
    } else {
      setSelectedNotes([...selectedNotes, noteId])
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color,#faf8f5)] transition-colors duration-[2000ms]" style={{ fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4a3f35] mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-4 border border-[var(--accent-color)]/30 h-fit">
            <button
              onClick={() => handleTabChange('account')}
              className="w-full text-left px-4 py-3 rounded-xl mb-2 relative group"
            >
              <div className={`absolute inset-1 rounded-lg transition-opacity duration-300 ${
                activeTab === 'account' ? 'bg-[var(--accent-color)]/15 opacity-100' : 'bg-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100'
              }`}></div>
              <div className={`flex items-center space-x-3 relative z-10 ${
                activeTab === 'account' ? 'text-[var(--accent-color)] font-semibold' : ''
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Account</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange('customize')}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === 'customize' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold' : 'hover:bg-[var(--accent-color)]/5'
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
              onClick={() => handleTabChange('friends')}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === 'friends' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold' : 'hover:bg-[var(--accent-color)]/5'
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
              onClick={() => handleTabChange('files')}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === 'files' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold' : 'hover:bg-[var(--accent-color)]/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>Files</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange('privacy')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                activeTab === 'privacy' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold' : 'hover:bg-[var(--accent-color)]/5'
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

          <div className="flex-1" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 0.3s ease' }}>
            {activeTab === 'account' && (
              <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
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
                <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
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
                          selectedTheme === theme.id ? 'border-[var(--accent-color)]' : 'border-[var(--accent-color)]/30'
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

                <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
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
                          selectedFont === font.id ? 'border-[var(--accent-color)]' : 'border-[var(--accent-color)]/30'
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
                <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Search Users</h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={searchUsername}
                      onChange={(e) => {
                        setSearchUsername(e.target.value)
                        handleSearch()
                      }}
                      placeholder="Type exact username..."
                      className="flex-1 px-4 py-3 border-2 border-[var(--accent-color)]/30 rounded-xl focus:outline-none focus:border-[#c17d4a] transition-colors"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {searchResults.map((username) => (
                        <div key={username} className="flex items-center justify-between p-3 bg-[#f5ebe1] rounded-xl">
                          <span className="font-medium text-[#4a3f35]">{username}</span>
                          <button
                            onClick={() => handleSendRequest(username)}
                            className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
                          >
                            Send Request
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {pendingRequests.length > 0 && (
                    <>
                      <h3 className="font-bold text-[#4a3f35] mb-4 mt-6">Pending Requests</h3>
                      <div className="space-y-2 mb-6">
                        {pendingRequests.map((username) => (
                          <div key={username} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                            <span className="font-medium text-[#4a3f35]">{username}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptRequest(username)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectRequest(username)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {sentRequests.length > 0 && (
                    <>
                      <h3 className="font-bold text-[#4a3f35] mb-4 mt-6">Sent Requests</h3>
                      <div className="space-y-2 mb-6">
                        {sentRequests.map((username) => (
                          <div key={username} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <span className="font-medium text-[#4a3f35]">{username}</span>
                            <span className="text-sm text-blue-600">Pending...</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <h3 className="font-bold text-[#4a3f35] mb-4 mt-6">Your Friends</h3>
                  <div className="space-y-2">
                    {friends.length === 0 ? (
                      <p className="text-[#8b6f47] text-sm">No friends yet. Search and send friend requests!</p>
                    ) : (
                      friends.map((friend) => (
                        <div key={friend} className="flex items-center justify-between p-3 bg-[#f5ebe1] rounded-xl">
                          <span className="font-medium text-[#4a3f35]">{friend}</span>
                          <button 
                            onClick={() => handleRemoveFriend(friend)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {friends.length > 0 && (
                  <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
                    <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Share Notes with Friends</h2>
                    <p className="text-[#8b6f47] mb-4">Select notes to share with your friends</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 p-3 bg-[#f5ebe1] rounded-xl cursor-pointer hover:bg-[#f0e5d5] transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-[#c17d4a] rounded"
                          onChange={() => handleToggleNote('note1')}
                          checked={selectedNotes.includes('note1')}
                        />
                        <span className="text-[#4a3f35]">My First Note</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-[#f5ebe1] rounded-xl cursor-pointer hover:bg-[#f0e5d5] transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-[#c17d4a] rounded"
                          onChange={() => handleToggleNote('note2')}
                          checked={selectedNotes.includes('note2')}
                        />
                        <span className="text-[#4a3f35]">Math Notebook</span>
                      </label>
                    </div>
                    {selectedNotes.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700">
                          {selectedNotes.length} note(s) shared with {friends.length} friend(s)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
                <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Folder Management</h2>
                <button 
                  onClick={() => {
                    const name = prompt('Folder name:')
                    const color = prompt('Color (hex):', '#b8803d')
                    if (name) setFolders([...folders, {id: Date.now().toString(), name, color: color || '#b8803d'}])
                  }}
                  className="w-full p-3 mb-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-xl hover:bg-[var(--accent-color)]/5"
                >
                  + New Folder
                </button>
                <div className="space-y-2">
                  {folders.map(folder => (
                    <div key={folder.id} className="flex items-center justify-between p-3 rounded-xl" style={{backgroundColor: folder.color + '20'}}>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{backgroundColor: folder.color}}></div>
                        <input 
                          value={folder.name}
                          onChange={(e) => {
                            const updated = folders.map(f => f.id === folder.id ? {...f, name: e.target.value} : f)
                            setFolders(updated)
                          }}
                          className="bg-transparent border-none outline-none font-medium"
                        />
                      </div>
                      <button onClick={() => setFolders(folders.filter(f => f.id !== folder.id))} className="text-red-500 text-sm">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Privacy Settings</h2>
                  <p className="text-[#8b6f47] mb-4">Your data is encrypted and stored securely in GitHub Gist</p>
                </div>
                <div className="bg-[var(--surface-color,white)] rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--accent-color)]/30">
                  <h2 className="text-2xl font-bold text-[#4a3f35] mb-6">Export Data</h2>
                  <p className="text-[#8b6f47] mb-4">Select files to export</p>
                  <div className="space-y-2 mb-4">
                    <label className="flex items-center space-x-3 p-3 bg-[var(--accent-color)]/5 rounded-xl cursor-pointer">
                      <input type="checkbox" onChange={(e) => e.target.checked ? setExportSelected([...exportSelected, 'note1']) : setExportSelected(exportSelected.filter(id => id !== 'note1'))} />
                      <span>My First Note</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-[var(--accent-color)]/5 rounded-xl cursor-pointer">
                      <input type="checkbox" onChange={(e) => e.target.checked ? setExportSelected([...exportSelected, 'note2']) : setExportSelected(exportSelected.filter(id => id !== 'note2'))} />
                      <span>Math Notebook</span>
                    </label>
                  </div>
                  <button 
                    onClick={() => {
                      const data = JSON.stringify({files: exportSelected}, null, 2)
                      const blob = new Blob([data], {type: 'application/json'})
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'drafty-export.json'
                      a.click()
                    }}
                    disabled={exportSelected.length === 0}
                    className="bg-[var(--accent-color)] text-white px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 font-medium"
                  >
                    Export Selected ({exportSelected.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


