import path from 'node:path'
import type { NextConfig } from 'next'

// Server code lives in ../backend, outside this app directory. Pin the root to
// the repo so the bundler and the standalone file tracer both follow imports
// across that boundary instead of inferring frontend/ as the workspace root.
const repoRoot = path.join(__dirname, '..')

// The site renders remote photography (Unsplash placeholders today, Supabase
// Storage uploads once staff replace them). Allow-list both hosts so next/image
// can be adopted incrementally without another config change.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      ...(supabaseHost
        ? [{ protocol: 'https' as const, hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
        : []),
    ],
  },
}

export default nextConfig
