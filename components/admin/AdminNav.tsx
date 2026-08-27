'use client';

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
} from 'lucide-react';

export default function AdminNav() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="w-64 min-h-screen bg-gray-950 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
          <p className="text-gray-500 text-xs">Coaching Center</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900'
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
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
