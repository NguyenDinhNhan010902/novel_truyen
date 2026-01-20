import { getNovels, getCategories } from '@/lib/api';
import { NovelCard } from '@/components/ui/novel-card';
import { BookOpen } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch novels by category slug
    // Backend API expects "category_slug" param but mapped as "category" in our api.ts helper
    const novels = await getNovels({ category: slug });

    // We might want to get category details (name) to display nicely instead of slug
    // But currently our API doesn't have "getCategoryBySlug" easily accessible publicly without auth wrapper issues?
    // Let's decode slug as fallback title, or try to get category name if possible.
    // For now, decode slug is good enough or use list categories cache.
    // Actually, `getCategories` is available.

    const categories = await getCategories();
    // Safe lookup
    const currentCategory = categories.find(c => c.slug === slug || c.name === decodeURIComponent(slug)); // try both
    const displayName = currentCategory?.name || decodeURIComponent(slug);

    return (
        <div className="bg-[#13131a] min-h-screen py-10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <BookOpen className="h-8 w-8 text-indigo-500" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">
                        Thể loại: <span className="text-indigo-400">{displayName}</span>
                    </h1>
                    <span className="ml-auto text-sm text-gray-500 bg-[#1c1c24] px-3 py-1 rounded-full border border-white/5">
                        {novels.length} truyện
                    </span>
                </div>

                {/* List */}
                {novels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {novels.map((novel) => (
                            <NovelCard key={novel.id} novel={novel} />
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
