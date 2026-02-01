import React, { useState } from 'react';
import Link from 'next/link';
import { headerAdminItems } from '@/utils/constants';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-stone-50/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded hover:bg-stone-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-stone-900" /> : <Menu className="w-6 h-6 text-stone-900" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-lg animate-slide-down z-40">
          <nav className="flex flex-col space-y-1 p-4">
            {headerAdminItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-stone-50 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-amber-900" />
                  <span className="text-stone-900 font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-900 transition-colors" />
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        onMouseOver={() => setDesktopOpen(true)}
        onMouseLeave={() => setDesktopOpen(false)}
        className={`hidden lg:flex fixed top-0 right-0 h-full z-50 bg-stone-50/95 backdrop-blur-xl border-l border-stone-200/50 shadow-lg transition-all duration-500 ${
          desktopOpen ? 'w-64' : 'w-16'
        } flex-col justify-between`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & toggle */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200">
            {desktopOpen && (
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              </Link>
            )}
            <button
              onClick={() => setDesktopOpen(!desktopOpen)}
              className="p-2 rounded hover:bg-stone-100 transition-colors"
            >
              {desktopOpen ? <ChevronRight className="w-5 h-5 text-stone-900" /> : <ChevronLeft className="w-5 h-5 text-stone-900" />}
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 flex flex-col mt-4">
            {headerAdminItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center px-4 py-3 hover:bg-stone-100 transition-all group rounded-md mb-1"
              >
                <item.icon className="w-6 h-6 text-amber-900" />
                {desktopOpen && <span className="ml-3 text-stone-900 font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;