import { fetchGDrive } from '@/app/lib/data';
import GDriveTable from '@/app/ui/gdrive-table';
import { GDriveFile } from '@/app/lib/definition';

export default async function GdrivePage() {
  const response = await fetchGDrive();
  const files: GDriveFile[] = response.status === 'ok' && response.data ? response.data : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Google Drive Files</h1>
      {files.length > 0 ? (
        <GDriveTable data={files} />
      ) : (
        <p>No files found or failed to load files.</p>
      )}
    </div>
  )
}
