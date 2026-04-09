import axios from 'axios';
import { HackathonData } from '../types';

export const scrapeDevfolio = async (): Promise<HackathonData[]> => {
  try {
    console.log('[Devfolio] Starting live scrape...');
    
    // Devfolio internal API - fetching first page (highest relevance/date)
    const response = await axios.get('https://api.devfolio.co/api/hackathons', {
      params: { page: 1 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      }
    });

    const items = response.data?.result || [];

    // Limit to top 20 latest/relevant as requested
    const limitedItems = items.slice(0, 20);

    const mappedData: HackathonData[] = limitedItems.map((item: any) => ({
      title: item.name,
      platform: 'Devfolio',
      company: item.owner?.name || undefined,
      deadline: item.ends_at ? new Date(item.ends_at) : undefined,
      startDate: item.starts_at ? new Date(item.starts_at) : undefined,
      link: `https://devfolio.co/hackathons/${item.slug}`,
      tags: item.tagline ? [item.tagline.substring(0, 20)] : [], // Tagline used as tag
      prize: "View on Devfolio", // Prize is usually inside nested objects or individual pages
      location: item.is_online ? 'Online' : (item.location || 'India'),
      source: 'devfolio-api'
    }));

    // Sorting by start date as a secondary sort
    mappedData.sort((a, b) => {
      const dateA = a.startDate?.getTime() || 0;
      const dateB = b.startDate?.getTime() || 0;
      return dateA - dateB;
    });

    console.log(`[Devfolio] Scraped ${mappedData.length} live events successfully.`);
    return mappedData;
  } catch (error: any) {
    console.error('Error scraping Devfolio:', error.message);
    return [];
  }
};
