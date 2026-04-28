import { redirect } from "next/navigation";

export default async function TenantPage({ params }) {
  const { dashboard } = await params;

  // If someone visits /Prabhu, send them to their admin dashboard
  redirect(`/${dashboard}/admin`);
}
