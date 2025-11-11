// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

const compilerConfig = { 
  target: '19' // can be '17' | '18' | '19', default is 19
};
// https://astro.build/config
export default defineConfig({
  site: 'https://imperador-building.com',
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['pdfjs-dist']
    },
    optimizeDeps: {
      exclude: ['pdfjs-dist']
    }
  },

  integrations: [
    react({
      babel: {
        plugins: [
          // make sure this is first in the plugins list
          ["babel-plugin-react-compiler", compilerConfig] 
        ]
      }
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          pt: 'pt',
        },
      },
    })
  ],
  adapter: vercel()
});