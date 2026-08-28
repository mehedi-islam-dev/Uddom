import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow all HTTPS image sources (broad whitelist for external URLs pasted by admins)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default withNextIntl(nextConfig);
