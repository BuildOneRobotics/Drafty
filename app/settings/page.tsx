'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { applyTheme } from '@/lib/theme'

const fonts = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'calibri', name: 'Calibri', family: 'Calibri, sans-serif' },
  { id: 'georgia', name: 'Georgia', family: 'Georgia, serif' },
  { id: 'verdana', name: 'Verdana', family: 'Verdana, sans-serif' },
  { id: 'tahoma', name: 'Tahoma', family: 'Tahoma, sans-serif' },
  { id: 'courier', name: 'Courier', family: 'Courier New, monospace' },
  { id: 'trebuchet', name: 'Trebuchet', family: 'Trebuchet MS, sans-serif' },
  { id: 'arial', name: 'Arial', family: 'Arial, sans-serif' },
]

const themes = [
  { id: 'forest', name: 'Forest', color: '#22c55e' },
  { id: 'phoenix', name: 'Phoenix', color: '#dc2626' },
  { id: 'pink', name: 'Pink', color: '#ec4899' },
  { id: 'ocean', name: 'Ocean', color: '#0ea5e9' },
  { id: 'sunset', name: 'Sunset', color: '#f97316' },
  { id: 'sunshine', name: 'Sunshine', color: '#eab308' },
]

export default function Settings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'customize' | 'friends' | 'files' | 'privacy'>('account')
  const [folders, setFolders] = useState([{id: '1', name: 'General', color: '#22c55e'}])
  const [exportSelected, setExportSelected] = useState<string[]>([])
  const [fadeOut, setFadeOut] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#22c55e')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null)
  const [selectedFont, setSelectedFont] = useState('inter')
  const [selectedTheme, setSelectedTheme] = useState('forest')
  const [brightness, setBrightness] = useState(50)
  const [darkMode, setDarkMode] = useState(false)
  const [searchUsername, setSearchUsername] = useState('')
  const [friends, setFriends] = useState<{id: string, name: string, canShare: boolean}[]>([])
  const [allUsers, setAllUsers] = useState<{id: string, name: string}[]>([
    {id: '1', name: 'alex_dev'},
    {id: '2', name: 'jordan_design'},
    {id: '3', name: 'casey_writer'},
    {id: '4', name: 'morgan_artist'},
    {id: '5', name: 'taylor_coder'},
  ])
  const [searchResults, setSearchResults] = useState<{id: string, name: string}[]>([])

  const handleTabChange = (tab: 'account' | 'customize' | 'friends' | 'files' | 'privacy') => {
    if (tab !== activeTab) {
      setFadeOut(true)
      setTimeout(() => {
        setActiveTab(tab)
        setFadeOut(false)
      }, 300)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const theme = localStorage.getItem('theme') || 'forest'
        const font = localStorage.getItem('font') || 'inter'
        const br = parseInt(localStorage.getItem('brightness') || '50')
        const dm = localStorage.getItem('darkMode') === 'true'
        const savedFriends = localStorage.getItem('friends')
        const savedFolders = localStorage.getItem('folders')
        setSelectedTheme(theme)
        setSelectedFont(font)
        setBrightness(br)
        setDarkMode(dm)
        if (savedFriends) {
          try {
            setFriends(JSON.parse(savedFriends))
          } catch (error) {
            console.error('Failed to parse friends:', error)
          }
        }
        if (savedFolders) {
          try {
            setFolders(JSON.parse(savedFolders))
          } catch (error) {
            console.error('Failed to parse folders:', error)
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleSearch = (value: string) => {
    setSearchUsername(value)
    if (value.length > 0) {
      const results = allUsers.filter(u => 
        u.name.toLowerCase().includes(value.toLowerCase()) &&
        !friends.some(f => f.id === u.id)
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleAddFriend = (user: {id: string, name: string}) => {
    const newFriend = { ...user, canShare: false }
    const updated = [...friends, newFriend]
    setFriends(updated)
    localStorage.setItem('friends', JSON.stringify(updated))
    setSearchUsername('')
    setSearchResults([])
  }

  const handleRemoveFriend = (userId: string) => {
    const updated = friends.filter(f => f.id !== userId)
    setFriends(updated)
    localStorage.setItem('friends', JSON.stringify(updated))
  }

  const handleToggleShare = (userId: string) => {
    const updated = friends.map(f => 
      f.id === userId ? { ...f, canShare: !f.canShare } : f
    )
    setFriends(updated)
    localStorage.setItem('friends', JSON.stringify(updated))
  }

  const exportAsCSV = () => {
    const csv = ['Title,Content,Created'].concat(
      exportSelected.map(id => `Note ${id},"Sample content",${new Date().toISOString()}`)
    ).join('\n')
    const blob = new Blob([csv], {type: 'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `drafty-export-${new Date().getTime()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color,#f0fdf4)]" style={{ fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
      <Navbar />
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${brightness}%, rgba(0,0,0,0.1) ${brightness}%, rgba(0,0,0,0.1) 100%);
          outline: none;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-color);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-color);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 bg-white rounded-2xl p-4 border border-[var(--accent-color)]/20 h-fit">
            {['account', 'customize', 'friends', 'files', 'privacy'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab as any)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeTab === tab ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-semibold' : 'text-[var(--text-color)] hover:bg-[var(--accent-color)]/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 0.3s ease' }}>
            {activeTab === 'account' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Account Settings</h2>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            )}

            {activeTab === 'customize' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                  <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Theme</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setSelectedTheme(theme.id)
                          applyTheme(theme.id, selectedFont, brightness, darkMode)
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedTheme === theme.id ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/20' : 'border-[var(--accent-color)]/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: theme.color}}></div>
                          <span className="font-medium text-[var(--text-color)]">{theme.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                  <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Brightness</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={brightness}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          setBrightness(val)
                          applyTheme(selectedTheme, selectedFont, val, darkMode)
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold text-[var(--text-color)] w-12">{brightness}%</span>
                    </div>
                    <div className="h-8 rounded-lg border-2 border-[var(--accent-color)]/20" style={{
                      background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${brightness}%, rgba(0,0,0,0.05) ${brightness}%, rgba(0,0,0,0.05) 100%)`
                    }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                  <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Dark Mode</h2>
                  <button
                    onClick={() => {
                      const newDarkMode = !darkMode
                      setDarkMode(newDarkMode)
                      applyTheme(selectedTheme, selectedFont, brightness, newDarkMode)
                    }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all border-2 flex items-center gap-2 ${
                      darkMode
                        ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]'
                        : 'bg-white text-[var(--text-color)] border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40'
                    }`}
                  >
                    <span>{darkMode ? '🌙' : '☀️'}</span>
                    {darkMode ? 'Dark Mode On' : 'Dark Mode Off'}
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                  <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Fonts</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => {
                          setSelectedFont(font.id)
                          applyTheme(selectedTheme, font.id, brightness, darkMode)
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedFont === font.id ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/20' : 'border-[var(--accent-color)]/20'
                        }`}
                      >
                        <div className="font-semibold text-[var(--text-color)] mb-2">{font.name}</div>
                        <p style={{ fontFamily: font.family }} className="text-sm text-[var(--text-color)]">
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
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                  <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Find Users</h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={searchUsername}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search username..."
                      className="flex-1 px-4 py-3 border-2 border-[var(--accent-color)]/20 rounded-xl focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {searchResults.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-[var(--accent-color)]/10 rounded-xl">
                          <span className="font-medium text-[var(--text-color)]">{user.name}</span>
                          <button
                            onClick={() => handleAddFriend(user)}
                            className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <h3 className="font-bold text-[var(--text-color)] mb-4 mt-6">Your Connections</h3>
                  <div className="space-y-2">
                    {friends.length === 0 ? (
                      <p className="text-[var(--text-color)] text-sm">No connections yet</p>
                    ) : (
                      friends.map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between p-3 bg-[var(--accent-color)]/10 rounded-xl">
                          <div className="flex-1">
                            <p className="font-medium text-[var(--text-color)]">{friend.name}</p>
                            <label className="flex items-center gap-2 mt-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={friend.canShare}
                                onChange={() => handleToggleShare(friend.id)}
                                className="w-4 h-4"
                              />
                              <span className="text-xs text-[var(--text-color)]/60">Can share files</span>
                            </label>
                          </div>
                          <button 
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Folder Management</h2>
                {!showNewFolder ? (
                  <button 
                    onClick={() => setShowNewFolder(true)}
                    className="w-full p-3 mb-4 border-2 border-dashed border-[var(--accent-color)]/20 rounded-xl hover:bg-[var(--accent-color)]/5 text-[var(--text-color)]"
                  >
                    + New Folder
                  </button>
                ) : (
                  <div className="mb-4 p-4 border-2 border-[var(--accent-color)]/20 rounded-xl space-y-3">
                    <input 
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={newFolderColor}
                        onChange={(e) => setNewFolderColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <span className="text-sm text-[var(--text-color)]">{newFolderColor}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (newFolderName.trim()) {
                            const updated = [...folders, {id: Date.now().toString(), name: newFolderName, color: newFolderColor}]
                            setFolders(updated)
                            localStorage.setItem('folders', JSON.stringify(updated))
                            setNewFolderName('')
                            setNewFolderColor('#22c55e')
                            setShowNewFolder(false)
                          }
                        }}
                        className="flex-1 bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
                      >
                        Create
                      </button>
                      <button 
                        onClick={() => {
                          setNewFolderName('')
                          setNewFolderColor('#22c55e')
                          setShowNewFolder(false)
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {folders.map(folder => (
                    <div key={folder.id} className="flex items-center justify-between p-3 rounded-lg relative" style={{backgroundColor: folder.color + '20'}}>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{backgroundColor: folder.color}}></div>
                        <span className="font-medium text-[var(--text-color)]">{folder.name}</span>
                      </div>
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === folder.id ? null : folder.id)} className="p-1 hover:bg-black/10 rounded">
                          <svg className="w-5 h-5 text-[var(--text-color)]" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="2"/>
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="12" cy="19" r="2"/>
                          </svg>
                        </button>
                        {menuOpen === folder.id && (
                          <div className="absolute right-0 mt-1 bg-white border border-[var(--accent-color)]/20 rounded-lg z-10 w-40">
                            <button onClick={() => { setEditingFolder(folder.id); setMenuOpen(null) }} className="w-full text-left px-4 py-2 hover:bg-[var(--accent-color)]/10 rounded-t-lg text-[var(--text-color)]">Rename</button>
                            <button onClick={() => { setColorPickerOpen(folder.id); setMenuOpen(null) }} className="w-full text-left px-4 py-2 hover:bg-[var(--accent-color)]/10 text-[var(--text-color)]">Change Color</button>
                            <button onClick={() => { const updated = folders.filter(f => f.id !== folder.id); setFolders(updated); localStorage.setItem('folders', JSON.stringify(updated)); setMenuOpen(null) }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 rounded-b-lg">Delete</button>
                          </div>
                        )}
                        {colorPickerOpen === folder.id && (
                          <div className="absolute right-0 mt-1 bg-white border border-[var(--accent-color)]/20 rounded-lg z-10 p-3">
                            <input 
                              type="color"
                              value={folder.color}
                              onChange={(e) => {
                              const updated = folders.map(f => f.id === folder.id ? {...f, color: e.target.value} : f)
                              setFolders(updated)
                              localStorage.setItem('folders', JSON.stringify(updated))
                            }}
                              className="w-20 h-10 rounded cursor-pointer"
                            />
                            <button onClick={() => setColorPickerOpen(null)} className="mt-2 w-full bg-[var(--accent-color)] text-white px-3 py-1 rounded text-sm">Done</button>
                          </div>
                        )}
                      </div>
                      {editingFolder === folder.id && (
                        <div className="absolute inset-0 bg-white rounded-lg p-3 flex items-center gap-2 border-2 border-[var(--accent-color)]">
                          <input 
                            value={folder.name}
                            onChange={(e) => {
                              const updated = folders.map(f => f.id === folder.id ? {...f, name: e.target.value} : f)
                              setFolders(updated)
                              localStorage.setItem('folders', JSON.stringify(updated))
                            }}
                            onBlur={() => setEditingFolder(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingFolder(null)}
                            className="flex-1 px-2 py-1 border border-[var(--accent-color)]/20 rounded outline-none text-[var(--text-color)]"
                            autoFocus
                          />
                          <button onClick={() => setEditingFolder(null)} className="text-green-600 font-medium">✓</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--accent-color)]/20">
                <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Export Data</h2>
                <p className="text-[var(--text-color)] mb-4">Your data is private and stored securely. Export as CSV.</p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center space-x-3 p-3 bg-[var(--accent-color)]/5 rounded-xl cursor-pointer">
                    <input type="checkbox" onChange={(e) => e.target.checked ? setExportSelected([...exportSelected, 'note1']) : setExportSelected(exportSelected.filter(id => id !== 'note1'))} />
                    <span className="text-[var(--text-color)]">My First Note</span>
                  </label>
                </div>
                <button 
                  onClick={exportAsCSV}
                  disabled={exportSelected.length === 0}
                  className="bg-[var(--accent-color)] text-white px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 font-medium"
                >
                  Export as CSV ({exportSelected.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
