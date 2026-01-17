"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, Send, Key, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authApi.forgotPassword(email);
            setStep('reset');
            setSuccessMsg('Mã xác nhận đã được gửi đến email của bạn.');
        } catch (err: any) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            await authApi.resetPassword(email, code, newPassword);
            setSuccessMsg('Đổi mật khẩu thành công! Đang chuyển hướng...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError('Mã xác nhận không đúng hoặc đã hết hạn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#1c1c24] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden max-w-md w-full mx-auto">
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {step === 'email' ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
                </h2>
                <p className="text-gray-400 text-sm">
                    {step === 'email'
                        ? 'Nhập email để nhận mã xác nhận'
                        : `Nhập mã xác nhận đã gửi tới ${email}`
                    }
                </p>
                {/* Console Log Hint (Dev only) */}
                {step === 'reset' && (
                    <p className="text-xs text-gray-500 mt-2">(Mã cũng được hiển thị tại Server Console)</p>
                )}
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                    {successMsg}
                </div>
            )}

            {step === 'email' ? (
                <form onSubmit={handleSendEmail} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Email đăng ký</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Gửi Mã OTP <Send className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Mã OTP</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 px-4 text-white text-center tracking-[0.5em] font-mono text-lg placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                            placeholder="------"
                            required
                            maxLength={6}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 ml-1 uppercase tracking-wider">Mật khẩu mới</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                <Key className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                                placeholder="Nhập mật khẩu mới"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Đổi Mật Khẩu <CheckCircle className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            )}

            <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                    <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
                </Link>
            </div>
        </div>
    );
}
