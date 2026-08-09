import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Feather,
  PenSquare,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Home,
  BookOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-emerald-800 flex items-center gap-1.5 ${
      isActive ? 'text-emerald-800 font-semibold' : 'text-slate-600'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center border border-emerald-200/60 group-hover:bg-emerald-800 group-hover:text-white transition-all duration-300">
              <Feather className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                LumaPress
              </span>
              <span className="text-[10px] tracking-widest text-slate-600 uppercase font-semibold -mt-1">
                Editorial
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            {!isAuthPage && (
              <>
                <NavLink to="/explore" className={navLinkClass}>
                  <Compass className="w-4 h-4" />
                  <span>Explore</span>
                </NavLink>
                <NavLink to="/our-story" className={navLinkClass}>
                  <BookOpen className="w-4 h-4" />
                  <span>Our Story</span>
                </NavLink>
              </>
            )}
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/posts/create"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0d5c3a] hover:bg-[#0b4d30] active:bg-emerald-900 transition-all shadow-xs hover:shadow-md"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write Post</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-emerald-50 transition-colors border border-slate-200/70 cursor-pointer"
                  >
                    <img
                      src={
                        user?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || 'User'
                        )}&background=d1fae5&color=065f46`
                      }
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-card bg-white/95 border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile & Settings</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>My Dashboard</span>
                      </Link>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 transition-colors"
                  >
                    Log In
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0d5c3a] hover:bg-[#0b4d30] transition-all shadow-xs"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card bg-white/95 border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink>
          {!isAuthPage && (
            <>
              <NavLink
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <Compass className="w-5 h-5" />
                <span>Explore Articles</span>
              </NavLink>
              <NavLink
                to="/our-story"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <BookOpen className="w-5 h-5" />
                <span>Our Story</span>
              </NavLink>
            </>
          )}
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/posts/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-indigo-600 font-medium bg-indigo-50"
              >
                <PenSquare className="w-5 h-5" />
                <span>Write New Article</span>
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </NavLink>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-left font-medium cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl"
                >
                  Log In
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl"
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
