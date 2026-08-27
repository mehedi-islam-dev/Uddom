import AdminNav from '@/components/admin/AdminNav';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <AdminNav />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-10 max-w-5xl">{children}</div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
