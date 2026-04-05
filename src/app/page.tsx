import { prisma } from '@/lib/db';
import Dashboard from '@/components/Dashboard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const hackathons = await prisma.hackathon.findMany({
    orderBy: { score: 'desc' },
  });

  return (
    <div className="relative min-h-screen text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Background Layers */}
      <div className="fixed inset-0 bg-[#030712] -z-20" /> {/* Base Fallback Color */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80 -z-10"
        style={{ backgroundImage: "url('/bg-1.jpg')" }}
      />

      <Dashboard initialHackathons={hackathons} />

    </div>
  );
}
