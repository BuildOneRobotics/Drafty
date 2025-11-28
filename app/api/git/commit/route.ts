import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body?.message

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return Response.json({ success: false, error: 'Invalid message' }, { status: 400 })
    }

    const cwd = process.cwd()

    try {
      await execAsync('git add -A', { cwd })
    } catch (addError) {
      console.error('Git add error:', addError)
      return Response.json({ success: false, error: 'Failed to stage changes' }, { status: 500 })
    }

    try {
      const escapedMessage = message.replace(/'/g, "'\\''")
      await execAsync(`git commit -m '${escapedMessage}'`, { cwd })
    } catch (commitError: any) {
      if (commitError.message?.includes('nothing to commit')) {
        return Response.json({ success: true, message: 'No changes to commit' })
      }
      console.error('Git commit error:', commitError)
      return Response.json({ success: false, error: 'Failed to commit' }, { status: 500 })
    }

    try {
      await execAsync('git push', { cwd })
    } catch (pushError) {
      console.error('Git push error:', pushError)
      return Response.json({ success: false, error: 'Failed to push' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Commit route error:', error)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
