import React, { useEffect, useState } from 'react';
import { NovelApi } from '../services/api';
import { Activity, BookOpen, Users, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ novels: 0, views: 0, chapters: 0, rating: "0.0" });

    useEffect(() => {
        // Load some mock stats
        // Load real stats from API
        NovelApi.getNovels().then(novels => {
            const totalViews = novels.reduce((sum, n) => sum + n.views, 0);
            const totalChapters = novels.reduce((sum, n) => sum + n.totalChapters, 0);

            // Calculate average rating if needed, or fetch from backend
            const totalRating = novels.reduce((sum, n) => sum + n.rating, 0);
            const avgRating = novels.length > 0 ? (totalRating / novels.length).toFixed(1) : "0.0";

            setStats({
                novels: novels.length,
                views: totalViews,
                chapters: totalChapters,
                rating: avgRating
            });
        }).catch(err => console.error("Failed to load dashboard stats", err));
    }, []);

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Tổng Quan</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard icon={<BookOpen size={24} color="#8b5cf6" />} label="Tổng số Truyện" value={stats.novels} />
                <StatCard icon={<Users size={24} color="#10b981" />} label="Tổng Lượt xem" value={stats.views.toLocaleString()} />
                <StatCard icon={<Activity size={24} color="#f59e0b" />} label="Tổng số Chương" value={stats.chapters.toLocaleString()} />
                <StatCard icon={<Star size={24} color="#ef4444" />} label="Đánh giá TB" value={stats.rating} />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Hoạt động gần đây</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Chưa có dữ liệu hoạt động.</p>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</p>
        </div>
    </div>
);

export default Dashboard;
