import MobileAdminWrapper from '@/components/admin/MobileAdminWrapper';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <MobileAdminWrapper>{children}</MobileAdminWrapper>
    </NextIntlClientProvider>
  );
}