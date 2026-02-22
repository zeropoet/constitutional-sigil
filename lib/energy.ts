import { buildConstitution } from "./constitution"

export function createEnergy(seed: number) {
  const C = buildConstitution(seed)

  return function energy(x: number, y: number, time: number) {
    const r = Math.sqrt(x * x + y * y)
    const theta = Math.atan2(y, x)

    const radial = Math.sin(C.radialFreq * (r * C.radialScale) - C.timeScale * time)
    const angular = 0.25 * Math.cos(C.angularFreq * theta)

    const anchor1 = Math.exp(-C.anchorSpread * ((x + 80) * (x + 80) + y * y))
    const anchor2 = Math.exp(-C.anchorSpread * ((x - 80) * (x - 80) + y * y))

    return radial + angular - C.anchorStrength * (anchor1 + anchor2)
  }
}
