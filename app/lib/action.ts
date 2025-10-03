'use server';

import StateBot from '@/app/lib/definition';

export async function fetchGemini(
  prevState: StateBot,
  formData: FormData
): Promise<StateBot> {

const url = process.env.N8N_URL_CHAT;
console.log(url);

try {
  const message = String(formData.get("message") || "").trim();
  const sessionId = String(formData.get("sessionId") || "user_123").trim();

  const body = new FormData();
  body.append("message", message);
  body.append("sessionId", sessionId);

  const response = await fetch(url!, {
    method: "POST",
    body
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Safely handle empty responses
  const text = await response.text();
  if (!text) {
    throw new Error("Empty response from API");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { reply: text, status: "non-json" };
  }

  return { data, status: "ok" };
} catch (err) {
  console.error(err);
  return { data: null, status: "failed" };
}
}
