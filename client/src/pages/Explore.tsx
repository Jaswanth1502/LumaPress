import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPostsApi } from '../api/posts.api';
import { PostCard } from '../components/PostCard';
import { PostSkeleton } from '../components/PostSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { Search, ChevronDown, X } from 'lucide-react';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const selectedTag = searchParams.get('tag') || '';
  const sort = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(query);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['explore-posts', { query, selectedTag, sort, page }],
    queryFn: () =>
      getPostsApi({
        q: query,
        tag: selectedTag,
        sort,
        page,
        limit: 9,
      }),
  });

  const updateFilters = (newParams: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const topicPills = [
    'All',
    'Creativity',
    'Technology',
    'Mindful living',
    'Design',
    'Culture',
    'Ideas',
    'Travel',
  ];

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-12 pb-16">
      {/* Explore Hero Banner (Centered Emerald Design) */}
      <section className="bg-emerald-50/40 border-b border-emerald-100 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center">
          {/* Tagline Label */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#064e3b]">
            Explore LumaPress
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#064e3b] leading-[1.05]">
            Find an idea that <br className="hidden sm:inline" />
            <span className="italic text-[#65a30d] font-serif font-normal">moves you.</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 text-lg sm:text-xl font-normal max-w-xl leading-relaxed">
            Fresh perspectives, considered essays, and stories from curious minds.
          </p>

          {/* Integrated Search Input Pill */}
          <form onSubmit={handleSearchSubmit} className="pt-2 w-full max-w-xl">
            <div className="relative flex items-center bg-white rounded-full p-1.5 border border-emerald-200/80 shadow-md focus-within:ring-2 focus-within:ring-emerald-700 transition-all">
              <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search stories, writers, or ideas"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateFilters({ q: null });
                  }}
                  className="mr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Topic Filter Pills & Sort Dropdown Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          {/* Topic Pills */}
          <div className="flex items-center flex-wrap gap-2">
            {topicPills.map((topic) => {
              const isActive =
                topic === 'All'
                  ? !selectedTag
                  : selectedTag.toLowerCase() === topic.toLowerCase();
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      tag: topic === 'All' ? null : topic,
                    })
                  }
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0d5c3a] text-white shadow-xs'
                      : 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100/80 border border-emerald-200/50'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center self-start md:self-auto">
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Section Heading & Result Count */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Latest stories</h2>
          <span className="text-xs text-slate-500 font-medium">
            {posts.length} {posts.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : isError ? (
          <EmptyState
            title="Error loading stories"
            description="Could not connect to the server. Please try again."
            action={{ label: 'Retry', onClick: () => window.location.reload() }}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No stories found"
            description={
              query || selectedTag
                ? `No stories match "${query || selectedTag}". Try resetting your search filters.`
                : 'No stories have been published yet.'
            }
            action={
              query || selectedTag
                ? { label: 'Reset All Filters', onClick: clearAllFilters }
                : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="pt-8">
                <Pagination
                  meta={pagination}
                  onPageChange={(p) => updateFilters({ page: p.toString() })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
