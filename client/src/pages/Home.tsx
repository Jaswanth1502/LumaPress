import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPostsApi } from '../api/posts.api';
import { PostCard } from '../components/PostCard';
import { PostSkeleton } from '../components/PostSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Sparkles, ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-posts'],
    queryFn: () => getPostsApi({ page: 1, limit: 7, sort: 'newest' }),
  });

  const posts = data?.posts || [];
  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section (Matching Reference Pic Design) */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-lime-50/20 to-transparent pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 flex flex-col items-center">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Welcome to LumaPress Publishing</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#064e3b] leading-[1.05] max-w-4xl">
            Stories & Insights for the <br />
            <span className="italic text-[#65a30d] font-serif font-normal">Modern Builder</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-lg sm:text-xl font-normal max-w-2xl leading-relaxed pt-1">
            Discover thoughtful articles on engineering, user interface design, and software architecture. Written by creators, for creators.
          </p>

          {/* Dual Action Pill Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-4 pt-4">
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-full bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Explore stories</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/posts/create"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-emerald-50/60 border border-emerald-200/80 text-[#064e3b] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <span>Start writing</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </Link>
          </div>

          {/* Social Proof Avatar Row */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-2xs">
                M
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-2xs">
                N
              </div>
              <div className="w-7 h-7 rounded-full bg-purple-700 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-2xs">
                A
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Join thoughtful writers and curious readers.
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {isLoading ? (
          <div className="space-y-8">
            <div className="h-64 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          </div>
        ) : isError ? (
          <EmptyState
            title="Unable to load articles"
            description="There was an error communicating with the server. Please check your internet connection and try again."
            action={{ label: 'Explore Articles', onClick: () => navigate('/explore') }}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-10 h-10 text-indigo-500" />}
            title="No published articles yet"
            description="Be the very first author to publish a story on LumaPress!"
            action={{ label: 'Write First Post', onClick: () => navigate('/posts/create') }}
          />
        ) : (
          <>
            {/* Featured Article Section */}
            {featuredPost && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-700 fill-emerald-700" />
                    <span>Featured Article</span>
                  </h2>
                  <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                    Editor's Pick
                  </span>
                </div>
                <PostCard post={featuredPost} featured={true} />
              </section>
            )}

            {/* Latest Published Articles Grid */}
            {latestPosts.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Latest Publications</h2>
                  <Link
                    to="/explore"
                    className="text-sm font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
                  >
                    <span>View All Articles</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA Banner */}
        <section className="relative rounded-3xl bg-[#0d5435] text-white p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
              Ready to Share Your Perspective with the World?
            </h2>
            <p className="text-emerald-100/90 text-base leading-relaxed">
              Join our growing community of authors and engineers. Create drafts, publish rich markdown articles, and engage with reader comments.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/posts/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0d5435] font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-colors shadow-md"
              >
                <span>Start Writing Now</span>
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-300/40 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                <span>Browse Library</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
