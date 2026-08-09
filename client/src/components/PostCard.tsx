import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Lock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PALETTES = [
  { bg: 'from-amber-200 via-amber-300 to-amber-400', ring: 'border-white/30', text: 'text-white' },
  { bg: 'from-purple-300 via-indigo-300 to-purple-400', ring: 'border-white/30', text: 'text-white' },
  { bg: 'from-emerald-200 via-teal-300 to-emerald-400', ring: 'border-white/30', text: 'text-white' },
  { bg: 'from-rose-300 via-pink-300 to-rose-400', ring: 'border-white/30', text: 'text-white' },
  { bg: 'from-sky-200 via-indigo-300 to-blue-400', ring: 'border-white/30', text: 'text-white' },
];

export const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const titleChar = post.title ? post.title.trim().charAt(0).toUpperCase() : 'L';
  const charCode = titleChar.charCodeAt(0);
  const palette = PALETTES[charCode % PALETTES.length];

  const hasCustomCover =
    post.coverImage &&
    post.coverImage.trim() !== '' &&
    !post.coverImage.includes('unsplash.com/photo-1457369804613');

  return (
    <article className="group flex flex-col space-y-4">
      {/* Thumbnail Container */}
      <div className="relative overflow-hidden rounded-3xl shadow-xs transition-transform duration-300 group-hover:-translate-y-1">
        <Link to={`/posts/${post.slug}`} className="block">
          {hasCustomCover ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-56 object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className={`w-full h-56 rounded-3xl bg-gradient-to-br ${palette.bg} flex items-center justify-center relative overflow-hidden`}
            >
              {/* Concentric Circles */}
              <div
                className={`w-48 h-48 rounded-full border-12 ${palette.ring} flex items-center justify-center`}
              >
                <div
                  className={`w-36 h-36 rounded-full border-10 ${palette.ring} flex items-center justify-center`}
                >
                  <div
                    className={`w-24 h-24 rounded-full border-8 ${palette.ring} flex items-center justify-center bg-white/10 backdrop-blur-xs`}
                  >
                    <span className="text-4xl font-sans font-bold text-white tracking-widest drop-shadow-sm">
                      {titleChar}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Link>

        {post.status === 'draft' && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Draft</span>
          </div>
        )}
      </div>

      {/* Content Meta */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50/80 text-emerald-900 border border-emerald-200/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif font-bold text-2xl text-slate-900 group-hover:text-[#064e3b] transition-colors leading-tight">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Link
            to={`/users/${post.author._id}`}
            className="flex items-center gap-2 hover:text-emerald-800 transition-colors"
          >
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{post.author.name}</span>
          </Link>
          <span>·</span>
          <span>{formattedDate}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
};
