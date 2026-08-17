/** @type {import('next').NextConfig} */
const nextConfig = {
  // The OG image route reads its bundled font files at runtime; make sure the
  // serverless bundle carries them.
  experimental: {
    outputFileTracingIncludes: {
      "/api/og/[id]": ["./app/api/og/_fonts/*.ttf"],
    },
  },
};

export default nextConfig;
