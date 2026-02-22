import { energy } from "@/lib/energy"

export type SpiralPoint = {
  x: number
  y: number
}

export function logisticRadius(r: number, time: number, max = 70): number {
  const e = energy(r, time)
  return max * (Math.exp(e) / (1 + Math.exp(e)))
}

export function spiralPoints(time: number): SpiralPoint[] {
  const points: SpiralPoint[] = []

  for (let a = 0; a <= Math.PI * 5; a += 0.04) {
    const base = 12 + a * 16
    const radial = base + logisticRadius(base * 0.01, time)
    points.push({
      x: Math.cos(a) * radial,
      y: Math.sin(a) * radial
    })
  }

  return points
}
