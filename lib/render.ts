import { energy } from "@/lib/energy"
import { gradientVectors } from "@/lib/gradient"
import { spiralPoints } from "@/lib/spiral"

const CANVAS_SIZE = 800
const BOUNDARY_RADIUS = 320
const ANCHOR_OFFSET = 150

function drawAbsoluteAxis(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = "rgba(255,255,255,0.12)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-BOUNDARY_RADIUS, 0)
  ctx.lineTo(BOUNDARY_RADIUS, 0)
  ctx.stroke()

  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.arc(-ANCHOR_OFFSET, 0, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(ANCHOR_OFFSET, 0, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "rgba(255,255,255,0.18)"
  ctx.beginPath()
  ctx.arc(0, 0, 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawEnergyRings(ctx: CanvasRenderingContext2D, time: number): void {
  for (let r = 30; r <= 280; r += 18) {
    const offset = energy(r * 0.01, time) * 8
    ctx.beginPath()
    ctx.arc(0, 0, r + offset, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(125,170,255,0.30)"
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

function drawGradientField(ctx: CanvasRenderingContext2D, time: number): void {
  const alpha = 0.09 + (Math.sin(time * 2) + 1) * 0.03
  ctx.strokeStyle = `rgba(236,243,255,${alpha.toFixed(3)})`
  ctx.lineWidth = 1

  for (const vector of gradientVectors(time)) {
    ctx.beginPath()
    ctx.moveTo(vector.x, vector.y)
    ctx.lineTo(vector.x + vector.dx, vector.y + vector.dy)
    ctx.stroke()
  }
}

function drawMirroredSpiral(ctx: CanvasRenderingContext2D, time: number): void {
  const points = spiralPoints(time)

  const drawPath = (mirrorX = false): void => {
    ctx.beginPath()
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i]
      const x = mirrorX ? -p.x : p.x
      if (i === 0) {
        ctx.moveTo(x, p.y)
      } else {
        ctx.lineTo(x, p.y)
      }
    }
    ctx.stroke()
  }

  ctx.strokeStyle = "rgba(230,238,255,0.42)"
  ctx.lineWidth = 1.4
  drawPath(false)
  drawPath(true)
}

function drawBoundary(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createRadialGradient(
    0,
    0,
    BOUNDARY_RADIUS - 16,
    0,
    0,
    BOUNDARY_RADIUS + 18
  )
  grad.addColorStop(0, "rgba(170,205,255,0)")
  grad.addColorStop(0.55, "rgba(170,205,255,0.08)")
  grad.addColorStop(1, "rgba(170,205,255,0)")

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, BOUNDARY_RADIUS + 20, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(0, 0, BOUNDARY_RADIUS, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(246,250,255,0.24)"
  ctx.lineWidth = 2
  ctx.stroke()
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
): void {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "#010204"
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.globalCompositeOperation = "lighter"

  drawEnergyRings(ctx, time)
  drawGradientField(ctx, time)
  drawMirroredSpiral(ctx, time)
  drawAbsoluteAxis(ctx)
  drawBoundary(ctx)

  ctx.restore()
}

export function startSigilRender(canvas: HTMLCanvasElement): () => void {
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE

  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}

  let time = 0
  let rafId = 0

  const loop = (): void => {
    time += 0.012
    renderFrame(ctx, canvas.width, canvas.height, time)
    rafId = requestAnimationFrame(loop)
  }

  loop()

  return () => cancelAnimationFrame(rafId)
}
