import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ symbol?: string }>;
};

export default async function SnapshotPage({ searchParams }: Props) {
  const params = await searchParams;
  const symbol = params.symbol?.trim().toUpperCase();
  redirect(symbol ? `/dashboard/etf/${encodeURIComponent(symbol)}` : "/dashboard/etf");
}
