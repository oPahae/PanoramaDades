import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

export default function BlogsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/blogs/getAll');
            if (!response.ok) throw new Error('Failed to fetch blogs');
            const data = await response.json();
            setBlogs(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilteredBlogs(blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.quote.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        }))
    }, [blogs]);

    const truncateText = (text, maxLength = 180) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    if (loading) return <Loading />
    if (error) return <Error />

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
                            backgroundImage: 'url(https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-50" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
                    <div className="space-y-8">
                        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-none">
                                Blogs
                            </h1>
                            <div className="flex items-center justify-center space-x-4 text-amber-200">
                                <div className="h-px w-20 bg-amber-400/50" />
                                <p className="text-xl md:text-2xl tracking-[0.4em] uppercase font-light">
                                    Caption Aligned Here
                                </p>
                                <div className="h-px w-20 bg-amber-400/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 px-8 lg:px-16 relative">
                <div className="max-w-[1400px] mx-auto">
                    {/* Results Count */}
                    <div className="mb-12">
                        <p className="text-stone-600 text-lg">
                            <span className="font-semibold text-stone-900">{filteredBlogs.length}</span> {filteredBlogs.length === 1 ? 'article' : 'articles'} found
                        </p>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredBlogs.map((blog, index) => (
                            <article
                                key={index}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden aspect-[4/3]">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent" />

                                    {/* Category Badge */}
                                    <div className="absolute top-6 left-6">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full">
                                            <Tag className="w-3 h-3 text-amber-900" />
                                            <span className="text-xs tracking-wider uppercase font-semibold text-stone-900">
                                                Experience
                                            </span>
                                        </div>
                                    </div>

                                    {/* Date Badge */}
                                    <div className="absolute bottom-6 left-6">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-stone-900/80 backdrop-blur-sm rounded-full text-white">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-xs font-medium">
                                                {blog.date || 'Jan 15, 2026'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    {/* Title */}
                                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4 group-hover:text-amber-900 transition-colors leading-tight">
                                        {blog.title.length > 60 ? `${blog.title.slice(0, 60)}...` : blog.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-stone-600 leading-relaxed font-light mb-6 flex-1">
                                        {truncateText(blog.quote)}
                                    </p>

                                    {/* Reading Time & CTA */}
                                    <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                                        <div className="flex items-center space-x-2 text-sm text-stone-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{parseInt(blog.letters / 200) + 1} min</span>
                                        </div>

                                        <Link
                                            href={`/blog?id=${blog.id}`}
                                            className="group/btn inline-flex items-center space-x-2 text-amber-900 font-medium hover:space-x-3 transition-all"
                                        >
                                            <span className="text-sm tracking-wider uppercase">Read More</span>
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-stone-400" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
                                No articles found
                            </h3>
                            <p className="text-stone-600 mb-8">
                                Try adjusting your search terms or browse all articles
                            </p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full font-medium tracking-wider uppercase shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Section */}
            {/* <section className="py-20 px-8 lg:px-16 bg-stone-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="text-xs tracking-[0.4em] uppercase text-amber-400 font-semibold">
                                    Stay Connected
                                </div>
                                <div className="w-16 h-px bg-amber-400" />
                            </div>

                            <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight">
                                Never Miss
                                <br />
                                <span className="italic text-amber-400">a Story</span>
                            </h2>

                            <p className="text-xl text-stone-300 font-light leading-relaxed">
                                Subscribe to receive our latest articles, travel tips, and exclusive insights directly in your inbox.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <form className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full group relative px-6 py-4 rounded-lg font-semibold tracking-wider uppercase text-white overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10 flex items-center justify-center space-x-2">
                                        <span>Subscribe Now</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </form>
                            <p className="text-xs text-stone-400 mt-4 text-center">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Back to Top */}
            <div className="py-12 text-center">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group inline-flex items-center space-x-2 text-stone-600 hover:text-amber-900 transition-colors"
                >
                    <span className="text-sm tracking-wider uppercase font-medium">Back to Top</span>
                    <ArrowRight className="w-4 h-4 -rotate-90 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}