import { getNovel, getNovels, getChapters } from '@/lib/api';
// import { MOCK_NOVELS } from '@/data/novels'; 
// import { MOCK_CHAPTERS } from '@/data/chapters';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, User, Eye, Clock, List, Share2, Bookmark, Headphones } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function NovelDetailPage({ params }: PageProps) {
    const { slug } = await params;
    // Fetch real novel data
    const novel = await getNovel(slug);
    const allNovels = await getNovels(); // Fetch for sidebar suggestions

    if (!novel) {
        notFound();
    }

    if (!novel) {
        notFound();
    }

    // List chapters
    const chapters = await getChapters(novel.id);
    const firstChapter = chapters.length > 0 ? chapters[0] : null;

    return (
        <div className="bg-[#13131a] min-h-screen pb-12 text-gray-300">
            {/* Novel Info Header with Gold Accent */}
            <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
                {/* Card Wrapper */}
                <div className="bg-[#1c1c24] rounded-2xl border border-white/5 p-4 md:p-10 shadow-xl relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-12 relative z-10">
                        {/* Cover - Book Style */}
                        <div className="mx-auto md:mx-0 w-[180px] md:w-full aspect-[2/3] rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-600/30 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10" />
                            <img src={novel.cover || 'https://placehold.co/600x900/1e1e2e/FFF?text=No+Cover'} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {/* Golden Spine Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] md:w-[4px] bg-gradient-to-b from-yellow-300 via-yellow-600 to-yellow-800 opacity-80" />
                        </div>

                        {/* Info */}
                        <div className="space-y-4 md:space-y-6 text-center md:text-left">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                                    {novel.title}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-indigo-400" />
                                        <span className="text-white hover:text-indigo-400 cursor-pointer transition-colors">{novel.author}</span>
                                    </div>
                                    <span className="hidden md:inline">•</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500 font-bold">★ {novel.rating}</span>
                                        <span className="text-[10px] md:text-xs text-gray-500">(10k đánh giá)</span>
                                    </div>
                                    <span className="hidden md:inline">•</span>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>{novel.views < 1000000 ? (novel.views / 1000).toFixed(1) + 'K' : (novel.views / 1000000).toFixed(1) + 'M'}</span>
                                    </div>
                                    <span className="hidden md:inline">•</span>
                                    <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${novel.status === 'ONGOING' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {novel.status === 'ONGOING' ? 'ĐANG RA' : 'FULL'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2">
                                {/* Prefer Categories from DB */}
                                {novel.categories && novel.categories.length > 0 ? (
                                    novel.categories.map(cat => (
                                        <span key={cat.id} className="px-3 py-1 bg-[#272732] border border-white/5 rounded-full text-[10px] md:text-xs font-medium text-gray-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all cursor-pointer">
                                            {cat.name}
                                        </span>
                                    ))
                                ) : (
                                    /* Fallback to legacy tags */
                                    novel.tags?.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-[#272732] border border-white/5 rounded-full text-[10px] md:text-xs font-medium text-gray-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all cursor-pointer">
                                            {tag}
                                        </span>
                                    ))
                                )}
                            </div>

                            <p className="text-sm md:text-base text-gray-400 leading-relaxed line-clamp-4 md:line-clamp-none text-justify md:text-left">
                                {novel.description}
                            </p>

                            <div className="pt-2 md:pt-4 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4">
                                <Link href={firstChapter ? `/doc/${novel.slug}/${firstChapter.id}` : '#'} className="w-full md:w-auto">
                                    <Button size="lg" className="w-full h-12 md:px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2" disabled={!firstChapter}>
                                        <BookOpen className="h-5 w-5 flex-shrink-0" />
                                        <span className="whitespace-nowrap">Đọc Từ Đầu</span>
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="w-full md:w-auto h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-2">
                                    <Bookmark className="h-5 w-5 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Theo Dõi</span>
                                </Button>
                                {novel.audioUrl ? (
                                    <Link href={novel.audioUrl} target="_blank" rel="noopener noreferrer" className="block w-full md:w-auto">
                                        <Button
                                            size="lg"
                                            className="w-full h-12 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Headphones className="h-5 w-5 flex-shrink-0" />
                                            <span className="whitespace-nowrap">Nghe Truyện</span>
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="w-full md:w-auto h-12 px-6 rounded-xl bg-gray-700 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 opacity-50"
                                        disabled
                                    >
                                        <Headphones className="h-5 w-5 flex-shrink-0" />
                                        <span className="whitespace-nowrap">Nghe Truyện</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-2 md:px-4 grid md:grid-cols-[1fr_350px] gap-6 md:gap-8">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Chapter List */}
                    <section className="bg-[#1c1c24] border border-white/5 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <List className="h-5 w-5 text-indigo-500" />
                                Danh sách chương
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 bg-[#272732] px-2 py-1 rounded">Mới nhất: Chương {chapters.length}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                            {chapters.map(chapter => (
                                <div
                                    key={chapter.id}
                                    className="group flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 px-2 rounded transition-colors"
                                >
                                    <Link href={`/doc/${novel.slug}/${chapter.id}`} className="flex-1 min-w-0">
                                        <span className="text-sm text-gray-400 group-hover:text-indigo-400 font-medium truncate pr-4 block">
                                            {chapter.title}
                                        </span>
                                    </Link>

                                    <div className="flex items-center gap-3">
                                        {novel.audioUrl && (
                                            <Link
                                                href={novel.audioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-rose-500 transition-colors"
                                                title="Nghe chương này"
                                            >
                                                <Headphones className="h-4 w-4" />
                                            </Link>
                                        )}
                                        <span className="text-[10px] text-gray-600 group-hover:text-gray-500 whitespace-nowrap">2 giờ trước</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            {/* Pagination Mock */}
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="text-gray-400 disabled:opacity-30" disabled>❮</Button>
                                <Button variant="default" className="bg-indigo-600 text-white h-9 w-9 p-0">1</Button>
                                <Button variant="ghost" className="text-gray-400 h-9 w-9 p-0 hover:bg-white/10">2</Button>
                                <Button variant="ghost" className="text-gray-400 h-9 w-9 p-0 hover:bg-white/10">3</Button>
                                <span className="flex items-center text-gray-600">...</span>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-white/10 hover:text-white">❯</Button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#1c1c24] border border-white/5 p-6 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                            Cùng Thể Loại
                        </h4>
                        <div className="space-y-4">
                            {/* Temporary: Display latest novels as 'Related'. Logic can be improved later */}
                            {allNovels.slice(0, 5).map(n => (
                                <Link key={n.id} href={`/truyen/${n.slug}`} className="flex gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                    <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                        <img src={n.cover || 'https://placehold.co/40x60/333/FFF?text=?'} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-medium text-gray-200 group-hover:text-indigo-400 transition-colors truncate">{n.title}</h5>
                                        <div className="text-xs text-gray-500 mt-1">{n.author}</div>
                                        <div className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                                            <Eye className="h-3 w-3" /> {(n.views / 1000).toFixed(1)}K
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {allNovels.length === 0 && (
                                <div className="text-xs text-gray-500 text-center py-4">Chưa có truyện cùng loại</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
