import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <p>Welcome to n8n Front End, please use our features!</p>
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
        <li>
          <Link className="text-blue-500 hover:underline" href="/dashboard">Dashboard</Link> 
        </li>
      </ul>
    </div>
  );
}
