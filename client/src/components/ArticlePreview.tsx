import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TagBadge } from './TagBadge';
import { Clock, Calendar, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  author?: User | { name: string; avatarUrl?: string; email?: string } | null;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  excerpt,
  content,
  coverImage,
  tags = [],
  author,
}) => {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const authorName = author?.name || 'Author';
  const authorAvatar = author?.avatarUrl;

  return (
    <article className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 bg-white/90 rounded-2xl border border-emerald-100 shadow-sm">
      {/* 1. Cover Image Preview */}
      {coverImage ? (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100">
          <img
            src={coverImage}
            alt={title || 'Article Cover Preview'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if URL fails to load
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-emerald-50 via-lime-50/40 to-slate-100 border border-dashed border-emerald-200/80 flex items-center justify-center text-slate-400 text-xs font-medium">
          No cover image uploaded (Optional)
        </div>
      )}

      {/* 2. Article Header Details */}
      <div className="space-y-4">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
          {title.trim() ? title : <span className="text-slate-300 italic">Untitled Article</span>}
        </h1>

        {/* Excerpt / Short Description */}
        {excerpt.trim() && (
          <p className="text-lg text-slate-600 leading-relaxed font-serif italic border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/40 rounded-r-xl">
            {excerpt}
          </p>
        )}

        {/* Author Metadata Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-b border-slate-100 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-9 h-9 rounded-full object-cover border border-emerald-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>{authorName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  Author
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-700" />
                  <span>Today (Live Preview)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{readingTime} min read</span>
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              {wordCount} words
            </span>
          </div>
        </div>
      </div>

      {/* 3. Full Article Body Content */}
      <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-emerald-800 prose-img:rounded-xl prose-img:shadow-md pt-2">
        {content.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 italic text-sm">
            Write your story in the editor tab to see the live Markdown preview here...
          </div>
        )}
      </div>
    </article>
  );
};
