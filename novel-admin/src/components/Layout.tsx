import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, LogOut, Book } from 'lucide-react';

const Layout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="mb-8 flex items-center gap-3 px-2">
                    <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Book color="white" size={20} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Admin Panel</h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Tổng quan" />
                    <NavItem to="/novels" icon={<BookOpen size={20} />} label="Quản lý Truyện" />
                    <NavItem to="/settings" icon={<Settings size={20} />} label="Cài đặt" />
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }}>
                        <LogOut size={20} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`
        }
        style={({ isActive }) => ({
            justifyContent: 'flex-start',
            background: isActive ? 'var(--accent)' : 'transparent',
            color: isActive ? 'white' : 'inherit'
        })}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default Layout;
