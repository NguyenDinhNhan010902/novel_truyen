import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NovelApi } from '../services/api';
import type { Chapter, Novel } from '../types';
import { ArrowLeft, Plus, Edit } from 'lucide-react';

const ChapterList: React.FC = () => {
    const { id: novelId } = useParams<{ id: string }>();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [novel, setNovel] = useState<Novel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (novelId) {
            loadData();
        }
    }, [novelId]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (!novelId) return;
            const [novelData, chaptersData] = await Promise.all([
                NovelApi.getNovelById(novelId),
                NovelApi.getChapters(novelId)
            ]);
            setNovel(novelData);
            setChapters(chaptersData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) return <div className="p-8 text-center text-gray-400">Đang tải...</div>;
    if (!novel) return <div className="p-8 text-center text-red-400">Không tìm thấy truyện</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to={`/novels/${novelId}/edit`} className="btn btn-ghost">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Quản lý chương</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{novel.title}</p>
                    </div>
                </div>
                <Link to={`/novels/${novelId}/chapters/new`} className="btn btn-primary">
                    <Plus size={20} />
                    <span>Thêm Chương Mới</span>
                </Link>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Thứ tự</th>
                            <th>Tên chương</th>
                            <th style={{ width: '150px' }}>Cập nhật</th>
                            <th style={{ width: '120px', textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chapters.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    Chưa có chương nào.
                                </td>
                            </tr>
                        ) : (
                            chapters.map(chapter => (
                                <tr key={chapter.id}>
                                    <td style={{ textAlign: 'center' }}>{chapter.order}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{chapter.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '500px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {chapter.content.substring(0, 50)}...
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.9rem' }}>
                                        {new Date(chapter.updatedAt || Date.now()).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link to={`/novels/${novelId}/chapters/${chapter.id}`} className="btn btn-ghost" title="Sửa">
                                                <Edit size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChapterList;
