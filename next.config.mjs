/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Book-chunk JSON is loaded at runtime via fs (string paths). Without this,
  // Vercel/Next file tracing omits personas/**/*.json and production only gets
  // the small hand-curated claim banks (~30 chunks instead of thousands).
  outputFileTracingIncludes: {
    "/api/chat": ["./personas/**/*.json"],
  },
};

export default nextConfig;
