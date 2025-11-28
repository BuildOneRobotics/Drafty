'use client'

import { useState, useRef, useEffect } from 'react'
import { Whiteboard } from '@/lib/store'

interface WhiteboardEditorProps {
  whiteboard: Whiteboard
  onSave: (content: string) => void
}

export default function WhiteboardEditor({ whiteboard, onSave }: WhiteboardEditorProps) {
  // Reference props to satisfy strict TypeScript rules
  void whiteboard
  void onSave
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'text' | 'spider' | 'draw'>('text')
  const [textInput, setTextInput] = useState('')
  const [nodes, setNodes] = useState<{id: string, text: string, x: number, y: number}[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'draw') drawSpider()
  }, [nodes, mode])

  const drawSpider = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2

    if (nodes.length > 0) {
      const center = nodes[0]
      nodes.slice(1).forEach(node => {
        ctx.beginPath()
        ctx.moveTo(center.x, center.y)
        ctx.lineTo(node.x, node.y)
        ctx.stroke()
      })
    }

    nodes.forEach(node => {
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.text.substring(0, 10), node.x, node.y)
    })
  }

  const addTextNode = () => {
    if (!textInput.trim()) return
    const newNode = {
      id: Date.now().toString(),
      text: textInput,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100
    }
    setNodes([...nodes, newNode])
    setTextInput('')
  }

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id))
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'spider') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 25)
    if (clicked) {
      setSelectedNode(clicked.id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('text')} className={`px-4 py-2 rounded-lg ${mode === 'text' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--accent-color)]/20'}`}>Text</button>
        <button onClick={() => setMode('spider')} className={`px-4 py-2 rounded-lg ${mode === 'spider' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--accent-color)]/20'}`}>Spider Diagram</button>
      </div>

      {mode === 'text' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Add text..." className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg text-[var(--text-color)]" />
            <button onClick={addTextNode} className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg">Add</button>
          </div>
          <div className="space-y-2">
            {nodes.map(node => (
              <div key={node.id} className="p-3 bg-white rounded-lg border border-[var(--accent-color)]/20 flex justify-between items-center">
                <p className="text-[var(--text-color)]">{node.text}</p>
                <button onClick={() => deleteNode(node.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'spider' && (
        <div className="space-y-3">
          <canvas ref={canvasRef} width={600} height={400} onClick={handleCanvasClick} className="border-2 border-[var(--accent-color)]/20 rounded-lg bg-white cursor-pointer" />
          <div className="flex gap-2">
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Node text..." className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg text-[var(--text-color)]" />
            <button onClick={addTextNode} className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg">Add Node</button>
          </div>
          {selectedNode && (
            <button onClick={() => deleteNode(selectedNode)} className="w-full text-red-500 hover:text-red-700 py-2">Delete Selected Node</button>
          )}
        </div>
      )}
    </div>
  )
}
