import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow all HTTPS image sources (broad whitelist for external URLs)
      { protocol: 'https', hostname: '**' },
      // ImgBB CDN domains — explicitly listed for clarity and future tightening
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
