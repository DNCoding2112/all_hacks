import { HackathonData } from './types'

export const calculateScore = (data: HackathonData): number => {
  let score = 0;
  
  if (data.company && data.company.trim().length > 0) {
    score += 50;
  }
  
  const combinedTags = data.tags.join(' ').toLowerCase();
  
  if (combinedTags.includes('ai') || combinedTags.includes('machine learning') || combinedTags.includes('llm') || combinedTags.includes('gpt')) {
    score += 20;
  }
  if (combinedTags.includes('web3') || combinedTags.includes('crypto') || combinedTags.includes('blockchain')) {
    score += 15;
  }

  if (data.prize) {
    // Attempt to extract digits. 
    // Usually prizes in India might be in INR, so "1,00,000" -> 100000
    const rawPrize = data.prize.replace(/\D/g, '');
    if (rawPrize) {
      const prizeAmt = parseInt(rawPrize, 10);
      if (prizeAmt >= 100000) {
        score += 30;
      } else if (prizeAmt >= 50000) {
        score += 15;
      }
    }
  }

  if (data.location?.toLowerCase().includes('global') || data.location?.toLowerCase().includes('online') || data.location?.toLowerCase().includes('virtual')) {
    score += 10;
  }
  
  return score;
}
