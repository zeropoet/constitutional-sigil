import SigilCanvas from "@/components/SigilCanvas"

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "white"
      }}
    >
      <SigilCanvas />
    </main>
  )
}
