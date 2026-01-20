import { getNovels } from '@/lib/api';
import { NovelCard } from '@/components/ui/novel-card';
import { Search, Frown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';

interface Props {
    searchParams: Promise<{
        q?: string;
        status?: string;
        category?: string;
        sort?: string;
        min_c?: string;
        max_c?: string;
    }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;

    // Clean and parse params
    const filters = {
        q: params.q,
        status: params.status,
        category: params.category,
        sort: params.sort,
        min_c: params.min_c ? parseInt(params.min_c) : undefined,
        max_c: params.max_c ? parseInt(params.max_c) : undefined,
    };

    const novels = await getNovels(filters);

    return (
        <div className="min-h-screen bg-[#13131a] pb-12">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 text-gray-400 mb-2 text-sm">
                        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-white">Tìm kiếm</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <Search className="h-6 w-6 text-indigo-500" />
                        <h1 className="text-2xl font-bold text-white">
                            Kết quả tìm kiếm {filters.q ? <span>cho: <span className="text-indigo-400">"{filters.q}"</span></span> : "nâng cao"}
                        </h1>
                    </div>

                    {/* Add Filter Bar */}
                    <FilterBar />

                    <p className="text-gray-400 mt-2 text-sm">Tìm thấy {novels.length} kết quả phù hợp</p>
                </div>

                {/* Results Grid */}
                {novels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {novels.map((novel) => (
                            <NovelCard key={novel.id} novel={novel} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#1c1c24] rounded-2xl border border-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Frown className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Không tìm thấy truyện nào</h3>
                        <p className="text-gray-400 text-center max-w-md mb-6">
                            Không có kết quả nào phù hợp với bộ lọc hiện tại.
                        </p>
                        <Link href="/tim-kiem">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                Xóa bộ lọc
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
