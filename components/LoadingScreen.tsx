'use client'

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-color,#faf8f5)]">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <div className="text-[var(--text-color)] text-xl font-medium overflow-hidden">
          <span className="loading-text inline-block">Loading your notes...</span>
        </div>
      </div>
    </div>
  )
}
