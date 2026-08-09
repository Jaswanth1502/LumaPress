import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Sparkles, ArrowRight } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center">
          {/* Tagline */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#064e3b]">
            Why LumaPress Exists
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-[#064e3b] leading-[1.05] max-w-3xl">
            Good ideas deserve <br />
            <span className="italic text-[#65a30d] font-serif font-normal">room to breathe.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-lg sm:text-xl font-normal max-w-2xl leading-relaxed pt-2">
            We built LumaPress as a quieter alternative to feeds designed for speed — a place where writers can think in paragraphs and readers can stay awhile.
          </p>
        </div>
      </section>

      {/* 3 Core Principles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 01 */}
          <div className="border-t border-emerald-200/80 pt-6 space-y-3">
            <span className="text-xs font-semibold text-slate-400">01</span>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Depth over velocity
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Stories should not have to compete with a stopwatch. We design for careful reading and ideas that unfold at their natural pace.
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="border-t border-emerald-200/80 pt-6 space-y-3">
            <span className="text-xs font-semibold text-slate-400">02</span>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              People over metrics
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A writer is more than a number. Meaningful responses and genuine authorship matter more than vanity counters.
            </p>
          </div>

          {/* Pillar 03 */}
          <div className="border-t border-emerald-200/80 pt-6 space-y-3">
            <span className="text-xs font-semibold text-slate-400">03</span>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Clarity over clutter
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every part of LumaPress protects the relationship between a reader and the words in front of them.
            </p>
          </div>
        </div>
      </section>

      {/* Dark Emerald Call To Action Section */}
      <section className="bg-[#0d5435] text-white py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center">
          <Sparkles className="w-7 h-7 text-emerald-300 fill-emerald-300" />
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Bring the idea you cannot <br />
            stop thinking about.
          </h2>
          <Link
            to="/posts/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#0d5435] font-bold text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer hover:scale-105"
          >
            <span>Start your first story →</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
