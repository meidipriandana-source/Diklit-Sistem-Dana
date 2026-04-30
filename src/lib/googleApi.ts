
/**
 * Utility to interact with Google Apps Script Web App for
 * saving data to Google Sheets and files to Google Drive.
 */

// This URL should be your deployed Google Apps Script Web App URL
const meta: any = import.meta;
const GOOGLE_SCRIPT_URL = meta.env?.VITE_GOOGLE_SCRIPT_URL || '';

export interface GoogleUploadResult {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

/**
 * Uploads certificate/employee data and an optional file to Google
 */
export async function uploadDataToGoogle(
  type: 'certificate' | 'employee',
  payload: any,
  file?: File | null
): Promise<GoogleUploadResult> {
  if (!GOOGLE_SCRIPT_URL) {
    console.error('VITE_GOOGLE_SCRIPT_URL is not defined in .env');
    return { status: 'error', message: 'Konfigurasi Google API belum lengkap.' };
  }

  try {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('data', JSON.stringify(payload));
    
    if (file) {
      // Small files can be base64 encoded for the script if it handles it that way,
      // or sent via standard multipart if the script is set up for it.
      // Most GAS implementations expect base64 for file uploads via Web App.
      const base64 = await fileToBase64(file);
      formData.append('file', base64);
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      // Note: GAS does not support CORS preflight easily, so sometimes 
      // simple mode or specific headers are needed.
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading to Google:', error);
    return { status: 'error', message: 'Gagal terhubung ke Google Service.' };
  }
}

/**
 * Fetches data from Google Sheets
 */
export async function fetchDataFromGoogle(
  type: 'certificates' | 'employees'
): Promise<any[]> {
  if (!GOOGLE_SCRIPT_URL) return [];

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=${type}`);
    const result = await response.json();
    if (result.status === 'success') {
      return result.data || [];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${type} from Google:`, error);
    return [];
  }
}

/**
 * Helper to convert file to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the prefix (e.g., "data:application/pdf;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}
