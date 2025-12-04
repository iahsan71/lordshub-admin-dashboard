#!/bin/bash

# Script to create PWA icons from favicon.ico
# Requires ImageMagick: brew install imagemagick

if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed."
    echo "Install it with: brew install imagemagick"
    echo ""
    echo "Or create icons manually at:"
    echo "- https://realfavicongenerator.net/"
    echo "- https://www.pwabuilder.com/imageGenerator"
    exit 1
fi

echo "Creating PWA icons from favicon.ico..."

# Create 192x192 icon
convert public/favicon.ico -resize 192x192 -background white -alpha remove -alpha off public/icon-192.png

# Create 512x512 icon
convert public/favicon.ico -resize 512x512 -background white -alpha remove -alpha off public/icon-512.png

echo "✓ Created public/icon-192.png"
echo "✓ Created public/icon-512.png"
echo ""
echo "Now update vite.config.ts to use these icons!"
