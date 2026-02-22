"use client"

import { useEffect, useState } from "react"

import SigilCanvas2D from "@/components/SigilCanvas"
import SigilSurface3D from "@/components/SigilSurface3D"

function randomSeed(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint32Array(1))[0]
  }
  return Math.floor(Math.random() * 4294967296)
}

export default function Home() {
  const [mode, setMode] = useState<"2d" | "3d">("2d")
  const [seed, setSeed] = useState<number | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const rawSeed = url.searchParams.get("seed")

    let nextSeed: number
    if (rawSeed && /^-?\d+$/.test(rawSeed)) {
      nextSeed = Number.parseInt(rawSeed, 10) >>> 0
    } else {
      nextSeed = randomSeed() >>> 0
      url.searchParams.set("seed", String(nextSeed))
      window.history.replaceState(null, "", url.toString())
    }

    if (rawSeed !== String(nextSeed)) {
      url.searchParams.set("seed", String(nextSeed))
      window.history.replaceState(null, "", url.toString())
    }

    setSeed(nextSeed)
  }, [])

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        background: "white"
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
        <button
          onClick={() => setMode(mode === "2d" ? "3d" : "2d")}
          style={{
            background: "white",
            border: "1px solid black",
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer"
          }}
        >
          {mode === "2d" ? "3D" : "2D"}
        </button>
      </div>

      {seed !== null && (mode === "2d" ? <SigilCanvas2D seed={seed} /> : <SigilSurface3D seed={seed} />)}
    </main>
  )
}
