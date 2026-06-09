import React from "react";
import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center min-h-screen">
            <div className="relative flex items-center justify-center w-32 h-32">
                {/* Outer pulsing circle rings */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                
                {/* Spinning loader ring */}
                <div className="absolute inset-2 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-2 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                
                {/* Inner static logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Image 
                            src="/logo.svg" 
                            alt="Loading" 
                            width={40} 
                            height={40} 
                            className="object-contain animate-pulse"
                            priority
                        />
                    </div>
                </div>
            </div>
            <p className="mt-6 text-sm font-bold text-primary tracking-widest uppercase animate-pulse">
                Loading...
            </p>
        </div>
    );
}
