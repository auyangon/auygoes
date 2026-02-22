// build.js - Direct build script for Vercel
import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runBuild() {
  try {
    console.log('🚀 Starting Vite build...');
    
    await build({
      root: __dirname,
      logLevel: 'info',
      build: {
        outDir: 'dist',
        emptyOutDir: true
      }
    });
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

runBuild();