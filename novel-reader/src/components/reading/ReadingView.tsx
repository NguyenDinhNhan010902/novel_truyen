"use client";

import { useState, useEffect } from "react";
import { Chapter } from "@/lib/api";
import { Novel } from "@/data/novels";
import { Settings, ChevronLeft, ChevronRight, Menu, Home, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface ReadingViewProps {
    chapter: Chapter;
    novel: Novel;
    prevChapterId?: string;
    nextChapterId?: string;
}

type Theme = 'light' | 'sepia' | 'dark';
type FontFamily = 'seriff' | 'sans';

export function ReadingView({ chapter, novel, prevChapterId, nextChapterId }: ReadingViewProps) {
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
    const [fontFamily, setFontFamily] = useState<FontFamily>('seriff');
    const [showSettings, setShowSettings] = useState(false);

    // Load settings from local storage
    useEffect(() => {
        const savedSettings = localStorage.getItem('reading-settings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setFontSize(parsed.fontSize || 18);
            setLineHeight(parsed.lineHeight || 1.8);
            setTheme(parsed.theme || 'dark');
            setFontFamily(parsed.fontFamily || 'seriff');
        }
    }, []);

    // Save settings
    const updateSettings = (newSettings: any) => {
        const updated = { fontSize, lineHeight, theme, fontFamily, ...newSettings };
        localStorage.setItem('reading-settings', JSON.stringify(updated));
        if (newSettings.fontSize) setFontSize(newSettings.fontSize);
        if (newSettings.lineHeight) setLineHeight(newSettings.lineHeight);
        if (newSettings.theme) setTheme(newSettings.theme);
        if (newSettings.fontFamily) setFontFamily(newSettings.fontFamily);
    };

    const themeClasses = {
        light: "bg-[#f9f9f9] text-gray-900 border-gray-200",
        sepia: "bg-[#f4ecd8] text-[#5b4636] border-[#e3d8b8]",
        dark: "bg-[#0b0f19] text-[#c9d1d9] border-[#1e2330]" // Deep midnight blue based on reference
    };

    const fontClasses = {
        seriff: "font-serif",
        sans: "font-sans"
    };

    return (
        <div className={cn("min-h-screen transition-colors duration-300", themeClasses[theme])}>

            {/* Sticky Header */}
            <header className={cn("sticky top-0 z-40 border-b shadow-sm transition-colors duration-300",
                theme === 'dark' ? "bg-[#1a1a1a]/90 border-[#333]" : theme === 'sepia' ? "bg-[#f4ecd8]/90 border-[#e3d8b8]" : "bg-white/90 border-gray-100"
            )}>
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Link href={`/truyen/${novel.slug}`}>
                            <Button variant="ghost" size="icon" className={theme === 'dark' ? "text-gray-400 hover:text-white hover:bg-white/10" : ""}>
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{novel.title}</h1>
                            <span className="text-xs opacity-70 truncate">{chapter.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {novel.audioUrl && (
                            <Link href={novel.audioUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={theme === 'dark' ? "text-rose-400 hover:text-rose-300 hover:bg-white/10" : "text-rose-600 hover:text-rose-700"}
                                    title="Nghe Truyện"
                                >
                                    <Headphones className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSettings(!showSettings)}
                            className={theme === 'dark' ? "text-gray-400 hover:text-white hover:bg-white/10" : ""}
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Link href="/">
                            <Button variant="ghost" size="icon" className={theme === 'dark' ? "text-gray-400 hover:text-white hover:bg-white/10" : ""}>
                                <Home className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className={cn("absolute top-full right-0 left-0 border-b p-4 shadow-lg animate-in slide-in-from-top-2",
                        theme === 'dark' ? "bg-[#252525] border-[#333]" : "bg-white border-gray-100"
                    )}>
                        <div className="container mx-auto max-w-2xl space-y-4">
                            {/* Theme */}
                            <div className="flex items-center gap-4">
                                <span className="w-20 text-sm font-medium">Màu nền</span>
                                <div className="flex gap-2">
                                    <button onClick={() => updateSettings({ theme: 'light' })} className={cn("w-8 h-8 rounded-full border bg-[#f9f9f9]", theme === 'light' && "ring-2 ring-amber-500")} />
                                    <button onClick={() => updateSettings({ theme: 'sepia' })} className={cn("w-8 h-8 rounded-full border bg-[#f4ecd8]", theme === 'sepia' && "ring-2 ring-amber-500")} />
                                    <button onClick={() => updateSettings({ theme: 'dark' })} className={cn("w-8 h-8 rounded-full border bg-[#1a1a1a]", theme === 'dark' && "ring-2 ring-amber-500")} />
                                </div>
                            </div>

                            {/* Font */}
                            <div className="flex items-center gap-4">
                                <span className="w-20 text-sm font-medium">Font chữ</span>
                                <div className="flex gap-2 text-sm">
                                    <button onClick={() => updateSettings({ fontFamily: 'seriff' })} className={cn("px-3 py-1 border rounded", fontFamily === 'seriff' ? "bg-amber-100 border-amber-200 text-amber-900" : "opacity-70")}>Có chân</button>
                                    <button onClick={() => updateSettings({ fontFamily: 'sans' })} className={cn("px-3 py-1 border rounded", fontFamily === 'sans' ? "bg-amber-100 border-amber-200 text-amber-900" : "opacity-70")}>Không chân</button>
                                </div>
                            </div>

                            {/* Size */}
                            <div className="flex items-center gap-4">
                                <span className="w-20 text-sm font-medium">Cỡ chữ</span>
                                <div className="flex items-center gap-3 flex-1">
                                    <button onClick={() => updateSettings({ fontSize: Math.max(14, fontSize - 1) })} className="p-1 border rounded">-</button>
                                    <span className="flex-1 text-center font-mono">{fontSize}px</span>
                                    <button onClick={() => updateSettings({ fontSize: Math.min(32, fontSize + 1) })} className="p-1 border rounded">+</button>
                                </div>
                            </div>

                            {/* Line Height */}
                            <div className="flex items-center gap-4">
                                <span className="w-20 text-sm font-medium">Dãn dòng</span>
                                <div className="flex items-center gap-3 flex-1">
                                    <button onClick={() => updateSettings({ lineHeight: Math.max(1.2, lineHeight - 0.1) })} className="p-1 border rounded">-</button>
                                    <span className="flex-1 text-center font-mono">{lineHeight.toFixed(1)}</span>
                                    <button onClick={() => updateSettings({ lineHeight: Math.min(2.5, lineHeight + 0.1) })} className="p-1 border rounded">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 max-w-[800px]">

                {/* Navigation Top */}
                <div className="flex justify-between items-center mb-8">
                    {prevChapterId ? (
                        <Link href={`/doc/${novel.slug}/${prevChapterId}`}>
                            <Button variant="outline">Chương Trước</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" disabled>Chương Trước</Button>
                    )}

                    {nextChapterId ? (
                        <Link href={`/doc/${novel.slug}/${nextChapterId}`}>
                            <Button variant="outline">Chương Sau</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" disabled>Chương Sau</Button>
                    )}
                </div>

                {/* Content */}
                <div className="min-h-[60vh]">
                    <h2 className={cn("text-2xl md:text-3xl font-bold mb-8 text-center", fontClasses[fontFamily])}>
                        {chapter.title}
                    </h2>

                    <div
                        className={cn("content-display text-justify reading-content", fontClasses[fontFamily])}
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight
                        }}
                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                    />
                </div>

                {/* Navigation Bottom */}
                <div className="flex justify-between items-center mt-12 py-8 border-t border-gray-200/20">
                    {prevChapterId ? (
                        <Link href={`/doc/${novel.slug}/${prevChapterId}`}>
                            <Button variant="default" className="w-32">← Trước</Button>
                        </Link>
                    ) : (
                        <Button variant="default" className="w-32" disabled>← Trước</Button>
                    )}

                    {nextChapterId ? (
                        <Link href={`/doc/${novel.slug}/${nextChapterId}`}>
                            <Button variant="default" className="w-32">Sau →</Button>
                        </Link>
                    ) : (
                        <Button variant="default" className="w-32" disabled>Sau →</Button>
                    )}
                </div>
            </main>

        </div>
    );
}
