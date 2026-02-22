import type { NextConfig } from "next"

const isGithubActions = process.env.GITHUB_ACTIONS === "true"
const repository = process.env.GITHUB_REPOSITORY ?? ""
const repoName = repository.split("/")[1] ?? ""
const isUserOrOrgPages = repoName.toLowerCase().endsWith(".github.io")

const basePath =
  isGithubActions && repoName && !isUserOrOrgPages ? `/${repoName}` : ""

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true
}

export default nextConfig
