/** @type {import('next').NextConfig} */
const nextConfig = {
  // Glaze search reads the compact prebuilt index at runtime; the 12 MB raw
  // recipe sources (data/glazes) are build-script input only and never shipped.
  outputFileTracingIncludes: {
    "/api/glazes/**": ["./data/glaze-index/**", "./data/materials/**"],
    "/api/chat": ["./data/glaze-index/**", "./data/materials/**"],
    "/glazes/**": ["./data/glaze-index/**", "./data/materials/**"],
  },
  outputFileTracingExcludes: {
    "*": ["./data/glazes/**", "./scripts/**", "./node_modules/onnxruntime-node/**", "./node_modules/@huggingface/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
