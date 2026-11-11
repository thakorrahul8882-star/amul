import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// WhatsApp notification endpoint
app.post('/api/send-whatsapp', async (req, res) => {
  try {
    const { recipientPhone, message } = req.body;
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const targetPhone = (recipientPhone || '8849526589').replace(/\D/g, '');
    const fullPhone = targetPhone.startsWith('91') ? targetPhone : `91${targetPhone}`;

    if (token && phoneId) {
      const metaRes = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: fullPhone,
          type: 'text',
          text: { body: message },
        }),
      });

      const metaData = await metaRes.json();
      return res.json({ success: metaRes.ok, channel: 'cloud_api', metaData });
    }

    return res.json({
      success: true,
      channel: 'fallback_ready',
      message: 'WhatsApp notification logged for shopkeeper (8849526589)',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return res.status(500).json({ success: false, error: errorMsg });
  }
});

// Serve frontend build in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Amul Parlour Khodana server listening on port ${port}`);
});
