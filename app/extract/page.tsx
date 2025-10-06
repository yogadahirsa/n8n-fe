'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Extract() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendPdf() {
    setLoading(true);
    setError(null);
    setData([]);

    try {
      const res = await fetch("/api/send-pdf", { method: "POST" });
      console.log('test1: Fetch started');

      // 1. Check if the response was successful
      if (!res.ok) {
        // Attempt to parse the error body if available
        const errorResult = await res.json().catch(() => ({ message: `HTTP Error: ${res.status}` }));
        console.error("API call failed:", errorResult);
        setError(`API call failed: ${errorResult.message || JSON.stringify(errorResult)}`);
        setLoading(false);
        return;
      }

      // 2. Parse the JSON body from the Response object
      const result = await res.json();
      console.log('test2: JSON parsed');

      // Log the parsed data (which should contain 'success', 'message', 'data')
      console.log('Full API Response:', result);

      // 3. Set the state with the actual data array from the response body
      // Ensure 'result.data' is an array before setting the state
      if (Array.isArray(result.data)) {
        setData(result.data);
      } else {
        console.warn("API response 'data' is not an array:", result.data);
        setError("API returned data in an unexpected format.");
      }

    } catch (e) {
      console.error("Network or JSON parsing error:", e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p>Extract</p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/">Back</Link>
        </li>
      </ul>
      <button 
        className="border border-1 p-2 rounded cursor-pointer hover:bg-gray-200 disabled:opacity-50" 
        onClick={sendPdf}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send File'}
      </button>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      {/* Display Data */}
      {data && data.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">Extracted Data ({data.length} items):</h3>
          {data.map((item, idx) => (
            <div key={idx} className="border-b py-2 text-sm">
              <pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
      {data && data.length === 0 && !loading && !error && (
        <p className="mt-4 text-gray-500">No data loaded yet.</p>
      )}
    </>
  );
}
