'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, BookOpen, Globe } from 'lucide-react';

interface NavbarProps {
  coachingName: string;
  logoUrl?: string;
}

export default function Navbar({ coachingName, logoUrl }: NavbarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: t('home'), href: '#home' },
    { label: t('faculty'), href: '#faculty' },
    { label: t('notices'), href: '#notices' },
    { label: t('students'), href: '#students' },
    { label: t('success_stories'), href: '#success-stories' },
    { label: t('contact'), href: '#contact' },
  ];

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'bn' : 'en';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20'
          : 'bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href={`/${locale}#home`} className="flex items-center gap-2 group shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={coachingName} className="h-10 w-auto" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-indigo-300/50 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`font-extrabold text-lg tracking-tight transition-colors duration-300 ${
                    scrolled ? 'text-gray-900' : 'text-white drop-shadow-md'
                  }`}
                >
                  {coachingName}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 group ${
                  scrolled
                    ? 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    scrolled ? 'bg-indigo-500' : 'bg-white/70'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={switchLocale}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                scrolled
                  ? 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                  : 'border-white/40 text-white hover:bg-white/15 hover:border-white/60'
              }`}
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === 'en' ? t('lang_bn') : t('lang_en')}
            </button>

            {/* CTA Button */}
            <a
              href="#contact"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-indigo-400/40 hover:scale-105 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all duration-200"
            >
              {t('admissions')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
              scrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}
              >
                <X className="w-6 h-6" />
              </span>
              <span
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}
              >
                <Menu className="w-6 h-6" />
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Menu — smooth slide down */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl mb-4 border border-gray-100 overflow-hidden">
            <div className="flex flex-col p-3 gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 text-sm"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2 flex gap-2 px-1">
                <button
                  onClick={() => { switchLocale(); setIsOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors duration-150"
                >
                  <Globe className="w-4 h-4" />
                  {locale === 'en' ? t('lang_bn') : t('lang_en')}
                </button>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
                >
                  {t('admissions')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
