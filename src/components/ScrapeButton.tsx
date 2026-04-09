'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scrape');
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert('Scraping failed: ' + data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while scraping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleScrape}
      disabled={loading}
      className={`group flex items-center gap-3 bg-indigo-600/40 hover:bg-indigo-600/30 border-2 border-indigo-500/30 text-white px-8 py-3 rounded-2xl transition-all shadow-[0_0_25px_rgba(99,102,241,0.2)] hover:shadow-[0_0_35px_rgba(99,102,241,0.3)] font-bebas tracking-wider text-xl backdrop-blur-[4px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Zap className={`w-5 h-5 text-indigo-300 transition-transform ${loading ? 'animate-pulse' : 'group-hover:scale-110'}`} />
      {loading ? 'SCRAPING...' : 'TRIGGER SCRAPE API'}
    </button>
  );
}
