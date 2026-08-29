'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  GraduationCap,
  Settings,
  UserCircle,
  LogOut,
  BookOpen,
  Bell,
  Trophy,
  Users,
  Menu, // Mobile menu icon
  X,    // Close icon
} from 'lucide-react';

export default function AdminNav() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // Mobile menu control state
  const [isOpen, setIsOpen] = useState(false);

  // Automatically close the mobile menu when a navigation link is clicked
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { href: `/${locale}/admin/teachers`, icon: GraduationCap, label: t('manage_teachers') },
    { href: `/${locale}/admin/notices`, icon: Bell, label: t('manage_notices') },
    { href: `/${locale}/admin/success-stories`, icon: Trophy, label: t('manage_success_stories') },
    { href: `/${locale}/admin/students`, icon: Users, label: t('manage_students') },
    { href: `/${locale}/admin/founder`, icon: UserCircle, label: t('manage_founder') },
    { href: `/${locale}/admin/settings`, icon: Settings, label: t('site_settings') },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push(`/${locale}/admin/login`);
  };

  return (
    <>
      {/* ── Mobile Top Bar (Only visible on small screens) ── */}
      <div className="md:hidden flex items-center justify-between bg-gray-950 px-4 py-3 fixed top-0 left-0 right-0 w-full z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ── Mobile Overlay Background ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar (Responsive) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
              <p className="text-gray-500 text-xs">Coaching Center</p>
            </div>
          </div>
          {/* Close Button only for mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}