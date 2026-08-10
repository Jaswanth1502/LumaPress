import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlugApi, updatePostApi } from '../api/posts.api';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';
import { ImageInput } from '../components/ImageInput';
import { ArticlePreview } from '../components/ArticlePreview';
import { toast } from 'sonner';
import {
  Edit,
  Eye,
  Edit3,
  Image as ImageIcon,
  Save,
  Send,
  Plus,
  X,
} from 'lucide-react';

const postSchema = z.object({
  title: z.string().trim().min(1, 'Title is required and cannot be empty'),
  excerpt: z.string().trim().min(1, 'Excerpt is required and cannot be empty').max(300, 'Excerpt cannot exceed 300 characters'),
  content: z.string().trim().min(1, 'Content is required and cannot be empty'),
  coverImage: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Fetch existing post details
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['edit-post', id],
    queryFn: () => getPostBySlugApi(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (post) {
      // Check author authorization
      if (user && user.id !== post.author._id) {
        toast.error('Unauthorized: You can only edit your own posts.');
        navigate('/dashboard');
        return;
      }
      setValue('title', post.title);
      setValue('excerpt', post.excerpt);
      setValue('content', post.content);
      setValue('coverImage', post.coverImage || '');
      setTags(post.tags || []);
      setStatus(post.status);
    }
  }, [post, user, setValue, navigate]);

  const contentValue = watch('content', '');
  const excerptValue = watch('excerpt', '');
  const titleValue = watch('title', '');

  const updateMutation = useMutation({
    mutationFn: (data: any) => updatePostApi(post!._id, data),
    onSuccess: (updatedPost) => {
      toast.success('Article updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-detail', updatedPost.slug] });
      navigate(`/posts/${updatedPost.slug}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update post');
    },
  });

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleUpdate = (targetStatus?: 'draft' | 'published') => {
    handleSubmit((values) => {
      updateMutation.mutate({
        ...values,
        tags,
        status: targetStatus || status,
      });
    })();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200/70 rounded-lg w-1/2"></div>
        <div className="h-12 bg-slate-200/70 rounded-xl w-full"></div>
        <div className="h-40 bg-slate-200/70 rounded-xl w-full"></div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Unable to load post for editing"
          description="The requested post could not be retrieved or you lack permission to modify it."
          action={{ label: 'Return to Dashboard', onClick: () => navigate('/dashboard') }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <Edit className="w-7 h-7 text-emerald-800" />
            <span>Edit Article</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Updating "{post.title}". Original published date will be preserved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleUpdate('draft')}
            disabled={updateMutation.isPending}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleUpdate('published')}
            disabled={updateMutation.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0d5c3a] hover:bg-[#0b4d30] active:bg-emerald-900 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Updating...' : 'Publish Updates'}</span>
          </button>
        </div>
      </div>

      <form className="space-y-6">
        {/* Article Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Article Title *
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="e.g. Design Systems for Scalable React Architecture"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-serif font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Short Excerpt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Short Excerpt / Summary *
            </label>
            <span className="text-xs text-slate-400">
              {excerptValue?.length || 0} / 300 characters
            </span>
          </div>
          <textarea
            rows={2}
            {...register('excerpt')}
            placeholder="A brief 1-2 sentence overview of what readers will learn from your post..."
            className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.excerpt && <p className="mt-1.5 text-xs text-red-600">{errors.excerpt.message}</p>}
        </div>

        {/* Cover Image */}
        <ImageInput
          value={watch('coverImage') || ''}
          onChange={(val) => setValue('coverImage', val, { shouldDirty: true })}
          label="Cover Image (Optional)"
        />

        {/* Tags Management */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Topics / Tags
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a tag (e.g. Engineering)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-indigo-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Editor Tabs (Write vs Live Markdown Preview) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden glass-card">
          <div className="flex items-center justify-between bg-slate-100/70 border-b border-slate-200 px-4 py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'write'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write (Markdown)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <span className="text-xs text-slate-400">
              {contentValue?.split(/\s+/).filter(Boolean).length || 0} words
            </span>
          </div>

          <div className="p-4">
            {activeTab === 'write' ? (
              <textarea
                rows={16}
                {...register('content')}
                placeholder="Write your article content using Markdown formatting..."
                className="w-full p-2 border-0 bg-transparent text-sm focus:outline-none font-mono text-slate-800 leading-relaxed resize-y"
              />
            ) : (
              <ArticlePreview
                title={titleValue}
                excerpt={excerptValue}
                content={contentValue}
                coverImage={watch('coverImage')}
                tags={tags}
                author={user}
              />
            )}
          </div>
        </div>
        {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
      </form>
    </div>
  );
};
