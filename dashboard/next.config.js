/** @type {import('next').NextConfig} */
// const path = require("path");
// load root .env file
// require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["www.covalenthq.com"],
  },
};

module.exports = nextConfig;
