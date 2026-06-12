import { createClient } from "@/lib/supabase-server";

// ─── Wallet helpers ───────────────────────────────────────────────────────────

export async function getOrCreateWallet(userId: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("wallets")
    .insert({ user_id: userId, balance_ttd: 0 })
    .select()
    .single();

  return created;
}

export async function getWalletBalance(userId: string): Promise<number> {
  const wallet = await getOrCreateWallet(userId);
  return wallet?.balance_ttd ?? 0;
}

export async function getWalletTransactions(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function creditWallet(
  userId: string,
  amountTTD: number,
  description: string,
  referenceId?: string
) {
  const supabase = await createClient();

  await supabase.from("wallet_transactions").insert({
    user_id: userId,
    type: "topup",
    amount_ttd: amountTTD,
    description,
    reference_id: referenceId,
  });

  await supabase.rpc("increment_wallet_balance", {
    p_user_id: userId,
    p_amount: amountTTD,
  });
}

// ─── Subscription helpers ─────────────────────────────────────────────────────

export async function getActiveSubscriptions(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("*, listings(title)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function cancelSubscription(subscriptionId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", subscriptionId)
    .eq("user_id", userId);
  return !error;
}

// ─── Payment log ──────────────────────────────────────────────────────────────

export async function logPayment({
  userId,
  provider,
  amountTTD,
  status,
  referenceId,
  metadata,
}: {
  userId: string;
  provider: "wipay" | "stripe";
  amountTTD: number;
  status: "pending" | "success" | "failed";
  referenceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .insert({
      user_id: userId,
      provider,
      amount_ttd: amountTTD,
      status,
      reference_id: referenceId,
      metadata,
    })
    .select()
    .single();
  return data;
}
