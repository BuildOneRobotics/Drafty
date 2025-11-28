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
  }, [whiteboard.template])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return
    setIsDrawing(true)
    const rect = canvasRef.current!.getBoundingClientRect()
    context.beginPath()
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return
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

  const clearCanvas = () => {
    if (!context) return
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4 border-b border-[var(--accent-color)]/30">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium"
        >
          Clear
        </button>
        <div className="text-sm text-[var(--text-color)]/60 ml-auto">
          {whiteboard.template}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="flex-1 cursor-crosshair bg-white"
      />
    </div>
  )
}
