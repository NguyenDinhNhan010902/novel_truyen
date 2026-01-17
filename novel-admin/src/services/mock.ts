import type { Novel } from '../types';

// Mock Data
let MOCK_NOVELS: Novel[] = [
    {
        id: '1',
        title: 'Đại Đạo Độc Hành',
        slug: 'dai-dao-doc-hanh',
        author: 'Vụ Ngoại',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80',
        description: 'Câu chuyện tu tiên cổ điển với nhân vật chính quyết đoán.',
        tags: ['Tiên Hiệp', 'Tu Chân'],
        status: 'ONGOING',
        totalChapters: 1250,
        rating: 4.8,
        views: 15420,
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Thương Khung Chi Kiếm',
        slug: 'thuong-khung-chi-kiem',
        author: 'Lão Trư',
        cover: 'https://images.unsplash.com/photo-1614726365723-49fb36563603?q=80',
        description: 'Kiếm hiệp kỳ ảo.',
        tags: ['Kiếm Hiệp'],
        status: 'COMPLETED',
        totalChapters: 560,
        rating: 4.5,
        views: 8900,
        updatedAt: new Date().toISOString(),
    }
];

export const NovelService = {
    getNovels: async (): Promise<Novel[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...MOCK_NOVELS];
    },

    getNovelById: async (id: string): Promise<Novel | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_NOVELS.find(n => n.id === id);
    },

    saveNovel: async (novel: Novel): Promise<Novel> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = MOCK_NOVELS.findIndex(n => n.id === novel.id);
        if (index >= 0) {
            MOCK_NOVELS[index] = novel;
        } else {
            MOCK_NOVELS.push(novel);
        }
        return novel;
    },

    deleteNovel: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        MOCK_NOVELS = MOCK_NOVELS.filter(n => n.id !== id);
    }
};
