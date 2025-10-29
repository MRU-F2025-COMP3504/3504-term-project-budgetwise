import StatementsPage from "../../FrontEnd/pages/StatementsPage";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${baseUrl}/api/statements`, { cache: 'no-store' });
  const data = res.ok ? await res.json() : { Transactions: [] };
  return <StatementsPage statements={data?.Transactions ?? []} />;
}
