'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';

interface MobileAdminWrapperProps {
  children: React.ReactNode;
}

export default function MobileAdminWrapper({ children }: MobileAdminWrapperProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 pt-20 lg:pt-24">
      {/* ── Desktop Sidebar (always visible on md+) ── */}
      <div className="hidden md:block shrink-0">
        <AdminNav />
      </div>

      {/* ── Mobile Hamburger Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-gray-950 px-4 h-14 border-b border-gray-800 mt-0">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open admin navigation"
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium">Admin Menu</span>
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Panel ── */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <span className="text-white font-bold text-sm">Admin Navigation</span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close admin navigation"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <AdminNav />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-auto md:pt-0 pt-14">
        <div className="p-6 lg:p-10 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
