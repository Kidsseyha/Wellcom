/**
 * Google Drive REST API Services
 * Handles listing, uploading, downloading, exporting and deleting files in Google Drive.
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

/**
 * Fetch files list from Google Drive
 */
export async function fetchDriveFiles(
  accessToken: string,
  query?: string,
  pageSize = 30
): Promise<DriveFile[]> {
  try {
    let url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,createdTime,size)&orderBy=createdTime desc`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Google Drive API error (${res.status})`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    throw error;
  }
}

/**
 * Upload a File or Blob to Google Drive using multipart upload
 */
export async function uploadFileToDrive(
  accessToken: string,
  file: File | Blob,
  fileName: string,
  mimeType = 'application/json'
): Promise<DriveFile> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,thumbnailLink,webContentLink,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to upload to Google Drive (${res.status})`);
  }

  return await res.json();
}

/**
 * Export Wedding Event JSON Backup directly to Google Drive
 */
export async function exportEventBackupToDrive(
  accessToken: string,
  eventData: any
): Promise<DriveFile> {
  const jsonString = JSON.stringify(eventData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const fileName = `Wedding_Invitation_Backup_${eventData.id || 'event'}_${new Date().toISOString().slice(0, 10)}.json`;

  return await uploadFileToDrive(accessToken, blob, fileName, 'application/json');
}

/**
 * Export RSVPs / Wishes to CSV on Google Drive
 */
export async function exportRSVPToDriveCSV(
  accessToken: string,
  eventName: string,
  rsvps: any[]
): Promise<DriveFile> {
  const headers = ['Guest Name', 'Attending', 'Guests Count', 'Wishes / Message', 'Submitted At'];
  const rows = rsvps.map((r: any) => [
    `"${(r.name || 'Guest').replace(/"/g, '""')}"`,
    `"${r.attending ? 'Yes' : 'No'}"`,
    `"${r.guestsCount || 1}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${r.createdAt || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const fileName = `RSVP_Guests_List_${eventName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;

  return await uploadFileToDrive(accessToken, blob, fileName, 'text/csv');
}

/**
 * Delete a file from Google Drive (Requires explicit confirmation)
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string,
  fileName: string
): Promise<boolean> {
  const confirmed = window.confirm(
    `តើអ្នកប្រាកដជាចង់លុបឯកសារ "${fileName}" ចេញពី Google Drive របស់អ្នកមែនទេ? (Are you sure you want to delete "${fileName}" from Google Drive? This action cannot be undone.)`
  );

  if (!confirmed) return false;

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to delete file from Google Drive (${res.status})`);
  }

  return true;
}
