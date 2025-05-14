import { ReportClient } from './client'

// Server component that renders the client component
export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await params before accessing its properties
  const { id } = await params;

  // We'll move the data fetching to the client component to avoid server-side toast errors
  return <ReportClient reportId={id} />;
}
