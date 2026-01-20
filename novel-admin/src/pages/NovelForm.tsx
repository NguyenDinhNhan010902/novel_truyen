import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NovelApi } from '../services/api';
import type { Novel, Category } from '../types';
import { Save, ArrowLeft, X } from 'lucide-react';

const NovelForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<Novel>>({
        title: '',
        slug: '',
        author: '',
        description: '',
        cover: '',
        tags: [], // Legacy, maybe remove later
        categories: [], // Store category NAMES for now as per API contract
        status: 'ONGOING'
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [autoSlug, setAutoSlug] = useState(true);
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        loadCategories();
        if (isEditMode && id) {
            loadNovel(id);
        }
    }, [id, isEditMode]);

    const loadNovel = async (novelId: string) => {
        setLoading(true);
        try {
            const data = await NovelApi.getNovelById(novelId);
            const processedData = {
                ...data,
                categories: data.categories?.map((c: any) => typeof c === 'string' ? c : c.name) || []
            };
            setFormData(processedData);
            // If editing existing novel, we shouldn't auto-update slug when title changes unless user explicitly asks
            setAutoSlug(false);
        } catch (err) {
            console.error("Failed to load novel", err);
            setError("Không thể tải thông tin truyện.");
        }
        setLoading(false);
    };

    const loadCategories = async () => {
        try {
            const data = await NovelApi.getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const toggleCategory = (catName: string) => {
        setFormData(prev => {
            const currentCats: string[] = (prev.categories || []).map((c: any) => typeof c === 'string' ? c : c.name);
            if (currentCats.includes(catName)) {
                return { ...prev, categories: currentCats.filter(c => c !== catName) };
            } else {
                return { ...prev, categories: [...currentCats, catName] };
            }
        });
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-generate slug from title
            if (name === 'title' && autoSlug) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });

        if (name === 'slug') {
            setAutoSlug(false);
            setSlugAvailable(null); // Reset check status when typing
        }
    };

    const handleGenerateSlug = () => {
        if (formData.title) {
            setFormData(prev => ({ ...prev, slug: generateSlug(prev.title || '') }));
            setAutoSlug(true);
        }
    };

    const checkSlug = async () => {
        if (!formData.slug) return;
        try {
            const result = await NovelApi.checkSlug(formData.slug);
            setSlugAvailable(result.available);
        } catch (err) {
            console.error("Failed check slug", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let validSlug = formData.slug;
        if (!validSlug && formData.title) {
            validSlug = generateSlug(formData.title);
        }

        const submitData = { ...formData, slug: validSlug };

        try {
            if (isEditMode && id) {
                await NovelApi.updateNovel(id, submitData);
            } else {
                await NovelApi.createNovel(submitData as Omit<Novel, 'id' | 'updatedAt' | 'totalChapters' | 'rating' | 'views'>);
            }
            navigate('/novels');
        } catch (err: any) {
            console.error("Failed to save novel", err);
            setError(err.response?.data?.detail || "Có lỗi xảy ra khi lưu truyện.");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/novels')} className="btn btn-ghost">
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {isEditMode ? 'Chỉnh sửa Truyện' : 'Thêm Truyện Mới'}
                </h2>
            </div>
            {isEditMode && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate(`/novels/${id}/chapters`)}
                        className="btn btn-outline"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                        Quản lý Chương
                    </button>
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card">
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Title */}
                    <div>
                        <label className="label">Tên truyện</label>
                        <input
                            type="text"
                            name="title"
                            className="input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="label">
                            Identifier (Slug)
                            <span
                                className="ml-2 text-xs opacity-70 cursor-pointer hover:underline text-blue-500"
                                onClick={handleGenerateSlug}
                                style={{ marginLeft: '10px', fontSize: '0.8rem' }}
                            >
                                (Tự động tạo từ tên)
                            </span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                name="slug"
                                className="input"
                                value={formData.slug}
                                onChange={handleChange}
                                onBlur={checkSlug}
                                placeholder="ten-truyen-viet-khong-dau"
                                required
                            />
                            {/* Validation Icon could go here */}
                        </div>
                        {!autoSlug && slugAvailable === false && (
                            <p style={{ color: 'orange', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                                Slug này đã tồn tại (sẽ tự động thêm số khi lưu).
                            </p>
                        )}
                        {!autoSlug && slugAvailable === true && (
                            <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                                Slug hợp lệ.
                            </p>
                        )}
                    </div>

                    {/* Author & Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="label">Tác giả</label>
                            <input
                                type="text"
                                name="author"
                                className="input"
                                value={formData.author}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Trạng thái</label>
                            <select
                                name="status"
                                className="input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="ONGOING">Đang ra</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="PAUSED">Tạm dừng</option>
                            </select>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="label">Ảnh bìa</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="input"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                setLoading(true);
                                                const url = await NovelApi.uploadImage(file);
                                                setFormData(prev => ({ ...prev, cover: url }));
                                            } catch (err) {
                                                console.error("Upload failed", err);
                                                setError("Upload ảnh thất bại. Vui lòng thử lại.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }
                                    }}
                                />
                                {formData.cover && (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => setFormData(prev => ({ ...prev, cover: '' }))}
                                        title="Xóa ảnh"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {formData.cover && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <img
                                        src={formData.cover}
                                        alt="Cover Preview"
                                        style={{ height: '200px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Mô tả</label>
                        <textarea
                            name="description"
                            className="input"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Audio Link */}
                    <div>
                        <label className="label">Link nghe truyện (Audio)</label>
                        <input
                            type="text"
                            name="audioUrl"
                            className="input"
                            value={formData.audioUrl || ''}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="label">Thể loại</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => toggleCategory(cat.name)}
                                    // Cast categories to string[] for checking
                                    className={`badge ${(formData.categories as string[])?.includes(cat.name) ? 'badge-primary' : 'badge-outline'}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => navigate('/novels')} className="btn btn-ghost">
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Save size={18} />
                            <span>{loading ? 'Đang lưu...' : 'Lưu Truyện'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NovelForm;
