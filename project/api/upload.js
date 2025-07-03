import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1MAUJsUBS71CUntnSR2QQBsZHxv_tDhhf';

const serviceAccount = {
  type: process.env.GC_TYPE,
  project_id: process.env.GC_PROJECT_ID,
  private_key_id: process.env.GC_PRIVATE_KEY_ID,
  private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GC_CLIENT_EMAIL,
  client_id: process.env.GC_CLIENT_ID,
  auth_uri: process.env.GC_AUTH_URI,
  token_uri: process.env.GC_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GC_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GC_CLIENT_X509_CERT_URL,
};

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    const file = files.file;
    if (!file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    try {
      const fileMetadata = {
        name: file.originalFilename,
        parents: [FOLDER_ID],
      };
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      };
      const uploaded = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
      });
      fs.unlinkSync(file.filepath);
      res.status(200).json({ success: true, fileId: uploaded.data.id });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
