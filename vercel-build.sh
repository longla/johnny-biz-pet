#!/bin/bash

# Set npm registry to Cloudflare's mirror which is often more reliable
echo "Setting npm registry to Cloudflare mirror..."
npm config set registry https://registry.npmjs.cf/

# Install dependencies with yarn
echo "Installing dependencies..."
yarn install --network-timeout 300000 --prefer-offline --frozen-lockfile

# Build the Next.js app
echo "Building Next.js app..."
yarn build

# Generate sitemap
echo "Generating sitemap..."
yarn postbuild

echo "Build completed successfully!" 