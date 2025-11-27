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
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Account</h2>
            <p className="text-[#8b6f47] mb-6">Manage your account settings</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-medium transition-all transform hover:scale-105"
            >
              🚪 Logout
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <div className="text-5xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Notifications</h2>
            <p className="text-[#8b6f47] mb-6">Coming soon...</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Privacy</h2>
            <p className="text-[#8b6f47] mb-6">Your data is secure</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-[#e8d5c4] hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            <div className="text-5xl mb-4">💾</div>
            <h2 className="text-2xl font-bold text-[#4a3f35] mb-4">Storage</h2>
            <p className="text-[#8b6f47] mb-6">Synced with GitHub Gist</p>
          </div>
        </div>
      </div>
    </div>
  )
}
