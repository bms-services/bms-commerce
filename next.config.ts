import path from "node:path";
import { fileURLToPath } from "node:url";
import { configHeader } from '@/utils/constants';
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {
    root: projectRoot,
  },
  serverExternalPackages: ["graphql"],
  devIndicators: false,
  outputFileTracingRoot: projectRoot,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT
        ? (() => {
          try {
            const url = new URL(process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT);
            return [
              {
                protocol: url.protocol.replace(":", "") as "https" | "http",
                hostname: url.hostname,
              },
            ];
          } catch {
            console.warn(
              "Invalid NEXT_PUBLIC_BAGISTO_ENDPOINT URL:",
              process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT,
            );
            return [];
          }
        })()
        : []),
    ],
  },

  async headers() {
    if (process.env.NODE_ENV === "development") {
      return configHeader.filter((header) => !header.source.startsWith("/_next/"));
    }

    return configHeader;
  },
  compress: true,
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
