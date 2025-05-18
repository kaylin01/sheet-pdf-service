import express from 'express';
import { google } from 'googleapis';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.get('/downloadPdf', async (req, res) => {
  const { sheetId, filename } = req.query;
  if (!sheetId) return res.status(400).send('Missing sheetId');

  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const exportUrl = `https://www.googleapis.com/drive/v3/files/${sheetId}/export?mimeType=application/pdf`;
  const fileResp = await fetch(exportUrl, {
    headers: {
      Authorization: `Bearer ${token.token || token}`,
    }
  });

  if (!fileResp.ok) {
    const errText = await fileResp.text();
    return res.status(fileResp.status).send(`Error fetching PDF: ${errText}`);
  }

  const buffer = await fileResp.arrayBuffer();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${filename || 'Sheet'}.pdf"`
  });

  res.send(Buffer.from(buffer));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`PDF service listening on ${port}`));
