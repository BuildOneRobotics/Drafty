export async function autoCommit(message: string) {
  try {
    const response = await fetch('/api/git/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    return response.ok
  } catch (error) {
    console.error('Auto-commit failed:', error)
    return false
  }
}
