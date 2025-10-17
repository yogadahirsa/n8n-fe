'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { fetchGemini } from '@/app/lib/data';
import { StateBot } from '@/app/lib/definition';

export default function Chatbot(){
  const initialState: StateBot = { message: null, status: '' };
  const [state, formAction, pending] = useActionState(fetchGemini, initialState);

  return(
    <>
      <p>
        Chatbot
      </p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/">Back</Link>
        </li>
      </ul>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <form action={formAction}>
          <h3 className="font-bold mb-2">Pertanyaan:</h3>
          <div className="flex flex-col gap-3">
            <textarea 
              id="message"
              name="message"
              className="border border-1 border-gray-300 w-100 h-30 p-2 rounded w-full"
              placeholder="Please ask Gemini!"
            ></textarea>
            <button className="border border-1 p-5 w-fit rounded cursor-pointer hover:bg-green-200 self-end">Send</button>
          </div>
        </form>
        <div>
          <div>
            <h3 className="font-bold mb-2">Jawaban</h3>
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
      </div>
    </>
  )
}
