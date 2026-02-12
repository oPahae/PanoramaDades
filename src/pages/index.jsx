import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bed, UtensilsCrossed, Mail, Calendar, Users, ChevronRight, Star, MapPin, Instagram, Facebook, Linkedin, Twitter, Menu, X, Award, Waves, ArrowRight, Check, Heart, Eye, Sunrise, Moon, Coffee, Wind } from 'lucide-react';
import { hotelInfos, testimonials } from '@/utils/constants';
import { FaWhatsapp } from 'react-icons/fa';

export default function HotelHome() {
  const [currency, setCurrency] = useState("MAD");
  const [blogs, setBlogs] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchRooms();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs/getAll');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setBlogs([]);
      console.log(err)
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms/getAll');
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms', error);
    }
  };

  useEffect(() => {
    const getCurrency = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('currency') || 'MAD';
      }
      return 'MAD';
    }
    setCurrency(getCurrency);
  });

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      <a
        href={`https://wa.me/${hotelInfos.whatsapp.replace(/\D/g, "")}`}
        target='_blank'
        className='fixed bottom-10 right-10 z-50 bg-white rounded-full hover:p-1 duration-200 cursor-pointer'
      >
        <FaWhatsapp size={44} color="#25D366" /> {/* taille et couleur personnalisable */}
      </a>

      {/* BG Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Hero*/}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-6">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-110 bg-[url('/hero.png')]"
            style={{
              transform: `translateY(20px)`,
              transition: 'transform 0.6s ease-out',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
          <div className="space-y-12">
            {/* Main Heading */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight text-white leading-none">
                {hotelInfos.name}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-amber-200">
                <div className="h-px w-20 bg-amber-400/50" />
                <p className="text-xl md:text-2xl tracking-[0.4em] uppercase font-light">
                  Dades Valley Retreat
                </p>
                <div className="h-px w-20 bg-amber-400/50" />
              </div>
            </div>

            {/* Tagline */}
            <p
              className="text-xl md:text-2xl text-stone-100 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              Discover Unparalleled Comfort and Hospitality in Dades Valley
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              <Link href="/rooms" className="group relative px-10 py-5 overflow-hidden rounded font-medium tracking-wider uppercase">
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0 bg-amber-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-stone-900 flex items-center space-x-3">
                  <span>Discover More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link href="/faq" className="group px-10 py-5 rounded font-medium tracking-wider uppercase border-2 border-white text-white hover:bg-white hover:text-stone-900 transition-all duration-300">
                Need Help ?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="relative z-40 max-w-6xl mx-auto px-8 lg:px-16">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl border border-stone-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'Arrival', type: 'date', placeholder: 'Select date' },
              { icon: Calendar, label: 'Departure', type: 'date', placeholder: 'Select date' },
              { icon: Users, label: 'Guests', type: 'number', min: '1', default: '2', placeholder: '2 guests' },
              { icon: Bed, label: 'Rooms', type: 'number', min: '1', default: '1', placeholder: '1 room' },
            ].map((field, i) => (
              <div key={i} className="space-y-3 group">
                <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <field.icon className="w-4 h-4 text-amber-900" />
                  <span>{field.label}</span>
                </label>
                <input
                  type={field.type}
                  min={field.min}
                  defaultValue={field.default}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                />
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href = "/rooms"} className="w-full mt-8 group relative px-6 py-5 rounded-lg font-semibold tracking-wider uppercase text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Check Availability</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-8 lg:px-16 relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Left Column - Text */}
            <div className="lg:col-span-5 space-y-10">
              {/* Section Label */}
              <div className="space-y-4">
                <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                  About Us
                </div>
                <div className="w-16 h-px bg-amber-900" />
              </div>

              {/* Heading */}
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                {hotelInfos.name} <span className="italic text-amber-900">Hotel:</span>
                <p className="italic text-gray-900 text-xl">Unveiling the Enchanting Beauty of Dades Valley</p>
              </h2>

              {/* Body Text */}
              <div className="space-y-6 text-stone-600 text-lg leading-loose font-light">
                <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-900 first-letter:leading-none first-letter:mt-1">
                  Discover the enchanting beauty of the Dades Valley at {hotelInfos.name} Hotel, where breathtaking panoramas and a tranquil ambiance combine to create an unforgettable Moroccan getaway. Nestled amidst the awe-inspiring Atlas Mountains, our hotel offers a truly immersive experience amidst nature’s splendor.
                </p>
                <p>
                  Step into our welcoming oasis, where rustic charm blends seamlessly with modern comforts. Our well-appointed rooms provide a cozy sanctuary, each designed to capture the essence of the surrounding landscape. Wake up to the soothing sounds of nature and be greeted by sweeping views of the Dades Valley from your private balcony.
                </p>
                <p>
                  Indulge in a delectable culinary journey at our on-site restaurant, where local flavors and international cuisine harmoniously intertwine. Savor traditional Moroccan dishes expertly prepared with fresh, locally sourced ingredients. As the sun sets over the valley, unwind with a refreshing drink at our bar, taking in the panoramic vistas that stretch as far as the eye can see.
                </p>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="lg:col-span-7 space-y-8">
              {/* Large Featured Image */}
              <div className="relative group overflow-hidden rounded-2xl">
                <div className="aspect-[4/3] relative">
                  <img
                    src="/swimming/3.png"
                    alt="Hotel View"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
                </div>
              </div>

              {/* Two Column Images */}
              <div className="grid grid-cols-2 gap-8">
                <div className="relative group overflow-hidden rounded-2xl">
                  <div className="aspect-square relative">
                    <img
                      src="/view4.jpg"
                      alt="Interior"
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl">
                  <div className="aspect-square relative">
                    <img
                      src="/view3.jpg"
                      alt="Detail"
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* To Gallery */}
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded font-medium tracking-wider uppercase shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all group"
              >
                <span>See more images</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>

              {/* Stats & Awards*/}
              <div className='flex flex-col justify-center items-center w-full gap-2'>
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {[
                    { number: '25+', label: 'Years', sublabel: 'Of Excellence' },
                    { number: '50K', label: 'Guests', sublabel: 'Welcomed' },
                    { number: '5⭐', label: 'Rating', sublabel: 'Average' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center group cursor-default">
                      <div className="text-4xl font-serif font-bold text-amber-900 mb-2 group-hover:scale-110 transition-transform">
                        {stat.number}
                      </div>
                      <div className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {stat.sublabel}
                      </div>
                    </div>
                  ))}
                </div>

                <br />

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-stone-200">
                  {[
                    { icon: Award, text: 'Best Valley Hotel 2025' },
                    { icon: Heart, text: 'Guest Favorite' },
                  ].map((award, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-stone-600">
                      <award.icon className="w-4 h-4 text-amber-900" />
                      <span>{award.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="pb-32 px-8 lg:px-16 relative bg-stone-100/50">
        <div className="max-w-[1600px] mx-auto">
          {/* Section Header */}
          <div className="max-w-3xl mb-20">
            <div className="space-y-4 mb-8">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Accommodations
              </div>
              <div className="w-16 h-px bg-amber-900" />
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Rooms & Suites
              <br />
              Designed for
              <br />
              <span className="italic text-amber-900">Serenity</span>
            </h2>
            <p className="text-xl text-stone-600 font-light leading-relaxed">
              Each room is a sanctuary, carefully curated to blend traditional Moroccan craftsmanship with contemporary comfort. Wake up to panoramic valley views and fall asleep under a blanket of stars.
            </p>
          </div>

          {/* Rooms Grid - Masonry Style */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Large Feature Room */}
            {rooms && rooms.length > 0 &&
              <div className="lg:col-span-7 group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
                  <div className="aspect-[16/11] relative overflow-hidden">
                    <img
                      src={rooms[0].image}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Room Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-3xl font-serif font-bold mb-2">{rooms[0].title}</h3>
                          <p className="text-stone-200 text-sm tracking-wider uppercase">{rooms[0].category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-stone-300">From</div>
                          <div className="text-3xl font-serif font-bold text-amber-400">{currency === "MAD" ? rooms[0].priceMAD + "MAD" : (currency === "USD" ? "$" + rooms[0].priceUSD : rooms[0].priceCHF + "CHF")}</div>
                          <div className="text-sm text-stone-300">per night</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="flex items-center space-x-2">
                          <Bed className="w-4 h-4" />
                          <span>King Bed</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{rooms[0].guests} Guests</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{rooms[0].view}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Two Stacked Rooms */}
            {rooms && rooms.length > 1 &&
              <div className="lg:col-span-5 space-y-8">
                {[
                  {
                    image: rooms[1].image,
                    title: rooms[1].title,
                    category: rooms[1].category,
                    priceMAD: rooms[1].priceMAD,
                    priceUSD: rooms[1].priceUSD,
                    priceCHF: rooms[1].priceCHF,
                  },
                  // {
                  //   image: '/rooms/2/main.jpg',
                  //   title: 'Traditional Room',
                  //   category: 'Classic Collection',
                  //   priceUSD: 299,
                  //   priceCHF: 399,
                  // },
                ].map((room, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={room.image}
                          alt={room.title}
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="text-xl font-serif font-bold mb-1">{room.title}</h3>
                              <p className="text-stone-200 text-xs tracking-wider uppercase">{room.category}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-stone-300">From</div>
                              <div className="text-2xl font-serif font-bold text-amber-400">{currency === "MAD" ? room.priceMAD + "MAD" : (currency === "USD" ? "$" + room.priceUSD : room.priceCHF + " CHF")}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* View All Link */}
          <div className="mt-16 text-center">
            <Link
              href="/rooms"
              className="inline-flex items-center space-x-3 group"
            >
              <span className="text-lg tracking-wider uppercase font-medium text-stone-900 group-hover:text-amber-900 transition-colors">
                Explore All Rooms
              </span>
              <ArrowRight className="w-5 h-5 text-amber-900 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant */}
      <section id="dining" className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left - Image */}
          <div className="relative h-[600px] lg:h-auto lg:min-h-screen">
            <img
              src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Restaurant"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-900/30 lg:to-stone-900/60" />
          </div>

          {/* Right - Content */}
          <div className="bg-stone-900 text-white p-12 lg:p-20 flex items-center">
            <div className="max-w-xl">
              <div className="space-y-4 mb-8">
                <div className="text-xs tracking-[0.4em] uppercase text-amber-400 font-semibold">
                  Culinary Experience
                </div>
                <div className="w-16 h-px bg-amber-400" />
              </div>

              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                The
                <br />
                <span className="italic text-amber-400">Restaurant</span>
              </h2>

              <div className="space-y-6 text-stone-300 text-lg leading-relaxed font-light mb-10">
                <p>
                  Savor the tastes of Morocco at The Restaurant, a culinary haven nestled within Panorama Dades Hotel. With a menu inspired by local flavors and international influences, our talented chefs create delectable dishes that will tantalize your taste buds.
                </p>
                <p>
                  Whether you’re seeking traditional Moroccan specialties or exploring global cuisines, our restaurant offers a dining experience that will leave you craving more. Join us for an unforgettable culinary adventure at Panorama Dades Hotel’s Restaurant.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: Coffee, text: 'Local Ingredients' },
                  { icon: Sunrise, text: 'Farm to Table' },
                  { icon: Moon, text: 'Sunset Dining' },
                  { icon: UtensilsCrossed, text: 'Traditional Flavors' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <feature.icon className="w-5 h-5 text-amber-400" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Gallery Preview */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  '/restaurant/1.jpg',
                  '/restaurant/2.jpg',
                  '/restaurant/3.jpg',
                ].map((img, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-lg aspect-square">
                    <img
                      src={img}
                      alt={`Dish ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              <Link
                href="/restaurant"
                className="inline-flex items-center space-x-3 px-8 py-4 border-2 border-amber-400 rounded font-medium tracking-wider uppercase hover:bg-amber-400 hover:text-stone-900 transition-all group"
              >
                <span>View Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Swimming */}
      <section id="wellness" className="py-32 px-8 lg:px-16 relative overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                  Wellness & Relaxation
                </div>
                <div className="w-16 h-px bg-amber-900" />
              </div>

              <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                Panoramic
                <br />
                <span className="italic text-amber-900">Pool View</span>
              </h2>

              <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light">
                <p>
                  Immerse yourself in the epitome of relaxation with our breathtaking panoramic swimming pool view in the heart of Dades Valley. As the sun-kissed waters blend seamlessly with the majestic Atlas Mountains and lush greenery, you’ll find yourself in a haven of serenity. Whether you’re basking in the sun’s gentle embrace or stargazing under the vast desert sky, our swimming pool offers a vista that transcends the ordinary.
                </p>
                <p>
                  Let the enchanting landscape embrace you as you unwind and create lasting memories at Panorama Dades.
                </p>
              </div>

              {/* Pool Features */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Waves, title: 'Infinity Edge', desc: 'Seamless views' },
                  { icon: Sunrise, title: 'All Day Sun', desc: 'Perfect climate' },
                  { icon: Wind, title: 'Mountain Breeze', desc: 'Natural cooling' },
                  { icon: Star, title: 'Starlit Evenings', desc: 'Night swimming' },
                ].map((feature, i) => (
                  <div key={i} className="group">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <feature.icon className="w-6 h-6 text-amber-900" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 mb-1">{feature.title}</div>
                        <div className="text-sm text-stone-600">{feature.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/swimming"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded font-medium tracking-wider uppercase shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all group"
              >
                <span>Discover More</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Images Collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative group overflow-hidden rounded-2xl">
                    <div className="aspect-[3/4] relative">
                      <img
                        src="/swimming/main.png"
                        alt="Pool"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-2xl">
                    <div className="aspect-square relative">
                      <img
                        src="/swimming/2.jpg"
                        alt="Pool Detail"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6 pt-16">
                  <div className="relative group overflow-hidden rounded-2xl">
                    <div className="aspect-square relative">
                      <img
                        src="/swimming/3.png"
                        alt="Pool Lounge"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-2xl">
                    <div className="aspect-[3/4] relative">
                      <img
                        src="/swimming/4.png"
                        alt="Pool View"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 lg:px-16 relative bg-stone-900 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-6 py-2 border border-amber-400/30 rounded-full mb-8">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm tracking-[0.3em] uppercase text-amber-400 font-light">
                Testimonials
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Stories from
              <br />
              <span className="italic text-amber-400">Our Guests</span>
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light">
              Real experiences from travelers who made memories in our valley
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-stone-200 leading-relaxed mb-8 font-light italic text-lg">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">
                      {testimonial.name}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-stone-400">
                      <Check className="w-3 h-3 text-amber-400" />
                      <span>Verified Guest</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide */}
      <section id="experiences" className="py-32 px-8 lg:px-16 relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20">
            <div className="space-y-4 mb-8">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Local Experiences
              </div>
              <div className="w-16 h-px bg-amber-900 mx-auto" />
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6">
              Discover the
              <br />
              <span className="italic text-amber-900">Valley</span>
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto font-light">
              Curated experiences that reveal the magic of Dades Valley
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs && blogs.length > 0 && blogs.map((blog, index) => (
              <article
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <div className="aspect-[4/5] relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs tracking-wider uppercase font-semibold text-stone-900">
                        Experience
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {blog.title.length > 60 ? blog.title.slice(0, 60) + "..." : blog.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed font-light">
                    {blog.quote.length > 60 ? blog.quote.slice(0, 60) + "..." : blog.quote}
                  </p>
                  <Link href={`/blog?id=${blog.id}`} className="flex items-center space-x-2 text-amber-900 font-medium group-hover:space-x-3 transition-all">
                    <span className="text-sm tracking-wider uppercase">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-amber-600" />
        <div className="absolute inset-0 bg-[url('/restaurant/main.jpg')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-10 shadow-2xl">
            <Instagram className="w-12 h-12" />
          </div>

          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Follow Our Journey
          </h2>

          <p className="text-2xl mb-12 opacity-90 font-light">
            Daily moments of beauty from the valley
          </p>

          <Link
            href={hotelInfos.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-4 px-12 py-6 bg-white text-stone-900 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all group"
          >
            <Instagram className="w-6 h-6" />
            <span>@{hotelInfos.name}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
