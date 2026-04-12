const BASE = process.env.NEXT_PUBLIC_API_URL;
 
export async function getNews({ category, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (category) params.set("category", category);
  const res = await fetch(`${BASE}/news?${params}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}
 
export async function subscribe({ email, categories, frequency }) {
  const res = await fetch(`${BASE}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, categories, frequency }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Subscription failed");
  }
  return res.json();
}