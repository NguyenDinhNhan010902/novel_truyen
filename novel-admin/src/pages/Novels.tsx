import React, { useEffect, useState } from 'react';
import type { Novel } from '../types';
import { NovelApi } from '../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NovelsPage: React.FC = () => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await NovelApi.getNovels();
            setNovels(data);
        } catch (error) {
            console.error("Failed to load novels", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Quản lý Truyện</h2>
                <Link to="/novels/new" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} />
                    <span>Thêm Truyện Mới</span>
                </Link>
            </div>

            <div className="card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input type="text" className="input" placeholder="Tìm kiếm truyện..." style={{ paddingLeft: '2.5rem' }} />
                    </div>
                    <select className="input" style={{ width: '200px' }}>
                        <option value="all">Tất cả trạng thái</option>
                        <option value="ONGOING">Đang ra</option>
                        <option value="COMPLETED">Hoàn thành</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Truyện</th>
                                <th>Tác giả</th>
                                <th>Trạng thái</th>
                                <th>Chương</th>
                                <th>Lượt xem</th>
                                <th style={{ textAlign: 'right' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {novels.map(novel => (
                                <tr key={novel.id}>
                                    <td>
                                        <Link to={`/novels/${novel.id}/chapters`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                                <img
                                                    src={novel.cover || 'https://placehold.co/40x60/333/FFF?text=?'}
                                                    alt=""
                                                    style={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 4, background: '#333' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 500, color: 'var(--primary)' }}>{novel.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {(novel.categories || []).map((c: any) => c.name || c).slice(0, 2).join(', ') || (novel.tags || []).join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>{novel.author}</td>
                                    <td>
                                        <StatusBadge status={novel.status} />
                                    </td>
                                    <td>{novel.totalChapters}</td>
                                    <td>{novel.views.toLocaleString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link to={`/novels/${novel.id}/edit`} className="btn btn-ghost" title="Sửa" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                className="btn btn-ghost"
                                                style={{ color: 'var(--danger)' }}
                                                title="Xóa"
                                                onClick={async () => {
                                                    if (window.confirm('Bạn có chắc chắn muốn xóa truyện này? Hành động này không thể hoàn tác và sẽ xóa tất cả các chương.')) {
                                                        try {
                                                            await NovelApi.deleteNovel(novel.id);
                                                            // Reload data or filter out
                                                            setNovels(prev => prev.filter(n => n.id !== novel.id));
                                                        } catch (error) {
                                                            console.error("Delete failed", error);
                                                            alert("Xóa truyện thất bại. Vui lòng thử lại.");
                                                        }
                                                    }
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    let className = 'badge ';
    let label = status;
    if (status === 'ONGOING') {
        className += 'badge-warning';
        label = 'Đang ra';
    } else if (status === 'COMPLETED') {
        className += 'badge-success';
        label = 'Hoàn thành';
    } else {
        className += 'badge-danger';
        label = 'Tạm dừng';
    }
    return <span className={className}>{label}</span>;
}

export default NovelsPage;
