'use client';
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Hackathon } from '@prisma/client';
import { Calendar, MapPin, Trophy, ExternalLink, Building, Search, Flame, LayoutGrid, Globe, Shield } from 'lucide-react';
import ScrapeButton from './ScrapeButton';

export default function Dashboard({ initialHackathons }: { initialHackathons: Hackathon[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [mediumFilter, setMediumFilter] = useState('All');

  const fuse = useMemo(() => new Fuse(initialHackathons, {
    keys: ['title', 'company', 'tags', 'platform', 'location'],
    threshold: 0.4,
  }), [initialHackathons]);

  const filteredHackathons = useMemo(() => {
    let result = initialHackathons;

    if (searchQuery.trim() !== '') {
      result = fuse.search(searchQuery).map(res => res.item);
    }

    if (activeFilter === 'AI') {
      result = result.filter(h => h.tags?.toLowerCase().includes('ai') || h.tags?.toLowerCase().includes('machine') || h.tags?.toLowerCase().includes('llm'));
    } else if (activeFilter === 'Web3') {
      result = result.filter(h => h.tags?.toLowerCase().includes('web3') || h.tags?.toLowerCase().includes('blockchain') || h.tags?.toLowerCase().includes('crypto'));
    } else if (activeFilter === 'High Prize') {
      result = result.filter(h => h.score >= 30);
    }

    if (sourceFilter !== 'All') {
      result = result.filter(h => h.platform.toLowerCase() === sourceFilter.toLowerCase());
    }

    if (mediumFilter === 'Online') {
      result = result.filter(h => h.location?.toLowerCase().includes('online') || h.location?.toLowerCase().includes('virtual') || h.location?.toLowerCase().includes('global'));
    } else if (mediumFilter === 'Offline') {
      result = result.filter(h => h.location && !h.location.toLowerCase().includes('online') && !h.location.toLowerCase().includes('virtual') && !h.location.toLowerCase().includes('global'));
    }

    if (!searchQuery) {
      result = [...result].sort((a, b) => b.score - a.score);
    }

    return result;
  }, [initialHackathons, searchQuery, activeFilter, sourceFilter, mediumFilter, fuse]);

  const filters = ['All', 'AI', 'Web3', 'High Prize'];
  const sources = ['All', ...Array.from(new Set(initialHackathons.map(h => h.platform)))];
  const mediums = ['All', 'Online', 'Offline'];

  const popularThreshold = useMemo(() => {
    if (initialHackathons.length === 0) return 0;
    const scores = initialHackathons.map(h => h.score).sort((a, b) => b - a);
    const index = Math.floor(scores.length * 0.15);
    return scores[index] || 50;
  }, [initialHackathons]);

  const resetFilters = () => {
    setActiveFilter('All');
    setSourceFilter('All');
    setMediumFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10 w-full font-space selection:bg-indigo-500/30">
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-6xl md:text-7xl font-bebas tracking-tight text-white leading-tight text-border">
            ALLHACKS <span className="text-indigo-500">INDIA</span>
          </h1>
          <p className="text-white mt-2 text-lg font-medium max-w-xl leading-relaxed text-soft-shadow font-space">
            The ultimate directory for elite Indian hackathons and builder events.
          </p>
        </div>
        <ScrapeButton />
      </header>

      {/* Control Bar - Sharper Blur */}
      <div className="flex flex-col gap-5 mb-10 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-[10px] shadow-2xl">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, tech stacks, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl py-3 pl-12 pr-6 focus:outline-none focus:bg-white/10 transition-all font-medium text-sm outline-none"
          />
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400/80 mb-2 block flex items-center gap-2">
              <LayoutGrid className="w-2.5 h-2.5" /> Categories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 bg-white/5 hover:bg-white/10'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/80 mb-2 block flex items-center gap-2">
              <Shield className="w-2.5 h-2.5" /> Source
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sources.map(s => (
                <button
                  key={s}
                  onClick={() => setSourceFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${sourceFilter === s ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 bg-white/5 hover:bg-white/10'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/80 mb-2 block flex items-center gap-2">
              <Globe className="w-2.5 h-2.5" /> Medium
            </label>
            <div className="flex flex-wrap gap-1.5">
              {mediums.map(m => (
                <button
                  key={m}
                  onClick={() => setMediumFilter(m)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${mediumFilter === m ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 bg-white/5 hover:bg-white/10'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(activeFilter !== 'All' || sourceFilter !== 'All' || mediumFilter !== 'All' || searchQuery !== '') && (
          <button
            onClick={resetFilters}
            className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors w-fit underline underline-offset-4"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredHackathons.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-[10px]">
          <h3 className="text-xl font-bebas text-white mb-2 tracking-wide">NO EVENTS FOUND</h3>
          <button onClick={resetFilters} className="text-indigo-400 text-xs font-bold underline">RESET ALL</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredHackathons.map((h) => {
            const tags = h.tags ? JSON.parse(h.tags) : [];
            return (
              <div key={h.id} className="glass-card p-5 flex flex-col h-full group relative">
                {/* Subtle Internal Layer */}
                <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[5px] -z-10" />

                {h.score >= popularThreshold && (
                  <div className="absolute top-0 right-0 py-1.5 px-4 bg-orange-600/90 text-white text-[8px] font-bebas tracking-[0.2em] rounded-bl-xl z-20">
                    <Flame className="w-2.5 h-2.5 inline mr-1 fill-white" /> POPULAR
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bebas text-white text-xs shadow-md">
                    {h.platform.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none truncate">
                      {h.platform}
                    </span>
                  </div>
                  <div className="ml-auto px-1.5 py-0.5 rounded bg-white/10 font-mono text-[9px] font-bold text-slate-300">
                    {h.score}
                  </div>
                </div>

                <h2 className="text-lg font-bebas text-white mb-3 leading-tight group-hover:text-indigo-400 transition-colors tracking-wide text-glow">
                  {h.title}
                </h2>

                <div className="space-y-3 mb-6 flex-grow text-[11px]">
                  {h.prize && (
                    <div className="flex items-center gap-3 py-1.5 border-b border-white/10">
                      <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-emerald-300 font-bold truncate">{h.prize}</p>
                    </div>
                  )}
                  {h.location && (
                    <div className="flex items-center gap-3 py-1.5 border-b border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-slate-200 font-medium truncate">{h.location}</p>
                    </div>
                  )}
                  {h.deadline && (
                    <div className="flex items-center gap-3 py-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-slate-200 font-medium">{new Date(h.deadline).toLocaleDateString('en-GB')}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-6 h-10 overflow-hidden">
                  {tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[8px] font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full bg-white text-slate-950 hover:bg-indigo-600 hover:text-white transition-all duration-300 py-2.5 rounded-xl font-bebas text-sm leading-none tracking-widest"
                >
                  JOIN NOW <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
