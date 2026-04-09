import axios from 'axios';
import { HackathonData } from '../types';

/**
 * TOGGLE THIS TO SWITCH BETWEEN MOCK AND REAL APIFY DATA
 * Set to true once you have a working Apify Actor URL/Token.
 */
const USE_REAL_APIFY = false; 

export const scrapeUnstop = async (): Promise<HackathonData[]> => {
  try {
    console.log(`[Unstop] Starting scrape (Mode: ${USE_REAL_APIFY ? 'REAL' : 'MOCK'})...`);

    if (USE_REAL_APIFY) {
      return await fetchFromApify();
    }

    // --- MOCK DATA (Default) ---
    const mockData: HackathonData[] = [
      {
        title: "Reliance Tech Challenge 2024",
        platform: "Unstop",
        company: "Reliance Industries",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startDate: new Date(),
        link: "https://unstop.com/o/reliance-tech",
        tags: ["Retail", "Cloud", "Big Data"],
        prize: "₹3,00,000 + Internship",
        location: "Mumbai, India",
        source: "unstop-mock"
      },
      {
        title: "Flipkart GRiD 6.0",
        platform: "Unstop",
        company: "Flipkart",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        startDate: new Date(),
        link: "https://unstop.com/o/flipkart-grid-6",
        tags: ["E-commerce", "AI", "Robotics"],
        prize: "₹5,50,000 + PPI",
        location: "Bengaluru, India",
        source: "unstop-mock"
      }
    ];

    console.log(`[Unstop] Returned ${mockData.length} mock events.`);
    return mockData;

  } catch (error: any) {
    console.error('Error in Unstop scraper:', error.message);
    return [];
  }
};

/**
 * PLUG & PLAY APIFY INTEGRATION
 * This function is fully ready to fetch from Apify.
 * Just set USE_REAL_APIFY = true above.
 */
async function fetchFromApify(): Promise<HackathonData[]> {
  const API_TOKEN = process.env.APIFY_API_TOKEN;
  
  if (!API_TOKEN) {
    console.error('[Unstop] Apify Token missing in .env! Falling back to empty.');
    return [];
  }

  // Using shashank-kumar/unstop-scraper or similar
  // Replace ACTOR_ID with your preferred Unstop scraper ID from Apify Store
  const ACTOR_ID = 'shashank-kumar/unstop-scraper'; 
  const RUN_URL = `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${API_TOKEN}`;

  try {
    // 1. Start the Actor
    console.log('[Unstop] Triggering Apify Actor...');
    const runResponse = await axios.post(RUN_URL, {
      maxItems: 20,
      searchKeyword: "hackathon",
      // Add other actor-specific inputs here
    });

    const datasetId = runResponse.data.data.defaultDatasetId;
    
    // 2. Wait a bit for results (Ideally you'd use a webhook or polling here)
    // For a simple implementation, we'll fetch the dataset directly after a short delay
    // Note: Complex scrapers might take 30-60s.
    console.log('[Unstop] Waiting for dataset...');
    await new Promise(r => setTimeout(r, 10000)); // 10s delay placeholder

    const DATASET_URL = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${API_TOKEN}`;
    const dataResponse = await axios.get(DATASET_URL);
    
    const items = dataResponse.data || [];
    console.log(`[Unstop] Fetched ${items.length} items from Apify.`);

    // 3. Map to our format
    const results = items.slice(0, 20).map((item: any) => ({
      title: item.title || item.name,
      platform: 'Unstop',
      company: item.organization_name || item.company_name || 'Unstop Opportunity',
      deadline: item.registration_deadline ? new Date(item.registration_deadline) : (item.deadline ? new Date(item.deadline) : undefined),
      startDate: new Date(),
      link: item.opportunity_url || item.url || 'https://unstop.com',
      tags: item.tags || ['Competition'],
      prize: item.prize_money_desc || item.prizes || 'Check on Unstop',
      location: item.location || 'Online',
      source: 'unstop-apify'
    }));

    // Secondary Sort
    results.sort((a, b) => (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0));

    return results;
  } catch (err: any) {
    console.error('[Unstop] Apify fetch failed:', err.message);
    return [];
  }
}
