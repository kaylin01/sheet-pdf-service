import express from 'express';
import { google } from 'googleapis';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/exportPdf', async (req, res) => {
  const { sheetId } = req.body;
  if (!sheetId) return res.status(400).send('sheetId missing');

  // service-account creds are injected at runtime by Cloud Run
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const client = await auth.getClient();

  const exportUrl = `https://www.googleapis.com/drive/v3/files/${sheetId}/export?mimeType=application/pdf`;
  const resp = await fetch(exportUrl, {
    headers: { Authorization: `Bearer ${await client.getAccessToken()}` },
  });
  const buffer = await resp.arrayBuffer();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${sheetId}.pdf"`
  });
  res.send(Buffer.from(buffer));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`PDF service listening on ${port}`));
