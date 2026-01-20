import { getNovel, getChapter, getChapters } from '@/lib/api';
import { notFound } from 'next/navigation';
import { ReadingView } from '@/components/reading/ReadingView';

interface PageProps {
    params: Promise<{
        slug: string;
        chapterId: string;
    }>;
}

export default async function ChapterPage({ params }: PageProps) {
    const { slug, chapterId } = await params;

    // 1. Fetch Novel info (for title/breadcrumbs)
    const novel = await getNovel(slug);
    if (!novel) notFound();

    // 2. Fetch Chapter content
    const chapterPromise = getChapter(chapterId);

    // 3. Fetch all chapters for navigation (Next/Prev)
    // Optimization: If novel has 1000+ chapters, this might be heavy.
    // Ideally backend 'get_chapter' should return next/prev IDs.
    // For now, fetching list is acceptable for < 1000 chapters.
    const chaptersListPromise = getChapters(novel.id);

    const [chapter, chaptersList] = await Promise.all([chapterPromise, chaptersListPromise]);

    if (!chapter) notFound();

    // Determine Next/Prev based on sorted order
    const sortedChapters = chaptersList.sort((a, b) => a.order - b.order);
    const currentIndex = sortedChapters.findIndex(c => String(c.id) === String(chapterId));

    // If somehow not found in list but found in detail (sync issue), fallback
    const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : undefined;
    const nextChapter = currentIndex >= 0 && currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : undefined;

    return (
        <div className="bg-white min-h-screen">
            <ReadingView
                chapter={chapter}
                novel={novel}
                prevChapterId={prevChapter?.id ? String(prevChapter.id) : undefined}
                nextChapterId={nextChapter?.id ? String(nextChapter.id) : undefined}
            />
        </div>
    );
}
