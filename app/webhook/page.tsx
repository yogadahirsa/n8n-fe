import Link from 'next/link';

export default function Webhook() {
  return(
    <>
      <p>
        Webhook
      </p>
      <ul className="list-disc pl-5">
        <li>
          <Link className="text-blue-500 hover:underline" href="/">Back</Link>
        </li>
      </ul>
    </>
  )
}
