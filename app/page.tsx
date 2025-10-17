import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <p>N8N Feature</p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/webhook">Webhook</Link> 
        </li>
        <li>
          <Link className="text-blue-500 hover:underline" href="/chatbot">Chatbot</Link> 
        </li>
        <li>
          <Link className="text-blue-500 hover:underline" href="/extract">Ekstrak PDF</Link> 
        </li>
      </ul>

      <p>Dashboard Feature</p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/dashboard">Dashboard</Link> 
        </li>
      </ul>

      <p>API to Flask Python Feature</p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/rag">RAG</Link> 
        </li>
      </ul>
    </div>
  );
}
