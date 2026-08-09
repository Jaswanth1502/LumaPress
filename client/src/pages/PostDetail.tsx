import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlugApi, deletePostApi } from '../api/posts.api';
import { createCommentApi, deleteCommentApi, getPostCommentsApi } from '../api/comments.api';
import { useAuth } from '../context/AuthContext';
import { TagBadge } from '../components/TagBadge';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  MessageSquare,
  Send,
  User,
  LogIn,
  ArrowLeft,
} from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [commentContent, setCommentContent] = useState('');
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Fetch Post Details
  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = useQuery({
    queryKey: ['post-detail', slug],
    queryFn: () => getPostBySlugApi(slug!),
    enabled: !!slug,
  });

  // Fetch Comments for Post
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['post-comments', post?._id],
    queryFn: () => getPostCommentsApi(post!._id),
    enabled: !!post?._id,
  });

  // Create Comment Mutation
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createCommentApi(post!._id, content),
    onSuccess: () => {
      setCommentContent('');
      toast.success('Comment posted successfully');
      queryClient.invalidateQueries({ queryKey: ['post-comments', post?._id] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to post comment');
    },
  });

  // Delete Comment Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),
    onSuccess: () => {
      setCommentToDelete(null);
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['post-comments', post?._id] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete comment');
    },
  });

  // Delete Post Mutation
  const deletePostMutation = useMutation({
    mutationFn: () => deletePostApi(post!._id),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete post');
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }
    createCommentMutation.mutate(commentContent);
  };

  if (postLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-64 bg-slate-200/70 rounded-3xl w-full"></div>
        <div className="h-10 bg-slate-200/70 rounded-lg w-3/4"></div>
        <div className="h-6 bg-slate-200/70 rounded w-1/3"></div>
        <div className="space-y-4 pt-6">
          <div className="h-4 bg-slate-200/70 rounded w-full"></div>
          <div className="h-4 bg-slate-200/70 rounded w-full"></div>
          <div className="h-4 bg-slate-200/70 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Article Not Found"
          description="The article you are looking for does not exist or may have been removed."
          action={{ label: 'Return to Explore', onClick: () => navigate('/explore') }}
        />
      </div>
    );
  }

  const isAuthor = user && user.id === post.author._id;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const defaultCover =
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Back Link & Author Owner Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {isAuthor && (
          <div className="flex items-center gap-3">
            <Link
              to={`/posts/${post._id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>
            <button
              onClick={() => setDeletePostModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                onClick={() => navigate(`/explore?tag=${encodeURIComponent(tag)}`)}
              />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-emerald-700 pl-4 py-1">
          {post.excerpt}
        </p>

        {/* Meta Author Header */}
        <div className="flex items-center justify-between pt-4 border-t border-b border-slate-200/70 py-4">
          <Link to={`/users/${post.author._id}`} className="flex items-center gap-3 group">
            <img
              src={
                post.author.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.author.name
                )}&background=d1fae5&color=065f46`
              }
              alt={post.author.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-200"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {post.author.name}
              </p>
              <p className="text-xs text-slate-500 line-clamp-1">{post.author.bio || 'Author'}</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden glass-card shadow-lg bg-slate-100 max-h-[450px]">
        <img
          src={post.coverImage || defaultCover}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultCover;
          }}
        />
      </div>

      {/* Article Body Content (Markdown) */}
      <div className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-2xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {/* Comments Section */}
      <section className="pt-12 border-t border-slate-200/80 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <span>Comments ({comments.length})</span>
          </h2>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form
            onSubmit={handleCommentSubmit}
            className="rounded-2xl glass-card p-4 space-y-3 bg-white/80 border border-slate-200/80"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <img
                src={
                  user?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || 'User'
                  )}&background=e0e7ff&color=4338ca`
                }
                alt={user?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>Commenting as {user?.name}</span>
            </div>
            <textarea
              rows={3}
              placeholder="Share your thoughts on this article..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createCommentMutation.isPending || !commentContent.trim()}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl glass-panel bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-serif font-bold text-indigo-950 text-base">Join the Discussion</h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Log in or register an author account to share your feedback.
              </p>
            </div>
            <Link
              to="/login"
              state={{ from: { pathname: `/posts/${slug}` } }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In to Comment</span>
            </Link>
          </div>
        )}

        {/* Comment List */}
        {commentsLoading ? (
          <div className="space-y-4">
            <div className="h-20 bg-slate-200/60 rounded-xl animate-pulse"></div>
            <div className="h-20 bg-slate-200/60 rounded-xl animate-pulse"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-6">
            No comments yet. Be the first to leave a thought!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isCommentOwner = user && user.id === comment.author._id;
              const commentDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={comment._id}
                  className="rounded-2xl glass-card p-4 bg-white/70 border border-slate-200/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          comment.author.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.author.name
                          )}&background=e0e7ff&color=4338ca`
                        }
                        alt={comment.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-900 mr-2">
                          {comment.author.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{commentDate}</span>
                      </div>
                    </div>

                    {isCommentOwner && (
                      <button
                        onClick={() => setCommentToDelete(comment._id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 text-sm pl-9 leading-relaxed">{comment.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Delete Post Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletePostModalOpen}
        title="Delete Article"
        message="Are you sure you want to permanently delete this article? This action cannot be undone and will also delete all associated comments."
        onConfirm={() => deletePostMutation.mutate()}
        onCancel={() => setDeletePostModalOpen(false)}
        isDeleting={deletePostMutation.isPending}
      />

      {/* Delete Comment Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to delete your comment?"
        onConfirm={() => commentToDelete && deleteCommentMutation.mutate(commentToDelete)}
        onCancel={() => setCommentToDelete(null)}
        isDeleting={deleteCommentMutation.isPending}
      />
    </article>
  );
};
