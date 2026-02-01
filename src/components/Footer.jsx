import React from 'react'
import Link from 'next/link'
import { hotelInfos } from '@/utils/constants'
import { Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="relative bg-stone-900 text-white pt-24 pb-12">
            <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <div className="text-3xl font-serif font-bold mb-2">
                                {hotelInfos.name}
                            </div>
                        </div>
                        <p className="text-stone-400 leading-relaxed font-light">
                            A sanctuary in the Atlas Mountains, where tradition meets contemporary luxury.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm tracking-[0.3em] uppercase font-semibold mb-6 text-amber-400">
                            Navigate
                        </h3>
                        <ul className="space-y-3">
                            {['Rooms', 'Dining', 'Experiences', 'Contact'].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={`/${link.toLowerCase()}`}
                                        className="text-stone-400 hover:text-white transition-colors inline-flex items-center space-x-2 group"
                                    >
                                        <span className="w-0 h-px bg-amber-400 group-hover:w-4 transition-all" />
                                        <span>{link}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm tracking-[0.3em] uppercase font-semibold mb-6 text-amber-400">
                            Contact
                        </h3>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span>{hotelInfos.location}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <FaWhatsapp className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span>{hotelInfos.whatsapp}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span>{hotelInfos.email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-sm tracking-[0.3em] uppercase font-semibold mb-6 text-amber-400">
                            Connect
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: Facebook, href: hotelInfos.facebook },
                                { icon: Instagram, href: hotelInfos.instagram },
                                { icon: Twitter, href: hotelInfos.twitter },
                                { icon: Linkedin, href: hotelInfos.linkedin },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all group"
                                >
                                    <social.icon className="w-5 h-5 text-stone-400 group-hover:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lt7t */}
                <div className="flex justify-center items-center border-t border-b border-white/10 py-8 mb-8">
                    <img src="/footer-imgs.png" className="h-20 opacity-60" alt="Awards" />
                </div>
                <div className="text-center text-sm text-stone-500">
                    <p>© 2026 {hotelInfos.name} Hotel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer