import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { NovelApi } from '../services/api';
import type { Chapter } from '../types';
import { Save, ArrowLeft } from 'lucide-react';

const ChapterForm: React.FC = () => {
    const { id: novelId, chapterId } = useParams<{ id: string, chapterId: string }>();
    const isEditMode = !!chapterId && chapterId !== 'new';
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Partial<Chapter>>({
        title: '',
        content: '',
        order: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (novelId) {
            // If new, try to guess next order
            if (!isEditMode) {
                NovelApi.getChapters(novelId).then(chapters => {
                    const maxOrder = chapters.reduce((max, c) => Math.max(max, c.order || 0), 0);
                    setFormData(prev => ({ ...prev, order: maxOrder + 1 }));
                });
            } else if (chapterId) {
                // Load existing
                setLoading(true);
                NovelApi.getChapterById(chapterId).then(data => {
                    setFormData(data);
                }).catch(err => {
                    console.error(err);
                    setError("Không thể tải nội dung chương");
                }).finally(() => setLoading(false));
            }
        }
    }, [novelId, chapterId, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novelId) return;
        setLoading(true);
        setError(null);

        try {
            if (isEditMode && chapterId) {
                await NovelApi.updateChapter(chapterId, formData);
            } else {
                await NovelApi.createChapter(novelId, formData);
            }
            navigate(`/novels/${novelId}/chapters`);
        } catch (err: any) {
            console.error(err);
            setError("Lỗi khi lưu chương");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <Link to={`/novels/${novelId}/chapters`} className="btn btn-ghost">
                    <ArrowLeft size={20} />
                </Link>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {isEditMode ? 'Chỉnh sửa Chương' : 'Thêm Chương Mới'}
                </h2>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card">
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem' }}>
                        <div>
                            <label className="label">Thứ tự</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.order}
                                onChange={e => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Tên chương</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Ví dụ: Chương 1: Mở đầu"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Nội dung</label>
                        <textarea
                            className="input"
                            style={{ minHeight: '500px', fontFamily: 'monospace', lineHeight: '1.6', fontSize: '1rem' }}
                            value={formData.content}
                            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Nhập nội dung truyện tại đây..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Link to={`/novels/${novelId}/chapters`} className="btn btn-ghost">Hủy bỏ</Link>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Save size={18} />
                            <span>{loading ? 'Đang lưu...' : 'Lưu Chương'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChapterForm;
