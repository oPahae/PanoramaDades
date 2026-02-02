import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Loading from '@/components/Loading';
import Error from '@/components/Loading';

export default function FAQ() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/faqs/get');
            if (!response.ok) throw new Error('Failed to fetch FAQs');
            const data = await response.json();
            setFaqs(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
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

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden py-64">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-50" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                    <div className="space-y-8">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white leading-none">
                            Frequently Asked
                            <br />
                            <span className="italic text-amber-400">Questions</span>
                        </h1>

                        <div className="flex items-center justify-center space-x-4 text-stone-200">
                            <div className="h-px w-20 bg-amber-400/50" />
                            <p className="text-lg md:text-xl tracking-wider uppercase font-light">
                                All what you want to know
                            </p>
                            <div className="h-px w-20 bg-amber-400/50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-8 lg:px-16 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200/50"
                            >
                                {/* Question */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className="text-lg md:text-xl font-semibold text-stone-900 pr-8 group-hover:text-amber-900 transition-colors">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-6 h-6 text-amber-900 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Answer */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-8 pb-6 pt-2">
                                        <div className="w-12 h-px bg-amber-900/30 mb-4" />
                                        <p className="text-stone-600 leading-relaxed font-light text-base md:text-lg">
                                            {faq.response}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-20 text-center">
                        <div className="bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl p-12 border border-amber-200/50">
                            <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">
                                You have ohter questions ?
                            </h3>
                            <p className="text-stone-600 text-lg mb-8 font-light">
                                We are ready to answer all your questions
                            </p>
                            <a
                                href="mailto:contact@hotel.com"
                                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium tracking-wider uppercase shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <span>Contact Us</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}