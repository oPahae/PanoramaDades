import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { headerAgentItems } from '@/utils/constants';
import { ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${true
        ? 'bg-stone-50/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/agent" className={`group flex items-center space-x-4 ${!true && "-translate-y-100"} duration-500`}>
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
            {headerAgentItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="relative px-6 py-3 group"
              >
                <span className={`text-sm tracking-wider uppercase font-medium ${true ? "text-stone-700 group-hover:text-amber-900" : "text-white group-hover:text-amber-500"} transition-colors duration-300`}>
                  {item.label}
                </span>
                <div className="absolute bottom-0 left-6 right-6 h-px bg-amber-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </Link>
            ))}
          </nav>
          <button
            onClick={() => fetch('/api/auth/agentLogout').then(res => res.json()).then(data => { console.log(data); if (data.message === 'success') router.push('/agent/login') }).catch(err => alert(err))}
            className="group relative px-4 py-3 overflow-hidden rounded font-medium text-sm tracking-wider uppercase text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className={`relative z-10`}>LOGOUT</span>
          </button>

          {/* Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${true ? "text-stone-900" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${true ? "text-stone-900" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 animate-slide-down">
            <nav className="flex flex-col space-y-1 bg-white rounded-xl border border-stone-200 p-4 shadow-2xl">
              {headerAgentItems.map((item, i) => (
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
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header