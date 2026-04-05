import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scrapeDevfolio } from '@/lib/scrapers/devfolio';
import { scrapeUnstop } from '@/lib/scrapers/unstop';
import { scrapeDevpost } from '@/lib/scrapers/devpost';
import { normalizeHackathon } from '@/lib/normalize';
import { sendTelegramAlert } from '@/lib/notifier';

export async function GET() {
  try {
    const rawDevfolio = await scrapeDevfolio();
    const rawUnstop = await scrapeUnstop();
    const rawDevpost = await scrapeDevpost();

    const allRaw = [...rawDevfolio, ...rawUnstop, ...rawDevpost];
    let addedCount = 0;

    for (const raw of allRaw) {
      const normalized = normalizeHackathon(raw);

      // Check if it already exists
      const existing = await prisma.hackathon.findUnique({
        where: { id: normalized.id },
      });

      if (!existing) {
        await prisma.hackathon.create({
          data: normalized,
        });
        addedCount++;

        // Alert if high score
        if (normalized.score >= 50) {
          const formattedTags = normalized.tags ? JSON.parse(normalized.tags).join(', ') : '';
          const msg = `🔥 <b>New High-Value Hackathon!</b>\n\n<b>Title:</b> <a href="${normalized.link}">${normalized.title}</a>\n<b>Platform:</b> ${normalized.platform}\n<b>Company:</b> ${normalized.company || 'N/A'}\n<b>Prize:</b> ${normalized.prize || 'N/A'}\n<b>Tags:</b> ${formattedTags}\n<b>Location:</b> ${normalized.location || 'Online'}\n<b>Score:</b> ${normalized.score}`;
          await sendTelegramAlert(msg);
        }
      } else {
         // Update existing if needed (e.g. score changes, prize updates)
         await prisma.hackathon.update({
             where: { id: normalized.id },
             data: {
                 score: normalized.score,
                 prize: normalized.prize,
                 scrapedAt: new Date()
             }
         });
      }
    }

    return NextResponse.json({ success: true, message: `Scraped successfully. Added ${addedCount} new entries.` }, { status: 200 });

  } catch (error: any) {
    console.error('API Scrape Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
