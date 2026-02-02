import React from 'react'

const Error = () => {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-stone-300/30 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-800 text-3xl font-bold">!</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                    Something went wrong
                </h2>
                <p className="text-stone-600 leading-relaxed">
                    We couldn’t load the articles right now.
                    Please try again in a moment.
                </p>
            </div>
        </div>
    )
}

export default Error