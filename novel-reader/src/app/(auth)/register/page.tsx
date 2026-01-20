"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Verification Code state
    const [verifyCode, setVerifyCode] = useState('');

    // Better handler with name attributes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp!');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.register({
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            // Success -> Switch to verify step
            setStep('verify');
        } catch (err: any) {
            setError('Đăng ký thất bại. Email hoặc tên đăng nhập có thể đã tồn tại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authApi.verifyEmail(formData.email, verifyCode);
            // Success -> Redirect to login
            router.push('/login?registered=true');
        } catch (err: any) {
            setError('Mã xác nhận không đúng. Vui lòng kiểm tra lại.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'verify') {
        return (
            <div className="bg-[#1c1c24] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Xác thực Email</h2>
                    <p className="text-gray-400 text-sm">
                        Đã gửi mã xác nhận đến: <span className="text-white font-medium">{formData.email}</span>
                        <br />(Mã đang được hiển thị trên Console Server)
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Mã xác nhận</label>
                        <input
                            type="text"
                            name="code"
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 px-4 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
                            placeholder="000000"
                            maxLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Kích hoạt tài khoản <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-[#1c1c24] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Tạo tài khoản mới</h2>
                <p className="text-gray-400 text-sm">Tham gia cộng đồng đọc truyện ngay hôm nay</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                {/* Username */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Tên hiển thị</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors">
                            <User className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                            placeholder="Đạo Hữu A"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Email</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors">
                            <Mail className="h-5 w-5" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Mật khẩu</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                            placeholder="••••••••"
                            required
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

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Nhập lại mật khẩu</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            Đăng Ký Ngay <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-rose-400 font-bold hover:text-rose-300 hover:underline transition-all">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
