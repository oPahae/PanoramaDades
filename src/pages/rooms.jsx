import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Bed, Users, Eye, MapPin, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';

export default function Rooms() {
  const [currency, setCurrency] = useState('MAD');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/rooms/getAll');
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const toggleCurrency = () => {
    let newCurrency;
    switch (currency) {
      case 'MAD': newCurrency = 'USD'; break;
      case 'USD': newCurrency = 'CHF'; break;
      case 'CHF': newCurrency = 'MAD'; break;
      default: break;
    }
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const galleryImages = [
    { url: '/rooms/main.jpg', span: 'col-span-2 row-span-2' },
    { url: '/rooms/2.jpg', span: 'col-span-1 row-span-1' },
    { url: '/rooms/2.jpg', span: 'col-span-1 row-span-1' },
    { url: '/rooms/3.jpg', span: 'col-span-1 row-span-1' },
    { url: '/rooms/4.jpg', span: 'col-span-1 row-span-2' },
    { url: '/rooms/5.jpg', span: 'col-span-1 row-span-1' },
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
            className="absolute inset-0 bg-cover bg-center transform scale-110 bg-[url('/rooms/main.jpg')]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
          <div className="space-y-8">
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-none">
                Our Rooms
              </h1>
              <div className="flex items-center justify-center space-x-4 text-amber-200">
                <div className="h-px w-20 bg-amber-400/50" />
                <p className="text-xl md:text-2xl tracking-[0.4em] uppercase font-light">
                  Sanctuary in the Valley
                </p>
                <div className="h-px w-20 bg-amber-400/50" />
              </div>
            </div>

            <p
              className="text-xl md:text-2xl text-stone-100 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              Each room is a carefully crafted haven where comfort meets culture
            </p>
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

              <h2 className="text-5xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                Authentic Rooms:
                <br />
                <span className="italic text-amber-900 text-3xl line-clamp-3">Your Retreat in the Heart of Dades Valley</span>
              </h2>

              <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light">
                <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-900 first-letter:leading-none first-letter:mt-1">
                  Every room in our hotel tells a story. From the handwoven textiles adorning the walls to the carefully selected furnishings, each space is designed to immerse you in the rich cultural heritage of Morocco while providing the utmost in modern comfort.
                </p>
                <p>
                  Our accommodations range from intimate traditional rooms to spacious family suites, each offering unique perspectives of the magnificent Dades Valley. Floor-to-ceiling windows frame the dramatic landscape, transforming natural light into an ever-changing art installation throughout the day.
                </p>
                <p>
                  Whether you choose a room overlooking the verdant gardens, the rugged mountain peaks, or the sweeping valley below, you'll find the same commitment to excellence, authenticity, and your complete comfort.
                </p>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center space-x-4 pt-8">
                <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
                  Currency:
                </span>
                <button
                  onClick={toggleCurrency}
                  className="group relative px-8 py-3 overflow-hidden rounded-lg font-medium tracking-wider uppercase border-2 border-amber-900"
                >
                  <div className="absolute inset-0 bg-amber-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 text-amber-900 group-hover:text-white transition-colors">
                    {currency}
                  </span>
                </button>
                <span className="text-sm text-stone-500">
                  Click to switch between MAD, USD and CHF
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] relative">
                <img
                  src="/rooms/main.jpg"
                  alt="Room Interior"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="px-8 lg:px-16 relative bg-stone-100/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              Choose Your <span className="italic text-amber-900">Perfect Stay</span>
            </h2>
            <p className="text-lg text-stone-600 font-light">
              All prices displayed in {currency}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ?
              <p>Loading room...</p>
              :
              rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Room Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs tracking-wider uppercase font-semibold text-stone-900">
                      {room.category}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-amber-900/90 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                      <div className="text-xs">From</div>
                      <div className="text-2xl font-serif font-bold">
                        {currency === 'MAD' ? `${room.priceMAD} MAD` : (currency === 'USD' ? `${room.priceUSD} $` : `${room.priceCHF} CHF`)}
                      </div>
                    </div>
                  </div>

                  {/* Room Features */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center space-x-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Bed className="w-4 h-4" />
                      <span>{room.beds} Bed{room.beds > 1 && "s"}</span>
                    </span>
                    <span className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Users className="w-4 h-4" />
                      <span>{room.guests}</span>
                    </span>
                  </div>
                </div>

                {/* Room Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
                      {room.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-stone-500">
                      <Eye className="w-4 h-4 text-amber-900" />
                      <span>{room.view}</span>
                    </div>
                  </div>

                  <p className="text-stone-600 leading-relaxed font-light">
                    {room.description.length > 100 ? room.description.slice(0, 100) + "..." : room.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                    <div className="flex items-center space-x-4 text-sm text-stone-600">
                      <span className="flex items-center space-x-1">
                        <Bed className="w-4 h-4" />
                        <span>{room.beds} bed{room.beds > 1 ? 's' : ''}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{room.guests} guests</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/room?id=${room.id}`}
                    className="group/btn relative block w-full px-6 py-4 overflow-hidden rounded-lg font-medium tracking-wider uppercase text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 text-white flex items-center justify-center space-x-2">
                      <span>Check Details</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-32 px-8 lg:px-16 relative">
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
              href="/booking"
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