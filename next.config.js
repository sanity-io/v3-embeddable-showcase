/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  images: { domains: ['cdn.sanity.io'] },
  env: {
    // Debug it all!!, or state-router for just sanity routing
    // https://www.npmjs.com/package/debug
    // /node_modules/sanity/lib/esm/router/utils/debug.js
    // DEBUG: '*',
  },
}

module.exports = nextConfig
