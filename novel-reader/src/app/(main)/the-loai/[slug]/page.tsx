import { MOCK_NOVELS } from '@/data/novels';
import { NovelCard } from '@/components/ui/novel-card';
import { BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    // Decode slug because it might contain URI encoded characters (e.g. %20 for space)
    const categoryName = decodeURIComponent(slug);

    // Filter novels by tag (case-insensitive partial match for better demo experience)
    // In a real app, this would be an exact slug match or ID match
    const novels = MOCK_NOVELS.filter(novel =>
        novel.tags.some(tag => tag.toLowerCase() === categoryName.toLowerCase()) ||
        // Fallback: if "Tien Hiep" matches "Tiên Hiệp" approx (simplified for mock)
        novel.tags.some(tag => tag.toLowerCase().includes(categoryName.toLowerCase()))
    );

    // If no novels found in mock data, show all for demo purposes or show empty state?
    // Let's show empty state if truly empty, but for "Tiên Hiệp" we expect results.

    // For better demo, if the list is small, duplicate it to fill the grid
    const displayNovels = novels.length > 0 ? (novels.length < 5 ? [...novels, ...novels, ...novels] : novels) : [];

    return (
        <div className="bg-[#13131a] min-h-screen py-10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <BookOpen className="h-8 w-8 text-indigo-500" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">
                        Thể loại: <span className="text-indigo-400">{categoryName}</span>
                    </h1>
                    <span className="ml-auto text-sm text-gray-500 bg-[#1c1c24] px-3 py-1 rounded-full border border-white/5">
                        {displayNovels.length} truyện
                    </span>
                </div>

                {/* List */}
                {displayNovels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {displayNovels.map((novel, idx) => (
                            <NovelCard key={`${novel.id}-${idx}`} novel={novel} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg">Chưa có truyện nào thuộc thể loại này.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
