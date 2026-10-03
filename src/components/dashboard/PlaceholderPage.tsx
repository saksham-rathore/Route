import { requireAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { getProjectById } from '@/lib/core/db';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface PlaceholderPageProps {
  projectId: string;
  title: string;
  description?: string;
}

export async function PlaceholderPage({ 
  projectId, 
  title, 
  description = 'This feature is coming soon.' 
}: PlaceholderPageProps) {
  const user = await requireAuth();

  const project = await getProjectById(projectId, user.id);

  if (!project) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2">{title}</h1>
            <p className="text-[#666]">{description}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
