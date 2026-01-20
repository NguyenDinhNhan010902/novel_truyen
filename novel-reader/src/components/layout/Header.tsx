"use client";

import Link from 'next/link';
import { Search, Menu, BookOpen, BarChart3, MessageSquare, User as UserIcon, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useRef } from 'react';
import { User, authApi, getNovels } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Novel } from '@/data/novels';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<any[]>([]); // Add categories state
    const router = useRouter();

    // Search States
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Novel[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedQuery = useDebounce(query, 500); // 500ms delay
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('access_token');
        if (token) {
            authApi.getMe().then(setUser).catch(() => {
                localStorage.removeItem('access_token');
                setUser(null);
            });
        }

        // Fetch categories dynamically
        import('@/lib/api').then(({ getCategories }) => {
            getCategories().then(cats => setCategories(cats));
        });

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        router.push('/login');
    };

    // Effect to fetch suggestions
    useEffect(() => {
        if (debouncedQuery.trim().length > 1) {
            getNovels(debouncedQuery).then(results => {
                setSuggestions(results.slice(0, 5)); // Limit to 5
                setShowSuggestions(true);
            });
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedQuery]);

    if (!mounted) return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#13131a]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-8 flex-1">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                        <BookOpen className="h-6 w-6 text-indigo-500" />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">NovelZone</span>
                    </Link>
                </div>
            </div>
        </header>
    ); // Avoid hydration mismatch

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#13131a]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo & Search */}
                <div className="flex items-center gap-8 flex-1">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white shrink-0">
                        <BookOpen className="h-6 w-6 text-indigo-500" />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent hidden md:inline">NovelZone</span>
                    </Link>

                    {/* Search Component */}
                    <div className="relative hidden md:block w-full max-w-[400px]" ref={searchRef}>
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />

                        {/* Clear button */}
                        {query && (
                            <button onClick={() => { setQuery(''); setSuggestions([]); }} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        <Input
                            type="search"
                            placeholder="Tìm kiếm truyện, tác giả..."
                            className="pl-9 pr-8 h-10 bg-[#1c1c24] border-transparent text-gray-200 placeholder:text-gray-500 focus:bg-[#272732] focus:ring-1 focus:ring-indigo-500 rounded-full transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowSuggestions(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = query.trim();
                                    if (val) {
                                        setShowSuggestions(false);
                                        router.push(`/tim-kiem?q=${encodeURIComponent(val)}`);
                                    }
                                }
                            }}
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full text-left left-0 w-full mt-2 bg-[#1c1c24] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gợi ý tìm kiếm</div>
                                    {suggestions.map((novel) => (
                                        <Link
                                            key={novel.id}
                                            href={`/truyen/${novel.slug}`}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            <div className="w-8 h-12 bg-gray-800 rounded overflow-hidden shrink-0">
                                                <img src={novel.cover || 'https://placehold.co/40x60/333/FFF?text=?'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-200 group-hover:text-indigo-400 text-left truncate">{novel.title}</h4>
                                                <p className="text-xs text-gray-500 text-left truncate">{novel.author}</p>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="border-t border-white/5 mt-1 pt-1">
                                        <button
                                            onClick={() => {
                                                setShowSuggestions(false);
                                                router.push(`/tim-kiem?q=${encodeURIComponent(query)}`);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-white/5 transition-colors"
                                        >
                                            Xem tất cả kết quả cho "{query}"
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Nav & Auth */}
                <div className="flex items-center gap-6">
                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <div className="relative group">
                            <button className="hover:text-white transition-colors flex items-center gap-1 py-4">
                                <BookOpen className="h-4 w-4" /> Thể loại
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 w-[400px] bg-[#1c1c24] border border-white/10 rounded-xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.slice(0, 12).map(cat => (
                                        <Link key={cat.id || cat.slug} href={`/the-loai/${cat.slug}`} className="block px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-sm">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link href="/top-bxh" className="hover:text-white transition-colors flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" /> BXH
                        </Link>
                        <Link href="/thao-luan" className="hover:text-white transition-colors flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" /> Thảo luận
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3 relative">
                                <span className="text-sm font-medium text-indigo-400 hidden sm:block">
                                    Hi, {user.username}
                                </span>

                                <div className="relative group" tabIndex={0}>
                                    <Button size="icon" className="rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30">
                                        <UserIcon className="h-4 w-4" />
                                    </Button>

                                    {/* Profile Dropdown */}
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#1c1c24] border border-white/10 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform origin-top-right z-50">
                                        <div className="px-4 py-2 border-b border-white/5 mb-1">
                                            <p className="text-sm font-bold text-white truncate">{user.username}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        {user.role === 'ADMIN' && (
                                            <a
                                                href="https://novel-truyen.pages.dev/novels"
                                                target="_blank"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                                            >
                                                <BarChart3 className="h-4 w-4" /> Admin Dashboard
                                            </a>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-white/5">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white border-0 font-semibold rounded-lg px-6">
                                        Đăng ký
                                    </Button>
                                </Link>
                            </>
                        )}

                        <Button variant="ghost" size="icon" className="lg:hidden text-gray-300">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
