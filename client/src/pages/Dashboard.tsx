import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyPostsApi, updatePostStatusApi, deletePostApi } from '../api/posts.api';
import { useAuth } from '../context/AuthContext';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  Eye,
  Edit,
  Trash2,
  Lock,
  Globe,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);

  // Fetch author posts & statistics
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-posts', { searchQuery, statusFilter, page }],
    queryFn: () =>
      getMyPostsApi({
        q: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 8,
      }),
  });

  // Toggle status mutation (Draft <-> Published)
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: 'draft' | 'published' }) =>
      updatePostStatusApi(id, newStatus),
    onSuccess: (updatedPost) => {
      toast.success(`Article status changed to ${updatedPost.status}`);
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update post status');
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => deletePostApi(id),
    onSuccess: () => {
      setPostToDelete(null);
      toast.success('Post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete post');
    },
  });

  const posts = data?.posts || [];
  const stats = data?.stats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    commentsReceived: 0,
  };
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-emerald-200/60 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/80">
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-800" />
            <span>Author Control Center</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Manage your draft and published articles, track reader engagement, and compose new editorial posts.
          </p>
        </div>

        <Link
          to="/posts/create"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-[#0d5c3a] hover:bg-[#0b4d30] active:bg-emerald-900 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <PenSquare className="w-4 h-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Total Posts */}
        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200/70">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Articles
            </span>
            <FileText className="w-5 h-5 text-emerald-800" />
          </div>
          <p className="text-3xl font-serif font-bold text-slate-900">{stats.totalPosts}</p>
        </div>

        {/* Published Posts */}
        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200/70">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Published
            </span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-slate-900">{stats.publishedPosts}</p>
        </div>

        {/* Draft Posts */}
        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200/70">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Drafts
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-slate-900">{stats.draftPosts}</p>
        </div>

        {/* Total Comments Received */}
        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200/70">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Comments
            </span>
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-slate-900">{stats.commentsReceived}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100/80 border border-slate-200/70 text-xs font-semibold">
            <button
              onClick={() => {
                setStatusFilter('all');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Articles ({stats.totalPosts})
            </button>
            <button
              onClick={() => {
                setStatusFilter('published');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'published'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published ({stats.publishedPosts})
            </button>
            <button
              onClick={() => {
                setStatusFilter('draft');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drafts ({stats.draftPosts})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Posts Table / Cards */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-16 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          </div>
        ) : isError ? (
          <EmptyState
            title="Error loading your dashboard"
            description="Could not load your articles. Please refresh or try again later."
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<PenSquare className="w-10 h-10 text-indigo-500" />}
            title="No articles match your filter"
            description={
              searchQuery
                ? `No articles matching "${searchQuery}" were found.`
                : "You haven't written any articles yet. Create your first post today!"
            }
            action={{
              label: 'Create New Post',
              onClick: () => navigate('/posts/create'),
            }}
          />
        ) : (
          <div className="rounded-3xl glass-card overflow-hidden border border-slate-200/80 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200/70">
                  <tr>
                    <th className="px-6 py-4">Title & Excerpt</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => {
                    const formattedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={post._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 max-w-md">
                          <Link
                            to={`/posts/${post.slug}`}
                            className="font-serif font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          {post.status === 'published' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Globe className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Post */}
                            <Link
                              to={`/posts/${post.slug}`}
                              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="View Article"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit Post */}
                            <Link
                              to={`/posts/${post._id}/edit`}
                              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Status Toggle Button */}
                            <button
                              onClick={() =>
                                toggleStatusMutation.mutate({
                                  id: post._id,
                                  newStatus: post.status === 'published' ? 'draft' : 'published',
                                })
                              }
                              disabled={toggleStatusMutation.isPending}
                              className="px-2.5 py-1 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                              title={
                                post.status === 'published'
                                  ? 'Unpublish to Draft'
                                  : 'Publish Article'
                              }
                            >
                              {post.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Delete Post */}
                            <button
                              onClick={() =>
                                setPostToDelete({ id: post._id, title: post.title })
                              }
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="p-4 border-t border-slate-100">
                <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Post Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!postToDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${postToDelete?.title}"? All comments will also be permanently removed.`}
        onConfirm={() => postToDelete && deletePostMutation.mutate(postToDelete.id)}
        onCancel={() => setPostToDelete(null)}
        isDeleting={deletePostMutation.isPending}
      />
    </div>
  );
};
