import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Instagram, Facebook, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa'
import { hotelInfos } from '@/utils/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contacts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      console.log('Success:', data);
      alert('Message envoyé avec succès');

      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      {/* BG Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-110"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-xs tracking-[0.4em] uppercase text-amber-200 font-semibold">
                Get in Touch
              </div>
              <div className="w-16 h-px bg-amber-400/50 mx-auto" />
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-none animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Contact Us
            </h1>

            <p
              className="text-xl md:text-2xl text-stone-100 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              We're here to help make your valley experience unforgettable
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-20 max-w-[1400px] mx-auto px-8 lg:px-16 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Phone,
              title: 'Phone',
              info: hotelInfos.phones,
              link: ``,
              color: 'from-amber-600 to-amber-800'
            },
            {
              icon: FaWhatsapp,
              title: 'WhatsApp',
              info: [hotelInfos.whatsapp],
              link: `https://wa.me/${hotelInfos.whatsapp.replace(/\D/g, "")}`,
              color: 'from-green-600 to-green-800'
            },
            {
              icon: Mail,
              title: 'Email',
              info: [hotelInfos.email],
              link: `mailto:${hotelInfos.email}`,
              color: 'from-blue-600 to-blue-800'
            },
            {
              icon: MapPin,
              title: 'Location',
              info: [hotelInfos.location],
              link: '#map',
              color: 'from-red-600 to-red-800'
            }
          ].map((contact, i) => (
            <a
              key={i}
              href={contact.link}
              target='_blank'
              className="group bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-stone-200/50 hover:shadow-2xl hover:border-amber-900/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <contact.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2 tracking-wider uppercase text-xs">
                {contact.title}
              </h3>
              {contact.info.map((inf, idx) => (
                <p className="text-stone-600 text-sm leading-relaxed" key={idx}>
                  {inf}
                </p>
              ))}
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-32 px-8 lg:px-16 relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Form */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                  Send us a Message
                </div>
                <div className="w-16 h-px bg-amber-900" />
              </div>

              <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                Let's Start a
                <br />
                <span className="italic text-amber-900">Conversation</span>
              </h2>

              <p className="text-lg text-stone-600 leading-relaxed font-light">
                Whether you're planning your stay, have questions about our services, or simply want to know more about the valley, we're here to help. Fill out the form and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-3 group">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full px-6 py-4 bg-white border-2 border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-3 group">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-6 py-4 bg-white border-2 border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-3 group">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <span>Subject</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Booking Inquiry"
                    required
                    className="w-full px-6 py-4 bg-white border-2 border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-3 group">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <span>Message</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your plans..."
                    required
                    rows="6"
                    className="w-full px-6 py-4 bg-white border-2 border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full group relative px-6 py-5 rounded-lg font-semibold tracking-wider uppercase text-white overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Send Message</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </form>

              {/* Additional Info */}
              <div className="pt-8 border-t border-stone-200 space-y-4">
                <div className="flex items-start space-x-3 text-stone-600">
                  <Clock className="w-5 h-5 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-stone-900 mb-1">Response Time</div>
                    <div className="text-sm">We typically respond within 24 hours</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 pt-6">
                <span className="text-sm text-stone-600 font-semibold uppercase tracking-wider">Follow Us</span>
                <div className="flex space-x-3">
                  {[
                    { icon: Instagram, link: hotelInfos.instagram },
                    { icon: Facebook, link: hotelInfos.facebook },
                    { icon: Twitter, link: hotelInfos.twitter },
                    { icon: Linkedin, link: hotelInfos.linkedin }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-amber-900 hover:text-white transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div id="map" className="space-y-8">
              <div className="space-y-4">
                <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                  Find Us
                </div>
                <div className="w-16 h-px bg-amber-900" />
              </div>

              <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                Visit Us in
                <br />
                <span className="italic text-amber-900">Dades Valley</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-stone-200 shadow-lg">
                  <MapPin className="w-6 h-6 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-stone-900 mb-2 text-lg">Our Location</div>
                    <p className="text-stone-600 leading-relaxed">
                      {hotelInfos.location}
                    </p>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-stone-200 group">
                  <div className="aspect-[4/5] relative">
                    <iframe
                      title="Google Maps Location"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(hotelInfos.location)}&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Overlay for better design integration */}
                  <div className="absolute inset-0 pointer-events-none border-4 border-white/10 rounded-2xl" />
                </div>

                {/* Directions Card */}
                <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-serif font-bold mb-4">Getting Here</h3>
                  <ul className="space-y-3 text-amber-50">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                      <span>3 hours drive from Marrakech</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                      <span>Located in the heart of Dades Valley</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                      <span>Free parking available on-site</span>
                    </li>
                  </ul>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hotelInfos.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-white text-amber-900 rounded-lg font-medium hover:bg-amber-50 transition-colors group"
                  >
                    <span>Get Directions</span>
                    <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8 lg:px-16 overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Ready to Experience
            <br />
            <span className="italic text-amber-400">The Valley?</span>
          </h2>
          <p className="text-xl text-stone-300 mb-12 font-light">
            Book your stay and discover the magic of Dades Valley
          </p>
          <a
            href="/#home"
            className="inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-semibold tracking-wider uppercase shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all group"
          >
            <span>Book Now</span>
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );

}
