import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut,
  X,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [images, setImages] = useState([
    "/view1.jpeg",
    "/view2.jpeg",
    "/view3.jpg",
    "/view4.jpg",
    "/restaurant/hero.jpg",
    "/restaurant/main.jpg",
    "/restaurant/1.jpg",
    "/restaurant/2.jpg",
    "/restaurant/3.jpg",
    "/restaurant/4.jpg",
    "/restaurant/5.jpg",
    "/swimming/hero.jpg",
    "/swimming/main.png",
    "/swimming/1.png",
    "/swimming/2.jpg",
    "/swimming/3.png",
    "/swimming/4.png",
    "/swimming/5.jpg",
  ]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const handleDownload = async () => {
    if (!images[currentIndex]) return;
    
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = images[currentIndex].title || `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (isZoomed) {
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape' && isZoomed) toggleZoom();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isZoomed]);

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8 md:ml-16">
        <div className="text-center space-y-4">
          <ImageIcon className="w-16 h-16 text-stone-400 mx-auto" />
          <p className="text-stone-600 text-lg">No images in gallery</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header Section */}
      <section className="relative pt-28 pb-8 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-4 mb-8">
            <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
              Gallery
            </div>
            <div className="w-16 h-px bg-amber-900" />
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
              Image
              <span className="ml-2 italic text-amber-900">Collection</span>
            </h1>
          </div>

          {/* Image Counter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/50 shadow-lg inline-block">
            <p className="text-sm font-semibold text-stone-600">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="relative pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {/* Main Image Display */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/50 overflow-hidden">
            {/* Image Container */}
            <div className="relative bg-stone-900 aspect-video lg:aspect-[21/9] flex items-center justify-center overflow-hidden group">
              <img
                src={currentImage}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)' }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                disabled={images.length <= 1}
              >
                <ChevronLeft className="w-6 h-6 text-stone-900" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                disabled={images.length <= 1}
              >
                <ChevronRight className="w-6 h-6 text-stone-900" />
              </button>

              {/* Control Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-stone-700" />
                </button>

                <button
                  onClick={toggleZoom}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                  title={isZoomed ? "Reset Zoom" : "Zoom In"}
                >
                  <Maximize2 className="w-5 h-5 text-stone-700" />
                </button>

                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-stone-700" />
                </button>

                <div className="w-px h-6 bg-stone-300" />

                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-amber-50 rounded-full transition-colors"
                  title="Download Image"
                >
                  <Download className="w-5 h-5 text-amber-900" />
                </button>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-stone-50 border-t border-stone-200/50">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
                {`Image ${currentIndex + 1}`}
              </h3>
              {currentImage.description && (
                <p className="text-stone-600 text-sm">
                  {currentImage.description}
                </p>
              )}
              {currentImage.date && (
                <p className="text-stone-500 text-xs mt-2">
                  {new Date(currentImage.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-8">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 p-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-stone-200">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setZoomLevel(1);
                    }}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-amber-900 shadow-lg scale-105'
                        : 'border-stone-300 hover:border-amber-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={goToPrevious}
              disabled={images.length <= 1}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-300"
            >
              <ChevronLeft className="w-5 h-5 text-amber-900" />
              <span className="font-semibold text-stone-900">Previous</span>
            </button>

            <button
              onClick={goToNext}
              disabled={images.length <= 1}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-300"
            >
              <span className="font-semibold text-stone-900">Next</span>
              <ChevronRight className="w-5 h-5 text-amber-900" />
            </button>

            <button
              onClick={toggleZoom}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 hover:border-amber-300"
            >
              <Maximize2 className="w-5 h-5 text-amber-900" />
              <span className="font-semibold text-stone-900">Zoom</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 hover:from-amber-700 hover:to-amber-900"
            >
              <Download className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">Download</span>
            </button>
          </div>
        </div>
      </section>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={toggleZoom}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative max-w-full max-h-full overflow-auto">
            <img
              src={currentImage}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Zoom Controls in Modal */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors disabled:opacity-50"
            >
              <ZoomOut className="w-5 h-5 text-stone-900" />
            </button>

            <span className="text-sm font-semibold text-stone-900 min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors disabled:opacity-50"
            >
              <ZoomIn className="w-5 h-5 text-stone-900" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(3deg); }
          66% { transform: translate(-20px, 20px) rotate(-3deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 25px) rotate(-2deg); }
          66% { transform: translate(25px, -15px) rotate(2deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }

        .scrollbar-thumb-amber-900::-webkit-scrollbar-thumb {
          background-color: #78350f;
          border-radius: 3px;
        }

        .scrollbar-track-stone-200::-webkit-scrollbar-track {
          background-color: #e7e5e4;
          border-radius: 3px;
        }
      `}</style>
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