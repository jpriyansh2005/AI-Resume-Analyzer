import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiLayout,
  FiUploadCloud,
  FiClock,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiActivity,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiLayout },
    { name: 'Upload Resume', path: '/dashboard/upload', icon: FiUploadCloud },
    { name: 'Analysis History', path: '/dashboard/history', icon: FiClock },
    { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-[#0d1626]/60 border-r border-white/5 px-4 py-6">
      <div className="space-y-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg">
            <FiActivity className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            ATS Pro
          </span>
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/20 text-sm font-bold uppercase">
            {user?.name ? user.name.slice(0, 2) : 'US'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600/25 border border-purple-500/20 text-purple-300 shadow-md shadow-purple-500/5'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 bg-[#050b14]/90 px-4 md:hidden sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
            <FiActivity className="h-4 w-4" />
          </div>
          <span className="text-md font-bold tracking-tight text-white">ATS Pro</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg bg-white/5 border border-white/5 p-2 text-gray-400 hover:text-white"
        >
          {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden h-screen w-64 flex-shrink-0 md:block sticky top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (visible on trigger) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#050b14]/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-64 flex-col bg-[#050b14]">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
