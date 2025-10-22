import { GDriveFile } from '@/app/lib/definition';

export default function GDriveTable({data}: {data: GDriveFile[]}) {
  return(
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>No.</th>
            <th>File Name</th>
            <th>File ID</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: GDriveFile, idx: number) => (
            <tr key={idx} className="h-full odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
              <td>{idx+1}</td>
              <td>{item.name}</td>
              <td>{item.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
};