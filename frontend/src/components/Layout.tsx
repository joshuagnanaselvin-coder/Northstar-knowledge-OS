import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, BookOpen, Search, CheckCircle,
  FileText, LogOut, Menu, X, ChevronRight,
  Globe, Shield
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Leader', 'Champion', 'Employee', 'Community Member'] },
    { to: '/competences', icon: BookOpen, label: 'Competences', roles: ['Admin', 'Leader', 'Champion', 'Employee', 'Community Member'] },
    { to: '/library', icon: FileText, label: 'Knowledge Library', roles: ['Admin', 'Leader', 'Champion', 'Employee', 'Community Member'] },
    { to: '/search', icon: Search, label: 'Spiral Search', roles: ['Admin', 'Leader', 'Champion', 'Employee', 'Community Member'] },
    { to: '/approvals', icon: CheckCircle, label: 'Approvals', roles: ['Admin', 'Leader', 'Champion'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(user?.role || 'Employee'));

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 w-64 h-full bg-slate-900 text-white transition-transform duration-200 flex flex-col`}>
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">NorthStar</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Knowledge OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-500/30 flex items-center justify-center text-xs font-medium text-primary-300">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">
            <span className="text-primary-500 font-medium">NorthStar</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-400">Knowledge Operating System</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-primary-500" />
              <span className="hidden sm:inline">Governed Access</span>
            </span>
            <div className="w-px h-5 bg-slate-200" />
            <span className="text-xs text-slate-400">v1.0 Prototype</span>
          </div>
        </header>
        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
