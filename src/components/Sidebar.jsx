import React, { useState } from 'react';
import Link from 'next/link';
import { headerAdminItems } from '@/utils/constants';
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const router = useRouter();

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
          <button
            onClick={() => fetch('/api/auth/rootLogout').then(res => res.json()).then(data => { console.log(data); if(data.message === 'success') router.push('/admin/login')}).catch(err => alert(err))}
            className="group w-full relative px-4 py-3 overflow-hidden rounded font-medium text-sm tracking-wider uppercase text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className={`relative z-10`}>LOGOUT</span>
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        onMouseOver={() => setDesktopOpen(true)}
        onMouseLeave={() => setDesktopOpen(false)}
        className={`hidden lg:flex fixed top-0 right-0 h-full z-50 bg-stone-50/95 backdrop-blur-xl border-l border-stone-200/50 shadow-lg transition-all duration-500 ${desktopOpen ? 'w-64' : 'w-16'
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
          <nav className="flex-1 flex flex-col mt-2">
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
          <button
            onClick={() => fetch('/api/auth/rootLogout').then(res => res.json()).then(data => { console.log(data); if(data.message === 'success') router.push('/admin/login')}).catch(err => alert(err))}
            className="group relative px-4 py-3 overflow-hidden rounded font-medium text-sm tracking-wider uppercase text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className={`relative z-10 ${!desktopOpen && 'hidden'}`}>LOGOUT</span>
            <LogOut className={`w-6 h-6 relative z-10 ${desktopOpen && 'hidden'}`} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;