import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for local development if needed, though Vercel handles this usually
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, customer } = req.body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    if (!customer || !customer.name || !customer.email || !customer.document) {
      return res.status(400).json({ error: 'Missing customer information' });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    const externalId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      external_id: externalId,
      total_amount: selectedPlan.price,
      payment_method: "PIX",
      webhook_url: "https://japinha-pijamas.vercel.app/api/webhook", // Placeholder valid URL
      ip: (req.headers['x-forwarded-for'] as string) || '127.0.0.1',
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

    const data = await response.json();

    if (!response.ok) {
      console.error('Genesys API Error:', data);
      return res.status(response.status).json({ error: 'Payment creation failed', details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Internal Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
