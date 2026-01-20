"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff, Facebook, Mail as GoogleMail, Github, ArrowRight, Info, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    // Form state
    const [formData, setFormData] = useState({
        username: '', // Can be email or username
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.type === 'text') {
            setFormData(prev => ({ ...prev, username: value }));
        } else if (e.target.type === 'password') {
            setFormData(prev => ({ ...prev, password: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authApi.login(formData);
            localStorage.setItem('access_token', data.access_token);
            router.push('/');
        } catch (err: any) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#1c1c24] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Chào mừng trở lại</h2>
                <p className="text-gray-400 text-sm">Nhập thông tin để tiếp tục trải nghiệm</p>
                {registered && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                        Đăng ký thành công! Vui lòng đăng nhập.
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email/Username */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Email hoặc Tên đăng nhập</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Mail className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="name@example.com"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Mật khẩu</label>
                        <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="••••••••"
                            required
                            onChange={handleInputChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            Đăng Nhập <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </form>

            <div className="my-8 flex items-center gap-4">
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-xs text-gray-500 font-medium">HOẶC ĐĂNG NHẬP BẰNG</span>
                <div className="h-px bg-white/5 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                    <GoogleMail className="h-5 w-5 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-300">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                    <Facebook className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-300">Facebook</span>
                </button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
