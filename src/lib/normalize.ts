import crypto from 'crypto';
import { HackathonData } from './types';
import { calculateScore } from './scoring';

export const generateId = (title: string, platform: string): string => {
  const normalizedTitle = title.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const normalizedPlatform = platform.toLowerCase().trim();
  return crypto.createHash('sha256').update(`${normalizedTitle}-${normalizedPlatform}`).digest('hex');
};

export const normalizeHackathon = (raw: HackathonData) => {
  const id = generateId(raw.title, raw.platform);
  const score = calculateScore(raw);

  return {
    id,
    title: raw.title.trim(),
    platform: raw.platform.trim(),
    company: raw.company?.trim() || null,
    deadline: raw.deadline || null,
    startDate: raw.startDate || null,
    link: raw.link,
    tags: JSON.stringify(raw.tags || []), // Stored as JSON string directly
    prize: raw.prize?.trim() || null,
    location: raw.location?.trim() || null,
    source: raw.source.trim(),
    score
  };
};
