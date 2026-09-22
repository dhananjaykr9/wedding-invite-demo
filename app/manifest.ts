// frontend/app/manifest.ts
import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.title,
    short_name: "Reshimgaath",
    description: SITE_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCF0',
    theme_color: '#FDFCF0',
    icons: [
      {
        src: '/images/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}