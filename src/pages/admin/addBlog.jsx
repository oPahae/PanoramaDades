import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Upload, X, Save, AlertCircle } from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function AddBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Travel Guide',
    quote: '',
    paragraphs: [{ title: '', content: '' }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParagraphChange = (index, field, value) => {
    const newParagraphs = [...formData.paragraphs];
    newParagraphs[index][field] = value;
    setFormData(prev => ({
      ...prev,
      paragraphs: newParagraphs
    }));
  };

  const addParagraph = () => {
    setFormData(prev => ({
      ...prev,
      paragraphs: [...prev.paragraphs, { title: '', content: '' }]
    }));
  };

  const removeParagraph = (index) => {
    if (formData.paragraphs.length > 1) {
      const newParagraphs = formData.paragraphs.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        paragraphs: newParagraphs
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, or WEBP)');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }

      setImageFile(file);
      setError(null);

      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.quote.trim()) {
      setError('Quote is required');
      return;
    }
    if (!imageFile) {
      setError('Blog image is required');
      return;
    }
    
    // Vérifier que tous les paragraphes ont un titre et un contenu
    for (let i = 0; i < formData.paragraphs.length; i++) {
      if (!formData.paragraphs[i].title.trim() || !formData.paragraphs[i].content.trim()) {
        setError(`Paragraph ${i + 1}: Both title and content are required`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Préparer les données du formulaire
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('quote', formData.quote);
      submitData.append('paragraphs', JSON.stringify(formData.paragraphs));
      submitData.append('image', imageFile);

      const response = await fetch('/api/blogs/add', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog');
      }

      const result = await response.json();
      
      router.push('/admin/blogs');
    } catch (err) {
      setError(err.message);
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

      {/* Header Section */}
      <section className="relative pt-20 pb-16 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center space-x-2 text-stone-600 hover:text-amber-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blogs</span>
          </Link>

          <div className="space-y-4">
            <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
              Administration
            </div>
            <div className="w-16 h-px bg-amber-900" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
              Add New
              <br />
              <span className="italic text-amber-900">Blog Post</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative pb-32 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 flex items-start space-x-4 animate-scale-in">
                <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-rose-900 mb-1">Error</h3>
                  <p className="text-rose-700">{error}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-6">
                <h2 className="text-2xl font-serif font-bold text-white">Basic Information</h2>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light"
                    placeholder="Enter blog title..."
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light"
                    required
                  >
                    <option value="Travel Guide">Travel Guide</option>
                    <option value="Hotel News">Hotel News</option>
                    <option value="Local Culture">Local Culture</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                  </select>
                </div>

                {/* Quote */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
                    Quote *
                  </label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light resize-none"
                    placeholder="Enter an inspiring quote for the blog..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Blog Image */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-6">
                <h2 className="text-2xl font-serif font-bold text-white">Blog Image</h2>
              </div>
              
              <div className="p-8">
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-2xl cursor-pointer hover:border-amber-900 transition-colors bg-stone-50/50"
                    >
                      <Upload className="w-12 h-12 text-stone-400 mb-4" />
                      <span className="text-stone-600 font-medium mb-2">Click to upload blog image</span>
                      <span className="text-sm text-stone-500">JPG, PNG or WEBP (max 5MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Blog preview"
                      className="w-full h-96 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Paragraphs */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-6 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-white">Blog Content</h2>
                <button
                  type="button"
                  onClick={addParagraph}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Add Section</span>
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                {formData.paragraphs.map((paragraph, index) => (
                  <div
                    key={index}
                    className="relative bg-stone-50/50 rounded-2xl p-6 border-2 border-stone-200"
                  >
                    {/* Remove Button */}
                    {formData.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="absolute top-4 right-4 p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="space-y-4">
                      {/* Section Number */}
                      <div className="text-sm font-semibold text-amber-900 uppercase tracking-wider">
                        Section {index + 1}
                      </div>

                      {/* Paragraph Title */}
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                          Section Title *
                        </label>
                        <input
                          type="text"
                          value={paragraph.title}
                          onChange={(e) => handleParagraphChange(index, 'title', e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light"
                          placeholder="Enter section title..."
                          required
                        />
                      </div>

                      {/* Paragraph Content */}
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                          Content *
                        </label>
                        <textarea
                          value={paragraph.content}
                          onChange={(e) => handleParagraphChange(index, 'content', e.target.value)}
                          rows="6"
                          className="w-full px-4 py-3 bg-white border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light resize-none"
                          placeholder="Enter section content..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/admin/blogs"
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
                <span className="relative z-10 text-white flex items-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Create Blog</span>
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

export async function getServerSideProps({ req, res }) {
  const root = verifyAuth(req, res);

  if (!root) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { connected: true } },
  };
}