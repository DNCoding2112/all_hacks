import axios from 'axios';
import { HackathonData } from '../types';

const DEVPOST_API = 'https://devpost.com/api/hackathons';
const MAX_PAGES = 3;

/**
 * Parses a date string from Devpost's "submission_period_dates" field.
 * Expected formats: "Mar 01 - Apr 30, 2025" or "Apr 30, 2025"
 * Returns { startDate, deadline }
 */
const parseDates = (dateStr: string | undefined): { startDate?: Date; deadline?: Date } => {
  if (!dateStr) return {};
  try {
    // "Mar 01 - Apr 30, 2025" or "April 1 - April 30, 2025"
    const rangeMatch = dateStr.match(/(.+?)\s*-\s*(.+)/);
    if (rangeMatch) {
      const currentYear = new Date().getFullYear();
      let startRaw = rangeMatch[1].trim();
      let endRaw = rangeMatch[2].trim();

      // End part usually has the year, start part may not
      const yearMatch = endRaw.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : String(currentYear);

      // Append year to start if not present
      if (!startRaw.match(/\d{4}/)) {
        startRaw = `${startRaw}, ${year}`;
      }

      const startDate = new Date(startRaw);
      const deadline = new Date(endRaw);

      return {
        startDate: isNaN(startDate.getTime()) ? undefined : startDate,
        deadline: isNaN(deadline.getTime()) ? undefined : deadline,
      };
    }

    // Single date
    const single = new Date(dateStr);
    if (!isNaN(single.getTime())) {
      return { deadline: single };
    }
  } catch {
    // ignore parse errors
  }
  return {};
};

/**
 * Fetches a set of pages from the Devpost API with given query params.
 */
const fetchPages = async (params: Record<string, string>): Promise<HackathonData[]> => {
  const results: HackathonData[] = [];
  const seenIds = new Set<number>();

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const response = await axios.get(DEVPOST_API, {
        params: { ...params, page },
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; AllHacksIndia/1.0)',
        },
      });

      const data = response.data;
      if (!data?.hackathons?.length) break;

      for (const item of data.hackathons) {
        if (seenIds.has(item.id)) continue;
        seenIds.add(item.id);

        const tags: string[] = item.themes ? item.themes.map((t: any) => t.name) : [];

        // Strip HTML from prize string
        let cleanPrize = item.prize_amount;
        if (typeof cleanPrize === 'string') {
          cleanPrize = cleanPrize.replace(/<[^>]+>/gi, '').trim();
        }

        const { startDate, deadline } = parseDates(item.submission_period_dates);

        results.push({
          title: item.title,
          platform: 'Devpost',
          company: item.organization_name || undefined,
          link: item.url,
          tags,
          prize: cleanPrize || undefined,
          location: item.displayed_location?.location || 'Online',
          source: 'devpost-api',
          startDate,
          deadline,
        });
      }

      // If we got fewer results than expected, no more pages
      const perPage = data.meta?.per_page || 24;
      if (data.hackathons.length < perPage) break;

    } catch (error) {
      console.error(`[Devpost] Error fetching page ${page} (params: ${JSON.stringify(params)}):`, error);
      break;
    }
  }

  return results;
};

export const scrapeDevpost = async (): Promise<HackathonData[]> => {
  console.log('[Devpost] Starting enhanced scrape...');

  // Fetch upcoming & open hackathons (global)
  const [upcomingResults, indiaResults] = await Promise.all([
    fetchPages({ 'status[]': 'upcoming', 'status[]_2': 'open', sort_by: 'Submission+deadline' }),
    fetchPages({ search: 'India', 'status[]': 'upcoming', sort_by: 'Recently+added' }),
  ]);

  // Merge and deduplicate by URL
  const seen = new Set<string>();
  const merged: HackathonData[] = [];

  for (const item of [...upcomingResults, ...indiaResults]) {
    if (!seen.has(item.link)) {
      seen.add(item.link);
      merged.push(item);
    }
  }

  console.log(`[Devpost] Scraped ${merged.length} unique hackathons (${upcomingResults.length} upcoming, ${indiaResults.length} India-specific).`);
  return merged;
};
