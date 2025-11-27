'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function Settings() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4a3f35] mb-8">⚙️ Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#c17d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Account</h2>
            <p className="text-[#8b6f47] mb-6">Manage your account settings</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-medium transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#c17d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Notifications</h2>
            <p className="text-[#8b6f47] mb-6">Coming soon...</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#c17d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Privacy</h2>
            <p className="text-[#8b6f47] mb-6">Your data is secure</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#c17d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Storage</h2>
            <p className="text-[#8b6f47] mb-6">Synced with GitHub Gist</p>
          </div>
        </div>
      </div>
    </div>
  )
}
