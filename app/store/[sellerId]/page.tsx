import { redirect } from "next/navigation";

export default async function StorePage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  redirect(`/profile/${sellerId}`);
}
