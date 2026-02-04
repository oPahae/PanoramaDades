import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bed, Users, ChevronRight, Star, ArrowRight, Wifi, Lock, Droplet, Wind, Thermometer, Smartphone, Eye, Maximize2 } from 'lucide-react';
import { hotelAmenities, hotelRules } from '@/utils/constants';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

export default function RoomDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    enquiry: '',
    agreeTerms: false,
  });

  const [currentRoom, setCurrentRoom] = useState(null);
  const [moreRooms, setMoreRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/getOne?id=${id}`);
        const data = await res.json();
        setCurrentRoom(data);
      } catch (error) {
        console.error('Failed to fetch room', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    const getAminities = () => {
      if (!currentRoom) return;
      const temp = [];
      if (currentRoom.wifi) temp.push({ icon: Wifi, title: 'Free WiFi', desc: 'High-speed internet' })
      if (currentRoom.safe) temp.push({ icon: Lock, title: 'Safe', desc: 'In-room security' })
      if (currentRoom.rainShower) temp.push({ icon: Droplet, title: 'Rain Shower', desc: 'Luxury bathroom' })
      if (currentRoom.airConditioning) temp.push({ icon: Wind, title: 'Air Conditioning', desc: 'Climate control' })
      if (currentRoom.heater) temp.push({ icon: Thermometer, title: 'Heater', desc: 'Year-round comfort' })
      if (currentRoom.hairDryer) temp.push({ icon: Smartphone, title: 'Hair Dryer', desc: 'Premium amenities' })
      setAmenities(temp);
    }
    getAminities();
  }, [currentRoom]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/rooms/getAll');
        const data = await res.json();
        if(data) setMoreRooms(data.filter(room => room.id != id));
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      }
    };

    fetchRooms();
  }, [id]);

  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || 'MAD';
    }
    return 'MAD';
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentRoom.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentRoom.gallery.length - 1 : prev - 1
    );
  };

    if (loading) return <Loading />
    if (!currentRoom.id) return <Error />

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      {/* BG Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden py-64">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentRoom.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
          <div className="space-y-8">
            {/* Title */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white leading-none animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {currentRoom.title}
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              Experience luxury with panoramic valley views
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 py-20 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

            {/* Left Column - Room Details */}
            <div className="lg:col-span-7 space-y-16">

              {/* Room Description */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                    Room Overview
                  </div>
                  <div className="w-16 h-px bg-amber-900" />
                </div>

                <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                  Your Private
                  <br />
                  <span className="italic text-amber-900">Sanctuary</span>
                </h2>

                <p className="text-lg text-stone-600 leading-relaxed font-light">
                  {currentRoom.description}
                </p>
              </div>

              {/* Room Features */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    Room Features
                  </h3>
                  <div className="w-16 h-px bg-amber-900" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <Bed className="w-7 h-7 text-amber-900" />
                      </div>
                      <div className="pt-2">
                        <div className="font-semibold text-stone-900 mb-1 text-lg">
                          {currentRoom.beds} Bed{currentRoom.beds > 1 && 's'}
                        </div>
                        <div className="text-sm text-stone-600">
                          Premium comfort
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <Users className="w-7 h-7 text-amber-900" />
                      </div>
                      <div className="pt-2">
                        <div className="font-semibold text-stone-900 mb-1 text-lg">
                          {currentRoom.maxGuests} Guests
                        </div>
                        <div className="text-sm text-stone-600">
                          Spacious for families
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <Eye className="w-7 h-7 text-amber-900" />
                      </div>
                      <div className="pt-2">
                        <div className="font-semibold text-stone-900 mb-1 text-lg">
                          {currentRoom.view}
                        </div>
                        <div className="text-sm text-stone-600">
                          Panoramic windows
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <Maximize2 className="w-7 h-7 text-amber-900" />
                      </div>
                      <div className="pt-2">
                        <div className="font-semibold text-stone-900 mb-1 text-lg">
                          {currentRoom.space} m²
                        </div>
                        <div className="text-sm text-stone-600">
                          Generous space
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Amenities */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    Room Amenities
                  </h3>
                  <div className="w-16 h-px bg-amber-900" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                        <amenity.icon className="w-5 h-5 text-amber-900" />
                      </div>
                      <div>
                        <div className="font-medium text-stone-900 text-sm">
                          {amenity.title}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {amenity.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Grid */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    Gallery
                  </h3>
                  <div className="w-16 h-px bg-amber-900" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentRoom.gallery.slice(0, 9).map((image, i) => (
                    <div key={i} className="relative group overflow-hidden rounded-xl">
                      <div
                        key={i}
                        className="aspect-square relative"
                        onClick={() => openGallery(i)}
                      >
                        <img
                          src={image}
                          alt={`Room view ${i + 1}`}
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form (Sticky) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-8 space-y-8">
                {/* Booking Form */}
                <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-stone-200/50">
                  <div className="space-y-6">
                    <div className="text-center pb-6 border-b border-stone-200">
                      <div className="text-sm text-stone-500 mb-2">Starting from</div>
                      <div className="text-4xl font-serif font-bold text-amber-900 mb-1">
                        {currency === 'MAD' ? currentRoom.priceMAD + " MAD" : (currency === 'USD' ? "$" + currentRoom.priceUSD : currentRoom.priceCHF + " CHF")}
                      </div>
                      <div className="text-sm text-stone-500">per night</div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                        />
                      </div>

                      {/* Enquiry */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider">
                          Your Enquiry
                        </label>
                        <textarea
                          name="enquiry"
                          value={formData.enquiry}
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Tell us about your stay preferences, special requests, or any questions..."
                          className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all resize-none"
                        />
                      </div>

                      {/* Terms Checkbox */}
                      <div className="flex items-start space-x-3 pt-2">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          required
                          className="mt-1 w-5 h-5 text-amber-900 border-stone-300 rounded focus:ring-amber-900 focus:ring-2"
                        />
                        <label htmlFor="agreeTerms" className="text-sm text-stone-600 leading-relaxed">
                          I agree with the{' '}
                          <Link href="/terms" className="text-amber-900 hover:underline font-medium">
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-amber-900 hover:underline font-medium">
                            Privacy Statement
                          </Link>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full group relative px-6 py-5 rounded-lg font-semibold tracking-wider uppercase text-white overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <span>Send Enquiry</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-amber-900 fill-amber-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 mb-2">
                        Best Price Guarantee
                      </h4>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        Book directly with us to get the best rates and exclusive benefits.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hotel Amenities & Rules */}
                <div className="space-y-10">
                  {/* Hotel Amenities */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-serif font-bold text-stone-900">
                        Hotel Amenities
                      </h3>
                      <div className="w-16 h-px bg-amber-900" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hotelAmenities.map((amenity, i) => (
                        <div key={i} className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <amenity.icon className="w-6 h-6 text-amber-900" />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 mb-1">
                              {amenity.title}
                            </div>
                            <div className="text-sm text-stone-600">
                              {amenity.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Rules */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-serif font-bold text-stone-900">
                        Hotel Rules
                      </h3>
                      <div className="w-16 h-px bg-amber-900" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hotelRules.map((rule, i) => (
                        <div key={i} className="flex items-start space-x-4 p-6 bg-stone-100 rounded-xl border border-stone-200">
                          <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                            <rule.icon className="w-6 h-6 text-stone-700" />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 mb-1">
                              {rule.title}
                            </div>
                            <div className="text-sm text-stone-600">
                              {rule.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Rooms Section */}
      <section className="py-32 px-8 lg:px-16 relative bg-stone-100/50">
        <div className="max-w-[1600px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="space-y-4 mb-8">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Explore More
              </div>
              <div className="w-16 h-px bg-amber-900 mx-auto" />
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Other
              <br />
              <span className="italic text-amber-900">Rooms</span>
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Discover more rooms that might suit your preferences
            </p>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moreRooms.length === 0 ?
              <p>No other rooms</p>
              :
              moreRooms.map((room, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full">
                        <div className="text-xs text-stone-500">From</div>
                        <div className="text-xl font-serif font-bold text-amber-900">
                          {currency === 'MAD' ? `${room.priceMAD} MAD` : (currency === 'USD' ? `$${room.priceUSD}` : `CHF ${room.priceCHF}`)}
                        </div>
                      </div>
                    </div>

                    {/* Hover Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{room.beds} Bed{room.beds > 1 ? 's' : ''}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{room.guests} Guest{room.guests > 1 ? 's' : ''}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs tracking-wider uppercase text-stone-500 mb-2">
                        {room.category}
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                        {room.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                      <div className="flex items-center space-x-4 text-sm text-stone-600">
                        <span className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{room.beds}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{room.guests}</span>
                        </span>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <Link
                      href={`/room?id=${room.id}`}
                      className="block w-full group/btn relative px-6 py-4 rounded-lg font-semibold tracking-wider uppercase text-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                      <span className="relative z-10 flex items-center justify-center space-x-2 text-white">
                        <span>Book Now</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-16 text-center">
            <Link
              href="/rooms"
              className="inline-flex items-center space-x-3 group"
            >
              <span className="text-lg tracking-wider uppercase font-medium text-stone-900 group-hover:text-amber-900 transition-colors">
                View All Rooms
              </span>
              <ArrowRight className="w-5 h-5 text-amber-900 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none">
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white text-3xl hover:scale-110 transition"
          >
            ✕
          </button>
          <button
            onClick={prevImage}
            className="absolute left-6 text-white text-4xl hover:scale-110 transition"
          >
            ‹
          </button>
          <div className="max-w-6xl w-full px-6">
            <img
              src={currentRoom.gallery[currentImageIndex]}
              alt="Room large view"
              className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
          <button
            onClick={nextImage}
            className="absolute right-6 text-white text-4xl hover:scale-110 transition"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}