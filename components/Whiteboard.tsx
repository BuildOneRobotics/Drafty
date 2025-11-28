'use client'

import { useRef, useEffect, useState } from 'react'
import { Whiteboard as WhiteboardType } from '@/lib/store'

interface WhiteboardProps {
  whiteboard: WhiteboardType
  onSave: (content: string) => void
}

export default function Whiteboard({ whiteboard, onSave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [tool, setTool] = useState<'draw' | 'text' | 'rect' | 'circle'>('draw')
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [textInput, setTextInput] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
  const [textPos, setTextPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    setContext(ctx)

    if (whiteboard.content) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = whiteboard.content
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'text') {
      const rect = canvasRef.current!.getBoundingClientRect()
      setTextPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setShowTextInput(true)
      return
    }
    if (!context) return
    setIsDrawing(true)
    const rect = canvasRef.current!.getBoundingClientRect()
    context.beginPath()
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || tool !== 'draw') return
    const rect = canvasRef.current!.getBoundingClientRect()
    context.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    context.strokeStyle = '#000000'
    context.lineWidth = 2
    context.lineCap = 'round'
    context.stroke()
  }

  const stopDrawing = () => {
    if (!context) return
    setIsDrawing(false)
    context.closePath()
    const canvas = canvasRef.current
    if (canvas) {
      onSave(canvas.toDataURL())
    }
  }

  const addText = () => {
    if (!context || !textInput.trim()) return
    context.font = '16px Arial'
    context.fillStyle = '#000000'
    context.fillText(textInput, textPos.x, textPos.y)
    setTextInput('')
    setShowTextInput(false)
    const canvas = canvasRef.current
    if (canvas) {
      onSave(canvas.toDataURL())
    }
  }

  const clearCanvas = () => {
    if (!context) return
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => direction === 'in' ? Math.min(prev + 0.2, 3) : Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4 border-b border-[var(--accent-color)]/30 flex-wrap">
        <button
          onClick={() => setTool('draw')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            tool === 'draw' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--accent-color)]/20 text-[var(--text-color)]'
          }`}
        >
          Draw
        </button>
        <button
          onClick={() => setTool('text')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            tool === 'text' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--accent-color)]/20 text-[var(--text-color)]'
          }`}
        >
          Text
        </button>
        <button
          onClick={() => handleZoom('in')}
          className="px-3 py-2 bg-[var(--accent-color)]/20 text-[var(--text-color)] rounded-lg text-sm font-medium"
        >
          +
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="px-3 py-2 bg-[var(--accent-color)]/20 text-[var(--text-color)] rounded-lg text-sm font-medium"
        >
          -
        </button>
        <button
          onClick={clearCanvas}
          className="px-3 py-2 bg-red-500/20 text-red-600 rounded-lg text-sm font-medium ml-auto"
        >
          Clear
        </button>
        <div className="text-sm text-[var(--text-color)]/60">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      {showTextInput && (
        <div className="p-4 bg-white border-b border-[var(--accent-color)]/30 flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addText()}
            placeholder="Enter text..."
            className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg outline-none text-[var(--text-color)]"
            autoFocus
          />
          <button
            onClick={addText}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg text-sm font-medium"
          >
            Add
          </button>
          <button
            onClick={() => setShowTextInput(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="flex-1 cursor-crosshair bg-white rounded-3xl m-4"
        style={{transform: `scale(${zoom})`, transformOrigin: 'top left'}}
      />
    </div>
  )
}
