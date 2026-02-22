"use client"

import { useState } from "react"

import SigilCanvas2D from "@/components/SigilCanvas"
import SigilSurface3D from "@/components/SigilSurface3D"

export default function Home() {
  const [mode, setMode] = useState<"2d" | "3d">("2d")

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "white"
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
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

      {mode === "2d" ? <SigilCanvas2D /> : <SigilSurface3D />}
    </main>
  )
}
