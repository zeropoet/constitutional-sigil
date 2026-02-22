export function energy(x: number, y: number, time: number) {
  const r = Math.sqrt(x * x + y * y)
  const theta = Math.atan2(y, x)

  const radial = Math.sin(6 * (r * 0.05) - 2 * time)
  const angular = 0.25 * Math.cos(6 * theta)

  const anchor1 = Math.exp(-0.02 * ((x + 80) * (x + 80) + y * y))
  const anchor2 = Math.exp(-0.02 * ((x - 80) * (x - 80) + y * y))

  return radial + angular - 1.2 * (anchor1 + anchor2)
}
