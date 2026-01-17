import Link from 'next/link';
import { Novel } from '@/data/novels';
import { Eye, BookOpen } from 'lucide-react';

interface NovelCardProps {
    novel: Novel;
}

export function NovelCard({ novel }: NovelCardProps) {
    return (
        <Link href={`/truyen/${novel.slug}`} className="group flex flex-col gap-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-[#1c1c24] shadow-sm transition-all group-hover:shadow-indigo-500/20 group-hover:shadow-lg">
                <img
                    src={novel.cover || 'https://placehold.co/600x900/1e1e2e/FFF?text=No+Cover'}
                    alt={novel.title || 'Novel Cover'}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm uppercase">
                    {novel.status === 'COMPLETED' ? 'Full' : 'Update'}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="line-clamp-2 text-sm md:text-base font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                    {novel.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                    {(novel.categories || []).slice(0, 2).map((cat: any) => (
                        <span key={cat.id || cat} className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                            {cat.name || cat}
                        </span>
                    ))}
                </div>
                <p className="line-clamp-1 text-[10px] md:text-xs text-gray-400">
                    {novel.author}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] md:text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{novel.totalChapters}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{(novel.views / 1000).toFixed(1)}K</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
