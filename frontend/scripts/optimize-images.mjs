import fs from 'fs/promises';
import path from 'path';

// Note: This script requires 'sharp' to be installed (npm i -D sharp).
// It converts images in public/assets to optimized WebP formats.
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function optimizeImages() {
  try {
    const sharp = (await import('sharp')).default;
    const files = await fs.readdir(PUBLIC_DIR);
    
    for (const file of files) {
      if (file.match(/\.(png|jpe?g)$/i)) {
        const inputPath = path.join(PUBLIC_DIR, file);
        const outputPath = path.join(PUBLIC_DIR, file.replace(/\.(png|jpe?g)$/i, '.webp'));
        
        console.log(`Optimizing ${file}...`);
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
          
        console.log(`Created ${outputPath}`);
      }
    }
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      console.warn('⚠️ O pacote "sharp" não está instalado. Execute: npm i -D sharp para habilitar este script de otimização.');
    } else {
      console.error('Erro na otimização:', err);
    }
  }
}

optimizeImages();
