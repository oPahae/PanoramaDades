import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { headerItems } from '@/utils/constants';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';

const Header = () => {
  const [currency, setCurrency] = useState('CHF');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('currency');
    if (stored) {
      setCurrency(stored);
    } else {
      fetch('https://ipwho.is/')
        .then(res => res.json())
        .then(data => {
          if (!data.success) throw new Error('Geo failed');
          const countryCurrencyMap = { MA: 'MAD', US: 'USD', CH: 'CHF' };
          const detectedCurrency = countryCurrencyMap[data.country_code] || 'USD';
          setCurrency(detectedCurrency);
          localStorage.setItem('currency', detectedCurrency);
        })
        .catch(() => {
          setCurrency('USD');
        });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const screenHeight = window.innerHeight;
      if (window.scrollY >= screenHeight - 200 || router.pathname.includes('gallery')) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    setCurrency(value);
    localStorage.setItem('currency', value);
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-stone-50/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className={`group flex items-center space-x-4 ${!scrolled && "-translate-y-100"} duration-500`}>
            <div className="h-16 relative">
              <img
                src="/logo.png"
                className="relative z-10 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                alt="Logo"
              />
            </div>
          </Link>

          {/* Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {headerItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="relative px-6 py-3 group"
              >
                <span className={`text-sm tracking-wider uppercase font-medium ${scrolled ? "text-stone-700 group-hover:text-amber-900" : "text-white group-hover:text-amber-500"} transition-colors duration-300`}>
                  {item.label}
                </span>
                <div className="absolute bottom-0 left-6 right-6 h-px bg-amber-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className={`px-4 py-2 bg-transparent border border-stone-300 ${scrolled ? "text-stone-900" : "text-white"} text-sm tracking-wider uppercase font-medium rounded cursor-pointer hover:border-amber-900 transition-all focus:outline-none focus:border-amber-900`}
            >
              <option value="MAD">MAD</option>
              <option value="USD">USD</option>
              <option value="CHF">CHF</option>
            </select>
            <Link href="/rooms" className="group relative px-8 py-3 overflow-hidden rounded font-medium text-sm tracking-wider uppercase text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10">BOOK NOW</span>
            </Link>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? "text-stone-900" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-stone-900" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 animate-slide-down">
            <nav className="flex flex-col space-y-1 bg-white rounded-xl border border-stone-200 p-4 shadow-2xl">
              {headerItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-stone-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-amber-900" />
                    <span className="text-stone-900 font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-900 transition-colors" />
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-stone-200 space-y-3">
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="w-full px-4 py-3 border border-stone-300 text-stone-900 rounded-lg"
                >
                  <option value="MAD">MAD</option>
                  <option value="USD">USD</option>
                  <option value="CHF">CHF</option>
                </select>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium shadow-lg">
                  BOOK NOW
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header;