import { ReportClient } from './client'

// Generate static params for common report IDs
export async function generateStaticParams() {
  // This could be dynamically generated from your API
  // For example: const reports = await fetchMostViewedReports();

  return [
    { id: "latest" },
    { id: "today-1" },
    { id: "today-2" },
    { id: "yesterday-1" }
  ];
}

// Server component that renders the client component
export default async function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  // Await params before accessing its properties
  const { id } = await params;
  
  // We'll move the data fetching to the client component to avoid server-side toast errors
  return <ReportClient reportId={id} />;
}
