import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import type { ReactNode } from "react"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Constitutional Sigil",
  description: "Live equation renderer for a symmetric generative seal."
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={ibmPlexMono.className} style={{ margin: 0 }}>
        <style>{`
          a,
          a:visited,
          a:hover,
          a:active {
            color: #000;
          }
        `}</style>
        {children}
      </body>
    </html>
  )
}
