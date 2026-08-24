import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) as Locale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
