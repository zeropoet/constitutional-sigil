"use client"

import { useEffect, useRef } from "react"

import { createEnergy } from "@/lib/energy"

type SigilCanvasProps = {
  seed: number
}

export default function SigilCanvas({ seed }: SigilCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    const energy = createEnergy(seed)
    const baseSize = 800

    let t = 0
    let rafId = 0

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const size = Math.max(1, Math.min(parent.clientWidth, parent.clientHeight))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    function render() {
      t += 0.008

      const width = canvas.width
      const height = canvas.height
      const scale = Math.min(width, height) / baseSize

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(scale, scale)

      drawAxes(ctx)
      drawEnergyRings(ctx, t)
      drawGradientField(ctx, t)
      drawSpiral(ctx, t)
      drawAnchors(ctx)
      drawBoundary(ctx)

      ctx.restore()

      rafId = requestAnimationFrame(render)
    }

    function drawAxes(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = "rgba(0,0,0,0.08)"
      ctx.lineWidth = 1

      ctx.beginPath()
      ctx.moveTo(-350, 0)
      ctx.lineTo(350, 0)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, -350)
      ctx.lineTo(0, 350)
      ctx.stroke()
    }

    function drawEnergyRings(ctx: CanvasRenderingContext2D, time: number) {
      ctx.strokeStyle = "rgba(0,0,0,0.25)"
      ctx.lineWidth = 1

      for (let r = 40; r < 280; r += 30) {
        const e = energy(r, 0, time)
        ctx.beginPath()
        ctx.arc(0, 0, r + e * 6, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    function drawGradientField(ctx: CanvasRenderingContext2D, time: number) {
      ctx.strokeStyle = "rgba(0,0,0,0.15)"
      ctx.lineWidth = 1

      const eps = 1
      for (let x = -240; x <= 240; x += 60) {
        for (let y = -240; y <= 240; y += 60) {
          const gx = (energy(x + eps, y, time) - energy(x - eps, y, time)) / (2 * eps)
          const gy = (energy(x, y + eps, time) - energy(x, y - eps, time)) / (2 * eps)

          const dx = -gx * 28
          const dy = -gy * 28

          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + dx, y + dy)
          ctx.stroke()
        }
      }
    }

    function drawSpiral(ctx: CanvasRenderingContext2D, time: number) {
      ctx.strokeStyle = "rgba(0,0,0,0.35)"
      ctx.lineWidth = 1

      ctx.beginPath()

      for (let a = 0; a < Math.PI * 4; a += 0.05) {
        const baseR = 20 + a * 18
        const baseX = Math.cos(a) * baseR
        const baseY = Math.sin(a) * baseR
        const e = energy(baseX, baseY, time)
        const logistic = (e / (1 + Math.abs(e))) * 20

        const x = Math.cos(a) * (baseR + logistic)
        const y = Math.sin(a) * (baseR + logistic)

        if (a === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.stroke()

      ctx.save()
      ctx.scale(-1, 1)
      ctx.stroke()
      ctx.restore()
    }

    function drawAnchors(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "black"

      ctx.beginPath()
      ctx.arc(-150, 0, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(150, 0, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawBoundary(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 1.5

      ctx.beginPath()
      ctx.arc(0, 0, 300, 0, Math.PI * 2)
      ctx.stroke()
    }

    render()

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
    }
  }, [seed])

  return (
    <div
      style={{
        width: "min(94vw, 94dvh)",
        height: "min(94vw, 94dvh)",
        aspectRatio: "1 / 1",
        maxWidth: 800,
        maxHeight: 800
      }}
    >
      <canvas ref={ref} width={800} height={800} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  )
}
