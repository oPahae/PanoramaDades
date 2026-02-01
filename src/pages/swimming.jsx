import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';
import { hotelInfos } from '@/utils/constants';

export default function Rooms() {
  const [currency, setCurrency] = useState('USD');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'CHF' : 'USD';
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const galleryImages = [
    { url: '/swimming/main.jpg', span: 'col-span-2 row-span-2' },
    { url: '/swimming/1.jpg', span: 'col-span-1 row-span-1' },
    { url: '/swimming/2.jpg', span: 'col-span-1 row-span-1' },
    { url: '/swimming/3.jpg', span: 'col-span-1 row-span-2' },
    { url: '/swimming/4.jpg', span: 'col-span-1 row-span-1' },
    { url: '/swimming/5.jpg', span: 'col-span-2 row-span-1' },
  ];

  const testimonials = [
    {
      text: 'The Valley View Suite exceeded all expectations. Waking up to those mountain views was absolutely magical. The staff attention to detail made our anniversary unforgettable.',
      name: 'Sarah Mitchell',
      country: 'United Kingdom',
      stars: 5,
    },
    {
      text: 'Staying in the Traditional Room felt like stepping into authentic Morocco while still enjoying every modern comfort. The craftsmanship and design are truly exceptional.',
      name: 'Jean-Pierre Dubois',
      country: 'France',
      stars: 5,
    },
    {
      text: 'Our family suite was perfect for our kids. Spacious, comfortable, and those valley views! The team went above and beyond to make our children feel welcome.',
      name: 'Emily Chen',
      country: 'Canada',
      stars: 5,
    },
    {
      text: 'The perfect blend of luxury and authenticity. Every room detail reflects the beauty of Dades Valley. I\'ve already booked my next visit!',
      name: 'Marco Rossi',
      country: 'Italy',
      stars: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden py-64">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-110 bg-[url('/swimming/main.jpg')]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
          <div className="space-y-8">
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-none">
                Swimming Pool
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation */}
      <section className="py-32 px-8 lg:px-16 relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                  Accommodations
                </div>
                <div className="w-16 h-px bg-amber-900" />
              </div>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
                Unveiling Serenity:
                <br />
                <span className="italic text-amber-900">Discover the Panoramic Pool Oasis of {hotelInfos.name}</span>
              </h2>

              <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light">
                <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-900 first-letter:leading-none first-letter:mt-1">
                  Indulge in a gastronomic adventure at The Restaurant, where the vibrant flavors and rich traditions of Moroccan cuisine come to life. Located at the heart of Panorama Dades Hotel, our restaurant offers a refined ambiance and a menu inspired by both local and international specialties.
                </p>
                <p>
                  Our talented chefs prepare each dish with fresh, locally sourced ingredients, from aromatic tagines to perfectly grilled meats, celebrating the essence of Moroccan gastronomy.
                </p>
                <p>
                  Enjoy a warm and inviting setting enhanced by traditional Moroccan décor, with the option to dine indoors or on our scenic outdoor terrace overlooking the stunning Dades Valley.
                </p>
                <p>
                  Whether for breakfast, lunch, or dinner, The Restaurant at Panorama Dades Hotel invites you on a memorable culinary journey filled with authentic flavors and unforgettable views.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] relative">
                <img
                  src="/swimming/main.jpg"
                  alt="Room Interior"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-32 px-8 lg:px-16 relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <div className="space-y-4 mb-8">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Visual Journey
              </div>
              <div className="w-16 h-px bg-amber-900 mx-auto" />
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6">
              Experience Through
              <br />
              <span className="italic text-amber-900">Images</span>
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              A glimpse into the spaces that await you
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl ${img.span}`}
              >
                <img
                  src={img.url}
                  alt={`Gallery ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 lg:px-16 relative bg-stone-900 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-6 py-2 border border-amber-400/30 rounded-full mb-8">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm tracking-[0.3em] uppercase text-amber-400 font-light">
                Guest Experiences
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              What Our Guests
              <br />
              <span className="italic text-amber-400">Are Saying</span>
            </h2>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 lg:p-16 border border-white/10">
              {/* Stars */}
              <div className="flex justify-center space-x-1 mb-8">
                {[...Array(testimonials[currentTestimonial].stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-stone-200 text-2xl leading-relaxed mb-12 font-light italic text-center max-w-4xl mx-auto">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="font-semibold text-white text-xl mb-2">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-stone-400">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{testimonials[currentTestimonial].country}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-stone-400 mt-2">
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>Verified Guest</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-12">
              <button
                onClick={prevTestimonial}
                className="group w-14 h-14 rounded-full bg-white/10 hover:bg-amber-400/90 border border-white/20 hover:border-amber-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                        ? 'bg-amber-400 w-8'
                        : 'bg-white/30 hover:bg-white/50'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="group w-14 h-14 rounded-full bg-white/10 hover:bg-amber-400/90 border border-white/20 hover:border-amber-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 lg:px-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">
            Ready to Experience
            <br />
            <span className="italic text-amber-900">The Valley?</span>
          </h2>
          <p className="text-xl text-stone-600 mb-12 font-light leading-relaxed">
            Book your perfect room today and start your journey into the heart of Morocco's most breathtaking landscape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rooms"
              className="group relative px-10 py-5 overflow-hidden rounded font-medium tracking-wider uppercase"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-white flex items-center space-x-3">
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="group px-10 py-5 rounded font-medium tracking-wider uppercase border-2 border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}