import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Plus, Bed, Users, Eye, DollarSign, Home, Image as ImageIcon, Check } from 'lucide-react';

export default function AddRoom() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priceUSD: '',
    priceCHF: '',
    beds: '',
    guests: '',
    view: '',
    space: '',
    status: 'available',
    wifi: true,
    safe: true,
    rainShower: true,
    airConditioning: true,
    heater: true,
    hairDryer: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagesPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      setAdditionalImages(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagesPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      alert('Please upload a main image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add main image
      formDataToSend.append('mainImage', mainImage);

      // Add additional images
      additionalImages.forEach((image) => {
        formDataToSend.append('additionalImages', image);
      });

      const response = await fetch('/api/rooms/add', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add room');
      }

      const result = await response.json();
      alert('Room added successfully!');
      router.push('/admin/rooms');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden md:mr-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header */}
      <section className="relative pt-20 pb-12 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/admin/rooms"
            className="inline-flex items-center space-x-2 text-amber-900 hover:text-amber-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wider uppercase text-sm">Back to Rooms</span>
          </Link>

          <div className="space-y-4">
            <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
              Administration
            </div>
            <div className="w-16 h-px bg-amber-900" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
              Add New
              <br />
              <span className="italic text-amber-900">Room</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative pb-32 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Image Upload */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl border border-stone-200/50">
              <div className="space-y-4 mb-6">
                <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center space-x-3">
                  <ImageIcon className="w-6 h-6 text-amber-900" />
                  <span>Main Image</span>
                </h2>
                <p className="text-stone-600 font-light">Upload the primary image for this room</p>
              </div>

              {mainImagePreview ? (
                <div className="relative group max-w-2xl mx-auto">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-4 right-4 w-10 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-12 text-center transition-all">
                    <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-600 font-medium mb-2">Click to upload main image</p>
                    <p className="text-sm text-stone-500">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>

            {/* Additional Images Upload */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl border border-stone-200/50">
              <div className="space-y-4 mb-6">
                <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center space-x-3">
                  <ImageIcon className="w-6 h-6 text-amber-900" />
                  <span>Additional Images</span>
                </h2>
                <p className="text-stone-600 font-light">Upload gallery images for this room (optional)</p>
              </div>

              {additionalImagesPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {additionalImagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-stone-900/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-stone-300 hover:border-amber-400'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      isDragging 
                        ? 'bg-amber-100 scale-110' 
                        : 'bg-stone-100'
                    }`}>
                      <Upload className={`w-8 h-8 transition-colors ${
                        isDragging 
                          ? 'text-amber-600' 
                          : 'text-stone-400'
                      }`} />
                    </div>
                  </div>
                  
                  <div>
                    <p className={`text-lg font-medium mb-2 transition-colors ${
                      isDragging 
                        ? 'text-amber-900' 
                        : 'text-stone-700'
                    }`}>
                      {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                    </p>
                    <p className="text-sm text-stone-500 mb-4">or click to browse</p>
                  </div>

                  <label className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-stone-300 hover:border-amber-500 text-stone-700 rounded-lg font-medium cursor-pointer transition-all hover:shadow-md">
                    <Plus className="w-5 h-5" />
                    <span>Select Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-xs text-stone-500">PNG, JPG, JPEG up to 10MB each</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl border border-stone-200/50">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-3">
                <Home className="w-6 h-6 text-amber-900" />
                <span>Basic Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Room Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="e.g., Deluxe Suite"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="e.g., Premium Collection"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all resize-none"
                    placeholder="Describe the room features and amenities..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    View *
                  </label>
                  <input
                    type="text"
                    name="view"
                    value={formData.view}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="e.g., Valley View"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl border border-stone-200/50">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-amber-900" />
                <span>Pricing & Capacity</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-amber-900" />
                    <span>Price USD *</span>
                  </label>
                  <input
                    type="number"
                    name="priceUSD"
                    value={formData.priceUSD}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="299"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-amber-900" />
                    <span>Price CHF *</span>
                  </label>
                  <input
                    type="number"
                    name="priceCHF"
                    value={formData.priceCHF}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="399"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <Bed className="w-4 h-4 text-amber-900" />
                    <span>Beds *</span>
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="1"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <Users className="w-4 h-4 text-amber-900" />
                    <span>Guests *</span>
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="2"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <Home className="w-4 h-4 text-amber-900" />
                    <span>Space (m²) *</span>
                  </label>
                  <input
                    type="number"
                    name="space"
                    value={formData.space}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:border-amber-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/10 transition-all"
                    placeholder="45"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl border border-stone-200/50">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-3">
                <Check className="w-6 h-6 text-amber-900" />
                <span>Amenities</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'wifi', label: 'WiFi' },
                  { name: 'safe', label: 'Safe' },
                  { name: 'rainShower', label: 'Rain Shower' },
                  { name: 'airConditioning', label: 'Air Conditioning' },
                  { name: 'heater', label: 'Heater' },
                  { name: 'hairDryer', label: 'Hair Dryer' },
                ].map((amenity) => (
                  <label
                    key={amenity.name}
                    className="flex items-center space-x-3 p-4 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      name={amenity.name}
                      checked={formData[amenity.name]}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-amber-900 border-stone-300 rounded focus:ring-amber-900/20"
                    />
                    <span className="text-stone-700 font-medium group-hover:text-stone-900">
                      {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/admin/rooms"
                className="px-8 py-4 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase hover:bg-stone-100 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="group relative px-8 py-4 overflow-hidden rounded-lg font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center space-x-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Adding Room...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Room</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}