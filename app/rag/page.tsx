'use client';

import { useActionState } from 'react';
import { StateBot } from '@/app/lib/definition';
import { fetchRAG } from '@/app/lib/data';
import Link from 'next/link';

export default function RagPage() {
  const initialState: StateBot = { message: null, status: '' };
  const [state, formAction, pending] = useActionState(fetchRAG, initialState);

  return (
    <>
      <p>RAG</p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/">Back</Link>
        </li>
      </ul>
      <div className="grid grid-cols-2 gap-5 mt-5">
        <form action={formAction}>
          <label className="font-bold" htmlFor="message">Pertanyaan:</label>
          <div className="flex flex-col gap-3">
            <textarea
              type="text"
              id="message"
              name="message"
              className="border border-1 border-gray-300 w-100 h-30 p-2 rounded w-full"
              required
              placeholder="Please ask RAG!"
              disabled={pending}
            ></textarea>
            <button type="submit" disabled={pending} className="border border-1 p-5 w-fit rounded cursor-pointer hover:bg-green-200 self-end">
              {pending ? 'Submitting...' : 'Ask'}
            </button>
          </div>
        </form>
        <div>
          <h3 className="font-bold" htmlFor="message">Jawaban:</h3>
          {pending ? (
            <div className="text-gray-400 italic">Loading...</div>
          ) : state?.message ? (
            <div className="whitespace-pre-line p-3 border rounded bg-gray-50">
              {state.message}
            </div>
          ) : (
            <p className="text-gray-400">No response yet</p>
          )}
        </div>
      </div>
      {state.status === 'failed' && (
        <p>Error: Failed to get response.</p>
      )}
    </>
  )
}
