import { Novel, Category } from '@/data/novels';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as any),
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`API call failed: ${res.statusText}`);
    }
    return res.json();
}

// Novel API
export interface NovelFilters {
    q?: string;
    status?: string;
    category?: string;
    sort?: string;
    min_c?: number;
    max_c?: number;
}

export async function getNovels(filters: NovelFilters | string = {}): Promise<Novel[]> {
    try {
        let queryParams = new URLSearchParams();

        if (typeof filters === 'string') {
            if (filters) queryParams.append('q', filters);
        } else {
            if (filters.q) queryParams.append('q', filters.q);
            if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status);
            if (filters.category && filters.category !== 'ALL') queryParams.append('category', filters.category);
            if (filters.sort) queryParams.append('sort', filters.sort);
            if (filters.min_c) queryParams.append('min_c', filters.min_c.toString());
            if (filters.max_c) queryParams.append('max_c', filters.max_c.toString());
        }

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return await fetchWithAuth(`/novels/${queryString}`);
    } catch (error) {
        console.error("Error fetching novels", error);
        return [];
    }
}

export async function getNovel(slug: string): Promise<Novel | null> {
    try {
        return await fetchWithAuth(`/novels/slug/${slug}`);
    } catch (error) {
        console.error("Error fetching novel by slug", error);
        return null;
    }
}

// Chapter API
export interface Chapter {
    id: number | string;
    novelId: number | string;
    title: string;
    order: number;
    content: string;
    updatedAt: string;
}

export async function getChapters(novelId: number | string): Promise<Chapter[]> {
    try {
        return await fetchWithAuth(`/novels/${novelId}/chapters/`);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getChapter(id: number | string): Promise<Chapter | null> {
    try {
        // Validate ID is numeric to match backend requirement
        if (!id || (typeof id === 'string' && !/^\d+$/.test(id) && isNaN(Number(id)))) {
            return null;
        }
        return await fetchWithAuth(`/chapters/${id}`);
    } catch (e) {
        console.error(e);
        return null;
    }
}

// Auth API types
export interface User {
    id: number;
    email: string;
    username: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export const authApi = {
    register: async (form: any): Promise<User> => {
        return fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify(form)
        });
    },

    login: async (form: any): Promise<AuthResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', form.username);
        formData.append('password', form.password);

        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (errorData.detail === 'Email not verified') {
                throw new Error('EMAIL_NOT_VERIFIED');
            }
            throw new Error('Login failed');
        }
        return res.json();
    },

    verifyEmail: async (email: string, code: string): Promise<any> => {
        return fetchWithAuth('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ email, code })
        });
    },

    getMe: async (): Promise<User> => {
        return fetchWithAuth('/users/me');
    },

    forgotPassword: async (email: string): Promise<any> => {
        return fetchWithAuth('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    resetPassword: async (email: string, code: string, new_password: string): Promise<any> => {
        return fetchWithAuth('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, code, new_password })
        });
    }
};

export async function getCategories(): Promise<Category[]> {
    try {
        return await fetchWithAuth('/categories/');
    } catch (error) {
        console.error("Error fetching categories", error);
        return [];
    }
}
