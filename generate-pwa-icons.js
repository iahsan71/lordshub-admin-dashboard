const fs = require('fs');
const path = require('path');

// Simple script to create placeholder PWA icons
// For production, use proper tools like:
// - https://realfavicongenerator.net/
// - https://www.pwabuilder.com/imageGenerator

const createPlaceholderSVG = (size, text) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>
`;

console.log('Creating placeholder PWA icons...\n');
console.log('⚠️  These are temporary placeholders!');
console.log('For production, create proper icons using:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://www.pwabuilder.com/imageGenerator\n');

// Create SVG placeholders (browsers will accept these temporarily)
const svg192 = createPlaceholderSVG(192, 'AD');
const svg512 = createPlaceholderSVG(512, 'AD');

fs.writeFileSync(path.join(__dirname, 'public', 'pwa-192x192.svg'), svg192);
fs.writeFileSync(path.join(__dirname, 'public', 'pwa-512x512.svg'), svg512);

console.log('✓ Created public/pwa-192x192.svg');
console.log('✓ Created public/pwa-512x512.svg\n');

// Update vite config to use SVG icons temporarily
console.log('Note: Update vite.config.ts icons to use .svg extension');
console.log('Or run: ./create-pwa-icons.sh (requires ImageMagick)');
