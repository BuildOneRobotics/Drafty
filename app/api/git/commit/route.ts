import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return Response.json({ success: false, message: 'Invalid message' }, { status: 400 })
    }
    
    const escapedMessage = message.replace(/'/g, "'\\''")
    await execAsync('git add -A', { cwd: process.cwd() })
    await execAsync(`git commit -m '${escapedMessage}'`, { cwd: process.cwd() })
    await execAsync('git push', { cwd: process.cwd() })
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('Git commit error:', error)
    return Response.json({ success: false }, { status: 500 })
  }
}
