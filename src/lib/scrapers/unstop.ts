import axios from 'axios';
import { HackathonData } from '../types';

export const scrapeUnstop = async (): Promise<HackathonData[]> => {
  try {
    console.log('[Unstop] Starting scrape...');
    
    // We mock the generic structure Unstop gives via their internal APIs
    const mockData: HackathonData[] = [
      {
        title: "Reliance Tech Challenge",
        platform: "Unstop",
        company: "Reliance",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        startDate: new Date(),
        link: "https://unstop.com/reliance-tech",
        tags: ["Retail", "Cloud"],
        prize: "₹3,00,000",
        location: "Mumbai, India",
        source: "unstop-api"
      },
      {
        title: "Flipkart GRiD",
        platform: "Unstop",
        company: "Flipkart",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        startDate: new Date(),
        link: "https://unstop.com/flipkart-grid",
        tags: ["E-commerce", "AI", "Mobile"],
        prize: "₹5,50,000",
        location: "Bengaluru, India",
        source: "unstop-api"
      }
    ];

    console.log(`[Unstop] Scraped ${mockData.length} mock events successfully.`);
    return mockData;
  } catch (error) {
    console.error('Error scraping Unstop:', error);
    return [];
  }
};
