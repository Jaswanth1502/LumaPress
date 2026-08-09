import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Explore } from '../pages/Explore';
import { PostDetail } from '../pages/PostDetail';
import { CreatePost } from '../pages/CreatePost';
import { EditPost } from '../pages/EditPost';
import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { OurStory } from '../pages/OurStory';
import { NotFound } from '../pages/NotFound';
import { Forbidden } from '../pages/Forbidden';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="users/:id" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="our-story" element={<OurStory />} />
        <Route path="forbidden" element={<Forbidden />} />

        {/* Protected Author Routes */}
        <Route
          path="posts/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
