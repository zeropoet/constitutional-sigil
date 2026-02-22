import { energy } from "@/lib/energy"

export type GradientVector = {
  x: number
  y: number
  dx: number
  dy: number
}

export function gradientVectors(time: number): GradientVector[] {
  const vectors: GradientVector[] = []

  for (let x = -250; x <= 250; x += 50) {
    for (let y = -250; y <= 250; y += 50) {
      const r = Math.sqrt(x * x + y * y) * 0.01
      const e = energy(r, time)
      const angle = Math.atan2(y, x)

      vectors.push({
        x,
        y,
        dx: -Math.cos(angle) * e * 6,
        dy: -Math.sin(angle) * e * 6
      })
    }
  }

  return vectors
}
