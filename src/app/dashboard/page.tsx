import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('@/components/DashboardClient'), {
  loading: () => <p className="text-center py-8">Loading dashboard...</p>,
});

export default function DashboardPage() {
  return <DashboardClient />;
}