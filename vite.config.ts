import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use('/api/send-whatsapp', (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const token = process.env.WHATSAPP_API_TOKEN;
                  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
                  const targetPhone = (parsed.recipientPhone || '8849526589').replace(/\D/g, '');
                  const fullPhone = targetPhone.startsWith('91') ? targetPhone : `91${targetPhone}`;

                  if (token && phoneId) {
                    try {
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
                          text: { body: parsed.message },
                        }),
                      });
                      const metaData = await metaRes.json();
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: metaRes.ok, channel: 'cloud_api', metaData }));
                      return;
                    } catch (fetchErr) {
                      console.warn('Meta API call failed, falling back:', fetchErr);
                    }
                  }

                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: true,
                      channel: 'fallback_ready',
                      message: 'WhatsApp notification prepared for shopkeeper (8849526589)',
                    })
                  );
                } catch (e: unknown) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  const errMsg = e instanceof Error ? e.message : 'Server error';
                  res.end(JSON.stringify({ success: false, error: errMsg }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
