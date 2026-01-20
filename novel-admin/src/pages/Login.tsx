
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthApi } from '../services/api';
import { Lock, User } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await AuthApi.login(username, password);
            // Verify admin role
            localStorage.setItem('access_token', data.access_token);

            const user = await AuthApi.getMe();
            if (user.role !== 'ADMIN') {
                localStorage.removeItem('access_token');
                setError('Access Denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
            localStorage.removeItem('access_token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
            <div className="bg-[#1c1c24] border border-white/5 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
                {/* Top Shine */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-400 text-sm">Secure Access required</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Username</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                                <User className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-gray-600"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#13131a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-gray-600"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
