import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import type { IncomingMessage } from 'node:http';
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig, loadEnv } from 'vite';

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const supabasePathRe = /[/\\]node_modules[/\\]@supabase[/\\].*\.js$/;

/** Pré-bundle dev : esbuild n’utilise pas les plugins Vite `transform` (d’où l’erreur GoTrueClient.js.map). */
function supabaseStripSourcemapEsbuild() {
  return {
    name: 'strip-supabase-sourcemap-esbuild',
    // esbuild est fourni par Vite ; pas de typage strict ici.
    setup(build: { onLoad: (opts: { filter: RegExp }, fn: (args: { path: string }) => Promise<unknown>) => void }) {
      build.onLoad({ filter: supabasePathRe }, async (args) => {
        const contents = await readFile(args.path, 'utf8');
        const stripped = contents.replace(/\/\/# sourceMappingURL=.*$/gm, '');
        if (stripped === contents) return null;
        return { contents: stripped, loader: 'js' as const };
      });
    },
  };
}

/** Build Rollup : retire les sourceMappingURL pour @supabase. */
function stripSupabaseSourceMapUrl(): Plugin {
  return {
    name: 'strip-supabase-sourcemap-url',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('node_modules') && id.includes('@supabase') && id.endsWith('.js')) {
        return code.replace(/\/\/# sourceMappingURL=.*$/gm, '');
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
  plugins: [
    stripSupabaseSourceMapUrl(),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    esbuildOptions: {
      plugins: [supabaseStripSourcemapEsbuild() as import('esbuild').Plugin],
    },
  },
  build: {
    target: 'es2022',
    cssMinify: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          if (!norm.includes('node_modules')) return;
          if (norm.includes('@supabase')) return 'supabase';
          if (norm.includes('lucide-react')) return 'lucide';
          if (norm.includes('date-fns')) return 'date-fns';
          if (norm.includes('node_modules/motion/')) return 'motion';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: true,
  },
};
});
