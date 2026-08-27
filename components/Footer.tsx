import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import { SiteSettingsData } from '@/lib/types';

interface FooterProps {
  settings: SiteSettingsData;
}

export default function Footer({ settings }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">{settings.coachingName}</span>
            </div>
            <p className="text-sm leading-relaxed">{t('tagline')}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              {t('links_title')}
            </h3>
            <ul className="space-y-2">
              {[
                { label: tNav('home'), href: '#home' },
                { label: tNav('faculty'), href: '#faculty' },
                { label: tNav('notices'), href: '#notices' },
                { label: tNav('success_stories'), href: '#success-stories' },
                { label: tNav('students'), href: '#students' },
                { label: tNav('contact'), href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              {t('contact_title')}
            </h3>
            <ul className="space-y-3">
              {settings.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="text-sm hover:text-indigo-400 transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm hover:text-indigo-400 transition-colors break-all">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  <span className="text-sm">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          <p>
            © {year} {settings.coachingName}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
