import { prisma } from '@/lib/db';
import Dashboard from '@/components/Dashboard';
import LetterGlitch from '@/components/LetterGlitch';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const hackathons = await prisma.hackathon.findMany({
    orderBy: { score: 'desc' },
  });

  return (
    <div className="relative min-h-screen text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Dynamic Glitch Background */}
      <div className="fixed inset-0 -z-10">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
        />
      </div>

      <Dashboard initialHackathons={hackathons} />

    </div>
  );
}
