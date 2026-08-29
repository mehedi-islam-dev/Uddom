'use client';

import AdminNav from '@/components/admin/AdminNav';

interface MobileAdminWrapperProps {
  children: React.ReactNode;
}

export default function MobileAdminWrapper({ children }: MobileAdminWrapperProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNav />

      {/* ── Main Content ── */}
      <div className="flex-1 w-full overflow-x-hidden pt-16 md:pt-0">
        <div className="p-4 md:p-6 lg:p-10 max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
