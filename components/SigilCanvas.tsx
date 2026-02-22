"use client"

import { useEffect, useRef } from "react"

export default function SigilCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2

    let t = 0

    function energy(r: number, time: number) {
      return Math.sin(6 * r - 2 * time)
    }

    function dEnergyDr(r: number, time: number) {
      return 6 * Math.cos(6 * r - 2 * time)
    }

    function render() {
      t += 0.008

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.translate(cx, cy)

      drawAxes(ctx)
      drawEnergyRings(ctx, t)
      drawGradientField(ctx, t)
      drawSpiral(ctx, t)
      drawAnchors(ctx)
      drawBoundary(ctx)

      ctx.restore()

      requestAnimationFrame(render)
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
        const scaledR = r * 0.01
        const e = energy(scaledR, time)
        ctx.beginPath()
        ctx.arc(0, 0, r + e * 6, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    function drawGradientField(ctx: CanvasRenderingContext2D, time: number) {
      ctx.strokeStyle = "rgba(0,0,0,0.15)"
      ctx.lineWidth = 1

      for (let x = -240; x <= 240; x += 60) {
        for (let y = -240; y <= 240; y += 60) {
          const r = Math.sqrt(x * x + y * y)
          if (r === 0) continue

          const scaledR = r * 0.01
          const dE = dEnergyDr(scaledR, time)

          const nx = x / r
          const ny = y / r

          const dx = -nx * dE * 4
          const dy = -ny * dE * 4

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
        const scaledR = baseR * 0.01
        const e = energy(scaledR, time)
        const logistic = e / (1 + Math.abs(e)) * 20

        const x = Math.cos(a) * (baseR + logistic)
        const y = Math.sin(a) * (baseR + logistic)

        if (a === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.stroke()

      // Mirror spiral
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
  }, [])

  return <canvas ref={ref} width={800} height={800} />
}
