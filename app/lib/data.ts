'use server';

import { StateBot, StateDrive } from '@/app/lib/definition';

export async function fetchRAG(
  prevState: StateBot,
  formData: FormData
): Promise<StateBot> {
  const url = process.env.FLASK_RAG_URL || '';

  try {
    const message = String(formData.get("message") || "").trim();
    const sessionId = String(formData.get("sessionId") || "user_123").trim();

    console.log('RAG Request:', { url, message, sessionId });

    const body = new FormData();
    body.append("message", message);
    body.append("sessionId", sessionId);

    const response = await fetch(url, {
      method: "POST",
      body,
    });

    console.log('RAG Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RAG Response error:', errorText);
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('RAG Response data:', data);
    if (!data || !data.message) {
      throw new Error("Invalid response from API");
    }

    return { message: data.message, status: "ok" };
  } catch (err) {
    console.error('RAG Error:', err);
    return { message: null, status: "failed" };
  }
}

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

export async function fetchGDrive(): Promise<StateDrive> {
  const url = process.env.N8N_URL_GDRIVE || '';

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Empty response from Google Drive API");
    }

    return { data: data, status: "ok" };
  } catch (err) {
    console.error(err);
    return { data: null, status: "failed" };
  }
}
