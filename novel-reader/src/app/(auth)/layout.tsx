import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-[#0b0f19] relative flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-600/10 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Brand Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hover:scale-105 transition-transform duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        NovelLife
                    </Link>
                </div>

                {/* Main Card */}
                {children}

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-300 transition-colors">Trang Chủ</Link>
                    <span className="mx-2">•</span>
                    <Link href="/terms" className="hover:text-gray-300 transition-colors">Điều Khoản</Link>
                    <span className="mx-2">•</span>
                    <Link href="/privacy" className="hover:text-gray-300 transition-colors">Bảo Mật</Link>
                </div>
            </div>
        </div>
    );
}
