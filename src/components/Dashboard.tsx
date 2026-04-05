'use client';
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Hackathon } from '@prisma/client';
import { Calendar, MapPin, Trophy, ExternalLink, Zap, Building, Search, Flame } from 'lucide-react';
import ScrapeButton from './ScrapeButton';

export default function Dashboard({ initialHackathons }: { initialHackathons: Hackathon[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

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

    if (!searchQuery) {
      result = [...result].sort((a, b) => b.score - a.score);
    }

    return result;
  }, [initialHackathons, searchQuery, activeFilter, fuse]);

  const filters = ['All', 'AI', 'Web3', 'High Prize'];

  // Calculate the popular threshold (e.g., top 15% of hackathons)
  const popularThreshold = useMemo(() => {
    if (initialHackathons.length === 0) return 0;
    const scores = initialHackathons.map(h => h.score).sort((a, b) => b - a);
    const index = Math.floor(scores.length * 0.15);
    return scores[index] || 50;
  }, [initialHackathons]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10 w-full font-sans">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            ALLHACKS <span className="text-indigo-500">INDIA</span>
          </h1>
          <p className="text-slate-200/80 mt-4 text-xl font-medium max-w-xl leading-relaxed">
            Discover the most prestigious hackathons, builders' mixers, and tech events across the subcontinent.
          </p>
        </div>

        <ScrapeButton />
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between p-2 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input
            type="text"
            placeholder="Search events, tech stacks, or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 text-white placeholder:text-slate-500 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:bg-white/10 transition-all font-semibold outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 p-1 overflow-x-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeFilter === filter
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredHackathons.length === 0 ? (
        <div className="text-center py-32 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="inline-flex p-6 rounded-full bg-slate-900/50 mb-6 border border-white/5">
            <Search className="w-12 h-12 text-slate-700" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No matching events found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or searching for different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHackathons.map((h) => {
            const tags = h.tags ? JSON.parse(h.tags) : [];
            return (
              <div
                key={h.id}
                className="glass-card p-8 flex flex-col h-full group relative"
              >
                {/* Internal Blur Layer for extra depth */}
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[10px] -z-10" />

                {h.score >= popularThreshold && (
                  <div className="absolute top-0 right-0 py-2 px-6 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-2xl flex items-center gap-2 z-20">
                    <Flame className="w-3 h-3 fill-white" /> Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-indigo-500/20">
                    {h.platform.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                      Platform
                    </span>
                    <span className="text-slate-200 text-sm font-bold">{h.platform}</span>
                  </div>
                  <div className="ml-auto px-2 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] font-bold text-slate-400">
                    S:{h.score}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 leading-[1.2] group-hover:text-indigo-400 transition-colors">
                  {h.title}
                </h2>

                {h.company && (
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400 mb-6 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    {h.company}
                  </div>
                )}

                <div className="space-y-4 mb-8 flex-grow">
                  {h.prize && (
                    <div className="flex items-center gap-4 py-3 border-b border-white/5">
                      <Trophy className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prize Pool</p>
                        <p className="text-emerald-400 font-bold">{h.prize}</p>
                      </div>
                    </div>
                  )}
                  {h.location && (
                    <div className="flex items-center gap-4 py-3 border-b border-white/5">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</p>
                        <p className="text-slate-300 font-bold">{h.location}</p>
                      </div>
                    </div>
                  )}
                  {h.deadline && (
                    <div className="flex items-center gap-4 py-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deadline</p>
                        <p className="text-slate-300 font-bold">{new Date(h.deadline).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.slice(0, 4).map((tag: string) => (
                    <span key={tag} className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-3 w-full bg-white text-slate-950 hover:bg-indigo-500 hover:text-white transition-all duration-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  Join Hackathon
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
