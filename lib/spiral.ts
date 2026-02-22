import { createEnergy } from "@/lib/energy"

export type SpiralPoint = {
  x: number
  y: number
}

const energy = createEnergy(0)

export function logisticRadius(
  x: number,
  y: number,
  time: number,
  max = 70
): number {
  const e = energy(x, y, time)
  return max * (Math.exp(e) / (1 + Math.exp(e)))
}

export function spiralPoints(time: number): SpiralPoint[] {
  const points: SpiralPoint[] = []

  for (let a = 0; a <= Math.PI * 5; a += 0.04) {
    const base = 12 + a * 16
    const bx = Math.cos(a) * base
    const by = Math.sin(a) * base
    const radial = base + logisticRadius(bx, by, time)
    points.push({
      x: Math.cos(a) * radial,
      y: Math.sin(a) * radial
    })
  }

  return points
}
