import React from 'react'

const Loading = () => {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 -left-32 w-80 h-80 bg-stone-300/40 rounded-full blur-3xl animate-pulse" />
            <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-300/30 border-t-amber-700 animate-spin" />
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                    Loading articles
                </h2>
                <p className="text-stone-600 tracking-wider uppercase text-sm">
                    Please wait a moment
                </p>
            </div>
        </div>
    )
}

export default Loading