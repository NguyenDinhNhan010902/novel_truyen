export type NovelStatus = 'ONGOING' | 'COMPLETED' | 'PAUSED';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Novel {
    id: string; // Backend returns int, but frontend uses string for ID params usually. Let's keep consistent.
    // Actually backend returns `id: int`. JS handles numbers fine. 
    // React Router params are strings.
    title: string;
    slug: string;
    author: string;
    tags?: string[]; // Legacy
    categories?: Category[] | string[]; // New (Category[] from API, string[] for payload)
    cover?: string;
    description?: string;
    audioUrl?: string; // Link nghe truyện from YouTube or similar HTML embedding
    status: NovelStatus;
    totalChapters: number;
    rating: number; // Avg rating
    views: number;
    updatedAt: string; // ISO date string
}

export interface Chapter {
    id: string;
    novelId: string;
    title: string;
    order: number;
    content: string;
    updatedAt: string;
}
