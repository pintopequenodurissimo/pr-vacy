import express from 'express';
import cors from 'cors';
// Built-in fetch is available in Node 18+

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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

app.post('/api/privacy/checkout/payment', async (req, res) => {
  try {
    const { plan, customer } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    if (!customer || !customer.name || !customer.email || !customer.document) {
      return res.status(400).json({ error: 'Missing customer information' });
    }

    const selectedPlan = PLANS[plan];
    const externalId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      external_id: externalId,
      total_amount: selectedPlan.price,
      payment_method: "PIX",
      webhook_url: "https://japinha-pijamas.vercel.app/api/webhook", // Placeholder valid URL
      ip: req.ip === '::1' || req.ip === '127.0.0.1' ? '127.0.0.1' : (req.ip || '127.0.0.1'),
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

    console.log('Sending payload to Genesys:', JSON.stringify(payload, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'api-secret': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Genesys Response:', data);

    if (!response.ok) {
      console.error('Genesys API Error:', data);
      return res.status(response.status).json({ error: 'Payment creation failed', details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Internal Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
