import { mulberry32 } from "./prng"

export function buildConstitution(seed: number) {
  const rand = mulberry32(seed)

  return {
    radialFreq: 6,
    angularFreq: 6,
    radialScale: 0.04 + rand() * 0.02,
    timeScale: 1.5 + rand() * 1.0,
    anchorStrength: 1.0 + rand() * 0.6,
    anchorSpread: 0.015 + rand() * 0.01
  }
}
