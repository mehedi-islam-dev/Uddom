import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { SiteSettingsData } from '@/lib/types';
import '@/app/globals.css'; // গ্লোবাল সিএসএস এখানে নিয়ে আসা হয়েছে

// ফন্টগুলো এখানে অ্যাড করা হলো
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700', '800'],
});

type Locale = 'en' | 'bn';

async function fetchSettings(): Promise<SiteSettingsData> {
  try {
    // In server components, always use localhost internally to avoid
    // routing to the production URL during local development
    const base =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/settings`, {
      cache: 'no-store', // Always fetch fresh so layout reflects admin changes
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  } catch {
    return {
      coachingName: 'Uddom Academic Care',
      logoUrl: '',
      address: '',
      phone: '',
      email: '',
      mapEmbedUrl: '',
      metaTitle: 'Uddom Academic Care',
      metaDescription: 'Quality education for academic excellence.',
    };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await fetchSettings();

  return {
    title: {
      default: settings.metaTitle || settings.coachingName,
      template: `%s | ${settings.coachingName}`,
    },
    description: settings.metaDescription,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    openGraph: {
      title: settings.metaTitle || settings.coachingName,
      description: settings.metaDescription,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      type: 'website',
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    ),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await fetchSettings();

  return (
    <html lang={locale} className={locale === 'bn' ? 'font-bengali' : ''} suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansBengali.variable} antialiased`} suppressHydrationWarning>
        <JsonLd settings={settings} />
        <NextIntlClientProvider messages={messages}>
          <Navbar coachingName={settings.coachingName} logoUrl={settings.logoUrl} />
          <main>{children}</main>
          <Footer settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}