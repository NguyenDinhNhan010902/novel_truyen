import { getNovels, getCategories } from '@/lib/api';
import { NovelCard } from '@/components/ui/novel-card';

export const dynamic = 'force-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Crown, Flame, Clock, Headphones, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Novel } from '@/data/novels';

export default async function Home() {
  const allNovels = await getNovels();
  const categories = await getCategories();
  const featuredNovel = allNovels[0] || {} as Novel;
  const latestNovels = allNovels;

  // Basic fallback if no novels
  if (!featuredNovel.id) {
    return <div className="p-10 text-center text-white">Chưa có truyện nào. Vui lòng thêm truyện từ Admin Dashboard.</div>
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#13131a] pt-8 pb-12">
        {/* Background gradient effect */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4">
          {/* Banner Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#1c1c24] border border-white/5 shadow-2xl">
            <div className="flex flex-col md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-[300px_1fr] gap-0">
              <Link href={`/truyen/${featuredNovel.slug}`} className="relative h-[400px] md:h-auto group cursor-pointer block">
                <img
                  src={featuredNovel.cover || 'https://placehold.co/600x900/1e1e2e/FFF?text=No+Cover'}
                  alt={featuredNovel.title || 'Featured Novel'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c24] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1c1c24]" />
              </Link>
              <div className="p-4 md:p-10 flex flex-col justify-center gap-4 relative">
                {/* Background texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Crown className="h-3 w-3" />
                    HOT TUẦN
                  </div>
                  <Link href={`/truyen/${featuredNovel.slug}`} className="hover:text-indigo-400 transition-colors">
                    <h1 className="text-2xl md:text-5xl font-extrabold text-white leading-tight">
                      {featuredNovel.title}
                    </h1>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {featuredNovel.author}</div>
                    <div className="flex items-center gap-1"><Flame className="h-4 w-4" /> 2.5M Views</div>
                  </div>
                  <p className="text-sm md:text-lg text-gray-300 line-clamp-3 max-w-2xl font-light leading-relaxed">
                    {featuredNovel.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredNovel.tags && featuredNovel.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 md:pt-6 flex flex-col md:flex-row gap-3 md:gap-4">
                    <Link href={`/truyen/${featuredNovel.slug}`} className="w-full md:w-auto">
                      <Button size="lg" className="w-full md:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-600/20">
                        Đọc Ngay
                      </Button>
                    </Link>
                    <Link href={`/truyen/${featuredNovel.slug}`} className="w-full md:w-auto">
                      <Button variant="outline" size="lg" className="w-full md:w-auto rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-2">
                        <Bookmark className="h-5 w-5" />
                        Đánh Dấu
                      </Button>
                    </Link>
                    {featuredNovel.audioUrl ? (
                      <Link href={featuredNovel.audioUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                        <Button
                          size="lg"
                          className="w-full md:w-auto rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Headphones className="h-5 w-5" />
                          Nghe Truyện
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full md:w-auto rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 opacity-50"
                        disabled
                      >
                        <Headphones className="h-5 w-5" />
                        Nghe Truyện
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-2 sm:px-4 grid lg:grid-cols-[1fr_350px] gap-6 lg:gap-10">
        {/* Main List Column */}
        <div className="space-y-8 lg:space-y-10">
          {/* Latest Updates */}
          <section>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-500" />
                <h2 className="text-xl lg:text-2xl font-bold text-white">Mới Cập Nhật</h2>
              </div>
              <Link href="/danh-sach" className="group flex items-center gap-1 text-xs lg:text-sm font-medium text-gray-400 hover:text-white">
                Xem tất cả
                <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
              {latestNovels.slice(0, 8).map((novel, idx) => (
                <NovelCard key={`${novel.id}-${idx}`} novel={novel} />
              ))}
            </div>
          </section>

          {/* Categories */}
          <section>
            <div className="flex items-center gap-2 mb-4 lg:mb-6">
              <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-500" />
              <h2 className="text-xl lg:text-2xl font-bold text-white">Tiên Hiệp Hot</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
              {latestNovels.slice(0, 4).map((novel, idx) => (
                <NovelCard key={`featured-${novel.id}-${idx}`} novel={novel} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Ranking Box */}
          <div className="bg-[#1c1c24] rounded-xl border border-white/5 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Bảng Xếp Hạng</h3>
              <div className="flex gap-2 text-xs">
                <span className="text-indigo-400 underline cursor-pointer">Tuần</span>
                <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Tháng</span>
              </div>
            </div>
            <div className="space-y-4">
              {latestNovels.slice(0, 6).map((novel, idx) => (
                <Link key={`rank-${idx}`} href={`/truyen/${novel.slug}`} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0",
                    idx === 0 ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                      idx === 1 ? "bg-gray-400/10 text-gray-400 border border-gray-400/20" :
                        idx === 2 ? "bg-orange-700/10 text-orange-700 border border-orange-700/20" :
                          "bg-[#272732] text-gray-500"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-200 truncate group-hover:text-indigo-400 transition-colors">{novel.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{novel.views.toLocaleString()} Views</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <Link href="/top-bxh">
                <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white">Xem Tất Cả</Button>
              </Link>
            </div>
          </div>

          {/* Recently Read Box */}
          <div className="bg-[#1c1c24] rounded-xl border border-white/5 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-4">Vừa Đọc</h3>
            <div className="space-y-3">
              {/* Demo item - Linking to a demo chapter */}
              <Link href={`/truyen/${featuredNovel.slug}`} className="flex gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors">
                <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                  <img src={featuredNovel.cover || 'https://placehold.co/40x60/1e1e2e/FFF?text=?'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-200 truncate group-hover:text-indigo-400 transition-colors">{featuredNovel.title}</h4>
                  <p className="text-xs text-indigo-400">Xem chi tiết</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="bg-[#1c1c24] rounded-xl border border-white/5 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-4">Thể Loại Hot</h3>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 10).map(cat => (
                <Link key={cat.id} href={`/the-loai/${cat.slug}`} className="px-3 py-1.5 bg-[#272732] rounded-lg text-xs text-gray-400 hover:text-white hover:bg-indigo-600 transition-all cursor-pointer">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
