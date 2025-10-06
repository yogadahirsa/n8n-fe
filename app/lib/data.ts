'use server';

import { StateBot } from '@/app/lib/definition';

export async function fetchGemini(
  prevState: StateBot,
  formData: FormData
): Promise<StateBot> {

  const url = process.env.N8N_URL_CHAT || '';

  try {
    const message = String(formData.get("message") || "").trim();
    const sessionId = String(formData.get("sessionId") || "user_123").trim();

    const body = new FormData();
    body.append("message", message);
    body.append("sessionId", sessionId);

    const response = await fetch(url, {
      method: "POST",
      body
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const text = await response.json();
    if (!text) {
      throw new Error("Empty response from API");
    }

    return { message: text[0]?.output, status: "ok" };
  } catch (err) {
    console.error(err);
    return { message: null, status: "failed" };
  }
}
