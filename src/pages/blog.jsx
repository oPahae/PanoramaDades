import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, ArrowLeft, Calendar, Clock, User, Share2, Bookmark, ChevronRight } from 'lucide-react';

export default function BlogDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [blog, setBlog] = useState(null);
    const [otherBlogs, setOtherBlogs] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blogs/getOne?id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog');
                }
                const data = await response.json();
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    useEffect(() => {
        const fetchOtherBlogs = async () => {
            try {
                const response = await fetch('/api/blogs/getAll');
                if (!response.ok) throw new Error('Failed to fetch blogs');
                const data = await response.json();
                setOtherBlogs(data);
                console.log(data);
            } catch (err) {
                console.log(err)
            }
        };
        fetchOtherBlogs();
    }, [id]);

    const truncateText = (text = "", maxLength = 120) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    };

    if (!blog) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Blog Not Found</h1>
                    <Link href="/" className="text-amber-900 hover:underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

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

            {/* Hero Image Section */}
            <section className="relative z-10 px-8 lg:px-16 pb-16">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* LEFT: Content */}
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-900 rounded-full mb-6">
                                <span className="text-xs tracking-[0.3em] uppercase text-white font-semibold">
                                    Experience
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-6">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-stone-600">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">{blog.datePosted}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">{parseInt(blog.letters / 200) + 1} min</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">{blog.category}</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Image */}
                        <div className="order-1 lg:order-2">
                            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Blog Content */}
            <section className="relative z-10 px-8 lg:px-16">
                <div className="max-w-[900px] mx-auto">
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mb-16 pb-8 border-b border-stone-200">
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-stone-200 rounded-lg hover:border-amber-900 hover:text-amber-900 transition-all group">
                                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Share</span>
                            </button>
                            {/* <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-stone-200 rounded-lg hover:border-amber-900 hover:text-amber-900 transition-all group">
                                <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Save</span>
                            </button> */}
                        </div>
                    </div>

                    {/* Blog Content - Introduction */}
                    <div className="prose prose-lg max-w-none">
                        {blog.paragraphes.map((parag, index) => (
                            <div className='mt-16' key={index}>
                                <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">
                                    {parag.title}
                                </h2>
                                <div className="space-y-8 text-stone-700 leading-relaxed">
                                    <p className="text-2xl font-light text-stone-900 leading-relaxed first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-900 first-letter:leading-none first-letter:mt-1">
                                        {parag.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Image Gallery */}
                        {/* <div className="mt-16 grid grid-cols-2 gap-6">
                            {blog.gallery.map((gal, index) => (
                                <div className="relative overflow-hidden rounded-2xl group" key={index}>
                                    <div className="aspect-[4/3] relative">
                                        <img
                                            src={gal}
                                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div> */}

                        {/* Closing Quote */}
                        <div className="mt-16 p-8 bg-amber-50 border-l-4 border-amber-900 rounded-r-2xl">
                            <blockquote className="text-2xl font-serif italic text-stone-900 leading-relaxed">
                                {blog.quote}
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* Next Blog Navigation */}
            {otherBlogs && otherBlogs.length > 1 &&
                <section className="relative z-10 px-8 lg:px-16 py-16">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Image */}
                                <div className="relative h-80 lg:h-auto">
                                    <img
                                        src={otherBlogs.filter(b => b.id != id)[Math.floor(Math.random() * (otherBlogs.filter(b => b.id != id).length-1))]?.image}
                                        alt={otherBlogs.filter(b => b.id != id)[Math.floor(Math.random() * (otherBlogs.filter(b => b.id != id).length-1))]?.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-900/60" />
                                </div>

                                {/* Content */}
                                <div className="p-12 lg:p-16 flex flex-col justify-center text-white">
                                    <div className="text-xs tracking-[0.4em] uppercase text-amber-200 font-semibold mb-6">
                                        Next Experience
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                                        {truncateText(otherBlogs.filter(b => b.id != id)[Math.floor(Math.random() * (otherBlogs.filter(b => b.id != id).length-1))]?.title, 40)}
                                    </h3>
                                    <p className="text-lg text-amber-100 font-light leading-relaxed mb-8">
                                        {truncateText(otherBlogs.filter(b => b.id != id)[Math.floor(Math.random() * (otherBlogs.filter(b => b.id != id).length-1))]?.quote, 150)}
                                    </p>
                                    <Link
                                        href={`/blog?id=${Math.floor(Math.random() * (otherBlogs.filter(b => b.id != id).length-1))}`}
                                        className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-amber-900 rounded-lg font-medium tracking-wider hover:bg-amber-50 transition-all group w-fit"
                                    >
                                        <span>Next Blog</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }

            {/* Other Blogs */}
            <section className="relative z-10 px-8 lg:px-16 py-24 bg-stone-100/50">
                <div className="max-w-[1600px] mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="space-y-4 mb-8">
                            <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                                More Stories
                            </div>
                            <div className="w-16 h-px bg-amber-900 mx-auto" />
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6">
                            Continue
                            <br />
                            <span className="italic text-amber-900">Exploring</span>
                        </h2>
                        <p className="text-xl text-stone-600 max-w-3xl mx-auto font-light">
                            Discover more experiences and hidden gems of the Dades
                        </p>
                    </div>

                    {/* Blogs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherBlogs && otherBlogs.length > 1 && otherBlogs.filter(blog => blog.id != id).map((blog, index) => {
                            const originalIndex = otherBlogs.findIndex(b => b.title === blog.title);

                            return (
                                <article
                                    key={index}
                                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="aspect-[4/3] relative">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />

                                            {/* Category Badge */}
                                            <div className="absolute top-6 left-6">
                                                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs tracking-wider uppercase font-semibold text-stone-900">
                                                    Experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-4">
                                        <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-tight">
                                            {blog.title}
                                        </h3>
                                        <p className="text-stone-600 leading-relaxed font-light">
                                            {truncateText(blog.quote, 100)}
                                        </p>
                                        <Link
                                            href={`/blog?id=${originalIndex}`}
                                            className="inline-flex items-center space-x-2 text-amber-900 font-medium group-hover:space-x-3 transition-all pt-2"
                                        >
                                            <span className="text-sm tracking-wider uppercase">Read More</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Back to All Experiences */}
                    <div className="mt-16 text-center">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center space-x-3 group"
                        >
                            <ArrowLeft className="w-5 h-5 text-amber-900 group-hover:-translate-x-2 transition-transform" />
                            <span className="text-lg tracking-wider uppercase font-medium text-stone-900 group-hover:text-amber-900 transition-colors">
                                Back to All Blogs
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-8 lg:px-16 bg-gradient-to-br from-stone-900 to-stone-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                        Ready to Experience
                        <br />
                        <span className="italic text-amber-400">The Valley?</span>
                    </h2>
                    <p className="text-xl text-stone-300 mb-12 font-light leading-relaxed">
                        Book your stay and discover the magic of Dades Valley for yourself
                    </p>
                    <Link
                        href="/rooms"
                        className="inline-flex items-center space-x-3 px-12 py-6 bg-white text-stone-900 rounded-lg font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all group"
                    >
                        <span>Book Your Stay</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}