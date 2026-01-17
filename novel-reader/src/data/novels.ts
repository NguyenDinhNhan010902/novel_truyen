export type NovelStatus = 'ONGOING' | 'COMPLETED' | 'PAUSED';

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Novel {
    id: string | number; // Adapt to backend int id
    title: string;
    slug: string;
    author: string;
    cover: string; // URL ảnh bìa
    description: string;
    audioUrl?: string;
    tags?: string[]; // Legacy
    categories?: Category[]; // New
    status: NovelStatus;
    totalChapters: number;
    rating: number; // 0-5
    views: number;
    updatedAt: string; // ISO String
}

export const MOCK_NOVELS: Novel[] = [];
