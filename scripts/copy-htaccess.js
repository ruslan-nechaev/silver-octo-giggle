// Cross-platform copy of public/.htaccess to dist/.htaccess
const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

try {
  const src = path.resolve(__dirname, '..', 'public', '.htaccess');
  const dest = path.resolve(__dirname, '..', 'dist', '.htaccess');
  if (fs.existsSync(src)) {
    ensureDirectoryExists(dest);
    fs.copyFileSync(src, dest);
    console.log('Copied .htaccess to dist/.htaccess');
  } else {
    console.log('No public/.htaccess found. Skipping.');
  }
} catch (err) {
  console.error('Failed to copy .htaccess:', err);
  process.exit(1);
}


