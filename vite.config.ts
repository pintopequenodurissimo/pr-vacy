import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

const API_KEY = 'sk_0ace15494f1655edc74cbad738b3e5c5d7804fff7d05aefcaadbce68d8230b52a733fd8527e378d951e87dc0f57b7df532ac51704f5e2962f9a49ca5de234797';
const API_URL = 'https://api.genesys.finance/v1/transactions';

const PLANS = {
  monthly: {
    price: 29.90,
    title: 'Acesso Mensal',
    description: 'Acesso por 1 mês ao conteúdo exclusivo'
  },
  quarterly: {
    price: 69.90,
    title: 'Acesso Trimestral',
    description: 'Acesso por 3 meses ao conteúdo exclusivo'
  },
  annual: {
    price: 149.90,
    title: 'Acesso Anual',
    description: 'Acesso por 1 ano ao conteúdo exclusivo'
  }
};

type PlanKey = keyof typeof PLANS;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Permite qualquer host (não bloqueia URLs diferentes, túneis etc.)
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // Normaliza a URL para verificar se é a rota desejada
        const url = req.url || '';
        
        // Verifica se é a rota de pagamento (exata ou com query params)
        if (!url.startsWith('/api/privacy/checkout/payment')) {
          next();
          return;
        }

        // Configuração de CORS para resolver problemas de acesso
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Tratamento de preflight request (OPTIONS)
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        
        try {
          // Se o corpo estiver vazio, tenta ler o req.body se já tiver sido parseado por outro middleware (embora improvável no Vite default)
          let body;
          if (!data || data.trim() === "") {
             // Em alguns casos o body pode estar vazio se o content-length for 0 ou se o cliente não mandou nada.
          } else {
            body = JSON.parse(data);
          }
          
          if (!body) {
             console.error('[Vite Middleware] Error: Could not parse body or body is empty.');
             res.statusCode = 400;
             res.end(JSON.stringify({ error: 'Empty or invalid request body' }));
             return;
          }

          const { plan, customer } = body;

          if (!plan || !PLANS[plan as PlanKey]) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid plan selected' }));
            return;
          }

          if (!customer || !customer.name || !customer.email || !customer.document) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing customer information' }));
            return;
          }

          const selectedPlan = PLANS[plan as PlanKey];
          const externalId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Logic from server.js for IP extraction
          const remoteIp = req.socket.remoteAddress || '127.0.0.1';
          const ip = remoteIp === '::1' || remoteIp === '127.0.0.1' ? '127.0.0.1' : remoteIp;

          const payload = {
            external_id: externalId,
            total_amount: selectedPlan.price,
            payment_method: "PIX",
            webhook_url: "https://japinha-pijamas.vercel.app/api/webhook", // Placeholder valid URL
            ip: ip,
            items: [
              {
                id: plan,
                title: selectedPlan.title,
                description: selectedPlan.description,
                price: selectedPlan.price,
                quantity: 1,
                is_physical: false
              }
            ],
            customer: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone || '11999999999',
              document_type: customer.document.length > 11 ? 'CNPJ' : 'CPF',
              document: customer.document.replace(/\D/g, '')
            }
          };

          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'api-secret': API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const responseText = await response.text();
          
          let responseData;
          try {
            responseData = responseText ? JSON.parse(responseText) : {};
          } catch (e) {
             console.error('Failed to parse Genesys response:', e);
             responseData = { error: 'Invalid response from gateway', raw: responseText };
          }

          if (!response.ok) {
            console.error('Genesys Error:', response.status, responseData);
            res.statusCode = response.status;
            res.end(JSON.stringify({ error: 'Payment creation failed', details: responseData }));
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(responseData));

        } catch (error) {
          console.error('API Middleware Error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal server error', message: String(error) }));
        }
      });
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
