'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown, Users, GraduationCap, Star, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const t = useTranslations('hero');

  // ডাইনামিক ডেটা রাখার জন্য State তৈরি করা হলো
  const [siteData, setSiteData] = useState({
    students: '200+',
    teachers: '25+',
    years: '12+',
    title: '',
    subtitle: '',
    offerText: '',
    offerLink: '#',
    isOfferActive: false,
  });

  // API থেকে Settings-এর ডেটা আনার Effect
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();

        if (data) {
          setSiteData({
            students: data.totalStudents || '200+',
            teachers: data.totalTeachers || '25+',
            years: data.totalYears || '12+',
            title: data.heroTitle || '',
            subtitle: data.heroSubtitle || '',
            offerText: data.specialOfferText || '',
            offerLink: data.specialOfferLink || '#',
            isOfferActive: data.isSpecialOfferActive || false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // API থেকে আসা ডেটাগুলো দিয়ে Stats আপডেট করা হলো
  const stats = [
    { icon: Users, value: siteData.students, label: t('stat_students') },
    { icon: GraduationCap, value: siteData.teachers, label: t('stat_teachers') },
    { icon: Star, value: siteData.years, label: t('stat_years') },
  ];

  return (
    <>
      {/* Entrance animation keyframes */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes heroPulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.5); }
          50%       { box-shadow: 0 0 0 8px rgba(167, 139, 250, 0); }
        }
        .hero-badge   { animation: heroFadeUp 0.6s ease-out 0.1s both; }
        .hero-offer   { animation: heroFadeUp 0.5s ease-out 0.05s both; }
        .hero-heading { animation: heroFadeUp 0.7s ease-out 0.3s both; }
        .hero-sub     { animation: heroFadeUp 0.7s ease-out 0.5s both; }
        .hero-ctas    { animation: heroFadeUp 0.7s ease-out 0.65s both; }
        .hero-stats   { animation: heroFadeUp 0.7s ease-out 0.8s both; }
        .hero-scroll  { animation: heroFadeIn 1s ease-out 1.1s both; }
        .pulse-ring   { animation: heroPulseRing 2s ease-in-out infinite; }
      `}</style>

      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* ── Background Image with layered gradients ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')",
          }}
          aria-hidden="true"
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(30,27,75,0.92) 0%, rgba(49,46,129,0.85) 40%, rgba(76,29,149,0.88) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Decorative ambient glows */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        {/* ── Main Content ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 md:py-40">

          {/* 🌟 Special Offer Banner (ডাইনামিক) */}
          {siteData.isOfferActive && siteData.offerText && (
            <a
              href={siteData.offerLink}
              className="hero-offer inline-flex items-center gap-2 mb-6 px-5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-orange-500/30"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              {siteData.offerText}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}

          {/* Admission Badge */}
          <div className="hero-badge inline-flex items-center gap-2.5 bg-white/10 border border-white/20 text-white/95 text-xs sm:text-sm font-medium px-5 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-ring shrink-0" />
            {t('badge', { year: new Date().getFullYear() })}
          </div>

          {/* Main Headline (ডাইনামিক) */}
          <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {siteData.title || t('headline')}
          </h1>

          {/* Subtitle (ডাইনামিক) */}
          <p className="hero-sub text-lg sm:text-xl text-indigo-200/90 max-w-2xl mx-auto mb-12 leading-relaxed">
            {siteData.subtitle || t('subheadline')}
          </p>

          {/* CTA Buttons */}
          <div className="hero-ctas flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <a
              href="#contact"
              className="group flex items-center gap-2.5 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-white/25 hover:scale-105 active:scale-95 transition-all duration-300 text-base min-w-[180px] justify-center"
            >
              {t('cta_primary')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </a>
            <a
              href="#faculty"
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm text-base min-w-[180px]"
            >
              {t('cta_secondary')}
            </a>
          </div>

          {/* Stats Bar (ডাইনামিক) */}
          <div className="hero-stats grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/12 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/40 to-violet-500/40 rounded-xl flex items-center justify-center mb-1">
                  <Icon className="w-5 h-5 text-indigo-200" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                  {value}
                </span>
                <span className="text-xs sm:text-sm text-indigo-300 text-center leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#founder"
          className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/90 transition-colors duration-200 animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-7 h-7" />
        </a>
      </section>
    </>
  );
}