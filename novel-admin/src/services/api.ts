import axios from 'axios';
import type { Novel, Category, Chapter } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthApi = {
    login: async (username: string, password: string): Promise<{ access_token: string; token_type: string }> => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await apiClient.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    },

    getMe: async (): Promise<{ id: number; username: string; email: string; role: string }> => {
        const response = await apiClient.get('/users/me');
        return response.data;
    }
};

export const NovelApi = {
    getNovels: async (): Promise<Novel[]> => {
        const response = await apiClient.get<Novel[]>('/novels/');
        return response.data;
    },

    getNovelById: async (id: string): Promise<Novel> => {
        const response = await apiClient.get<Novel>(`/novels/${id}`);
        return response.data;
    },

    createNovel: async (novel: Omit<Novel, 'id' | 'updatedAt' | 'totalChapters' | 'rating' | 'views'>): Promise<Novel> => {
        // Backend expect snake_case but frontend use camelCase. 
        // We might need to map manualy or ensure backend Pydantic handles alias.
        // For now let's map manually to be safe or update backend schema aliases.
        // Actually, backend main.py uses schemas.NovelUpdate/Create which expects snake_case keys if Aliases not set.
        // Let's rely on standard JSON for now, matching Schema defined in Backend.

        // Mapping FE to BE payload
        const payload = {
            title: novel.title,
            slug: novel.slug,
            author: novel.author,
            tags: novel.tags || [],
            categories: novel.categories || [], // Add this
            cover: novel.cover,
            description: novel.description,
            audioUrl: novel.audioUrl, // Ensure schema supports this alias or map it
            status: novel.status
        };
        const response = await apiClient.post<Novel>('/novels/', payload);
        return response.data;
    },

    updateNovel: async (id: string, novel: Partial<Novel>): Promise<Novel> => {
        const payload: any = {};
        if (novel.title) payload.title = novel.title;
        if (novel.slug) payload.slug = novel.slug;
        if (novel.author) payload.author = novel.author;
        if (novel.tags) payload.tags = novel.tags;
        if (novel.categories) payload.categories = novel.categories; // Add this
        if (novel.cover) payload.cover = novel.cover;
        if (novel.description) payload.description = novel.description;
        if (novel.audioUrl) payload.audioUrl = novel.audioUrl;
        if (novel.status) payload.status = novel.status;

        const response = await apiClient.put<Novel>(`/novels/${id}`, payload);
        return response.data;
    },

    deleteNovel: async (id: string): Promise<void> => {
        await apiClient.delete(`/novels/${id}`);
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post<{ url: string }>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    },

    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>('/categories/');
        return response.data;
    },

    checkSlug: async (slug: string): Promise<{ slug: string; available: boolean }> => {
        const response = await apiClient.get<{ slug: string; available: boolean }>(`/novels/utils/check-slug`, {
            params: { slug }
        });
        return response.data;
    },

    // Chapter API
    getChapters: async (novelId: string): Promise<Chapter[]> => {
        const response = await apiClient.get<Chapter[]>(`/novels/${novelId}/chapters/`);
        return response.data;
    },

    getChapterById: async (chapterId: string): Promise<Chapter> => {
        const response = await apiClient.get<Chapter>(`/chapters/${chapterId}`);
        return response.data;
    },

    createChapter: async (novelId: string, chapter: Partial<Chapter>): Promise<Chapter> => {
        const response = await apiClient.post<Chapter>(`/novels/${novelId}/chapters/`, chapter);
        return response.data;
    },

    updateChapter: async (chapterId: string, chapter: Partial<Chapter>): Promise<Chapter> => {
        const response = await apiClient.put<Chapter>(`/chapters/${chapterId}`, chapter);
        return response.data;
    }
};
