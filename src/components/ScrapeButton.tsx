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
      className={`group flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Zap className={`w-4 h-4 text-indigo-400 transition-transform ${loading ? 'animate-pulse' : 'group-hover:scale-110'}`} />
      {loading ? 'Scraping...' : 'Trigger Scrape API'}
    </button>
  );
}
