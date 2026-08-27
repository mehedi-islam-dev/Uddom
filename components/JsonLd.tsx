import { SiteSettingsData } from '@/lib/types';

interface JsonLdProps {
  settings: SiteSettingsData;
}

export default function JsonLd({ settings }: JsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: settings.coachingName,
    description: settings.metaDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
    },
    telephone: settings.phone,
    email: settings.email,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
