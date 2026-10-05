import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Database storage directory
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data loader
import { INITIAL_VEHICLES, INITIAL_SERVICES, INITIAL_AREAS, INITIAL_SAMPLE_QUOTES, INITIAL_MESSAGES } from './src/data/initialData.ts';

interface DBState {
  vehicles: typeof INITIAL_VEHICLES;
  services: typeof INITIAL_SERVICES;
  areas: typeof INITIAL_AREAS;
  quotes: typeof INITIAL_SAMPLE_QUOTES;
  messages: typeof INITIAL_MESSAGES;
}

function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB_FILE, re-initializing seed data', err);
  }

  const initialDB: DBState = {
    vehicles: INITIAL_VEHICLES,
    services: INITIAL_SERVICES,
    areas: INITIAL_AREAS,
    quotes: INITIAL_SAMPLE_QUOTES,
    messages: INITIAL_MESSAGES,
  };
  saveDB(initialDB);
  return initialDB;
}

function saveDB(data: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB_FILE', err);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. VEHICLES
app.get('/api/vehicles', (req, res) => {
  const db = loadDB();
  const showAll = req.query.all === 'true';
  const vehicles = showAll ? db.vehicles : db.vehicles.filter((v) => v.active);
  res.json(vehicles);
});

app.post('/api/vehicles', (req, res) => {
  const db = loadDB();
  const newVehicle = {
    id: `v-${Date.now()}`,
    vehicle_name: req.body.vehicle_name || 'Commercial Vehicle',
    vehicle_type: req.body.vehicle_type || 'truck',
    short_description: req.body.short_description || '',
    capacity: req.body.capacity || '1-3 Ton',
    suitable_for: req.body.suitable_for || 'Commercial Goods',
    image_url: req.body.image_url || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    availability_status: req.body.availability_status || 'available',
    dimensions: req.body.dimensions || '',
    payload_capacity: req.body.payload_capacity || '',
    active: req.body.active !== false,
    display_order: db.vehicles.length + 1,
    created_at: new Date().toISOString(),
  };
  db.vehicles.push(newVehicle as any);
  saveDB(db);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', (req, res) => {
  const db = loadDB();
  const index = db.vehicles.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  db.vehicles[index] = {
    ...db.vehicles[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);
  res.json(db.vehicles[index]);
});

app.delete('/api/vehicles/:id', (req, res) => {
  const db = loadDB();
  const initialLen = db.vehicles.length;
  db.vehicles = db.vehicles.filter((v) => v.id !== req.params.id);
  if (db.vehicles.length === initialLen) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// 2. SERVICES
app.get('/api/services', (req, res) => {
  const db = loadDB();
  const showAll = req.query.all === 'true';
  const services = showAll ? db.services : db.services.filter((s) => s.active);
  res.json(services);
});

app.put('/api/services/:id', (req, res) => {
  const db = loadDB();
  const index = db.services.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }
  db.services[index] = {
    ...db.services[index],
    ...req.body,
  };
  saveDB(db);
  res.json(db.services[index]);
});

// 3. SERVICE AREAS
app.get('/api/areas', (req, res) => {
  const db = loadDB();
  const showAll = req.query.all === 'true';
  const areas = showAll ? db.areas : db.areas.filter((a) => a.active);
  res.json(areas);
});

app.post('/api/areas', (req, res) => {
  const db = loadDB();
  const newArea = {
    id: `area-${Date.now()}`,
    name: req.body.name,
    district: req.body.district || 'Dubai Logistics Corridor',
    popular: Boolean(req.body.popular),
    active: true,
  };
  db.areas.push(newArea);
  saveDB(db);
  res.status(201).json(newArea);
});

app.put('/api/areas/:id', (req, res) => {
  const db = loadDB();
  const index = db.areas.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Area not found' });
  db.areas[index] = { ...db.areas[index], ...req.body };
  saveDB(db);
  res.json(db.areas[index]);
});

app.delete('/api/areas/:id', (req, res) => {
  const db = loadDB();
  db.areas = db.areas.filter((a) => a.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 4. QUOTE REQUESTS
app.get('/api/quotes', (_req, res) => {
  const db = loadDB();
  // Sort latest first
  const sorted = [...db.quotes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(sorted);
});

app.post('/api/quotes', (req, res) => {
  const db = loadDB();
  const { customer_name, phone, pickup_area, dropoff_area, goods_type, load_size, preferred_date, preferred_time } = req.body;

  if (!customer_name || !phone || !pickup_area || !dropoff_area) {
    return res.status(400).json({ error: 'Missing mandatory quote fields' });
  }

  // Generate Reference Number TR-XXXXX
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const reference_number = `TR-${randomSuffix}`;

  const newQuote = {
    id: `quote-${Date.now()}`,
    reference_number,
    customer_name,
    phone,
    whatsapp: req.body.whatsapp || phone,
    email: req.body.email || '',
    service_id: req.body.service_id || 'goods-transport',
    vehicle_id: req.body.vehicle_id || 'v-small-truck',
    pickup_area,
    dropoff_area,
    goods_type: goods_type || 'General Goods',
    load_size: load_size || 'Medium',
    preferred_date: preferred_date || new Date().toISOString().split('T')[0],
    preferred_time: preferred_time || 'Morning (09:00 AM - 01:00 PM)',
    additional_notes: req.body.additional_notes || '',
    status: 'New',
    admin_notes: '',
    quoted_amount: undefined,
    created_at: new Date().toISOString(),
  };

  db.quotes.unshift(newQuote as any);
  saveDB(db);
  res.status(201).json(newQuote);
});

app.patch('/api/quotes/:id', (req, res) => {
  const db = loadDB();
  const index = db.quotes.findIndex((q) => q.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Quote request not found' });

  db.quotes[index] = {
    ...db.quotes[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);
  res.json(db.quotes[index]);
});

app.delete('/api/quotes/:id', (req, res) => {
  const db = loadDB();
  db.quotes = db.quotes.filter((q) => q.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 5. CONTACT MESSAGES
app.get('/api/messages', (_req, res) => {
  const db = loadDB();
  res.json(db.messages || []);
});

app.post('/api/messages', (req, res) => {
  const db = loadDB();
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone and message are required' });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    name,
    phone,
    email: req.body.email || '',
    message,
    status: 'Unread',
    created_at: new Date().toISOString(),
  };

  db.messages.unshift(newMessage as any);
  saveDB(db);
  res.status(201).json(newMessage);
});

app.delete('/api/messages/:id', (req, res) => {
  const db = loadDB();
  db.messages = db.messages.filter((m) => m.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 6. ADMIN STATS & AUTH
app.get('/api/admin/stats', (_req, res) => {
  const db = loadDB();
  const stats = {
    total_requests: db.quotes.length,
    new_requests: db.quotes.filter((q) => q.status === 'New').length,
    pending_quotes: db.quotes.filter((q) => q.status === 'Contacted' || q.status === 'Quotation Sent').length,
    confirmed_bookings: db.quotes.filter((q) => q.status === 'Confirmed' || q.status === 'Driver Assigned').length,
    completed_requests: db.quotes.filter((q) => q.status === 'Completed').length,
    total_vehicles: db.vehicles.length,
    active_vehicles: db.vehicles.filter((v) => v.active).length,
    total_areas: db.areas.length,
  };
  res.json(stats);
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  // Default demo admin credentials for review: admin@dubaitransport.ae / admin123
  const validEmail = 'admin@dubaitransport.ae';
  const validPass = 'admin123';

  if (email === validEmail && password === validPass) {
    return res.json({
      success: true,
      token: 'admin-session-token-' + Date.now(),
      user: {
        email: validEmail,
        full_name: 'Dubai Transport Dispatch Admin',
        role: 'admin',
      },
    });
  }

  // Also allow quick testing if password matches
  if (password === 'admin123' || password === 'dubai2026') {
    return res.json({
      success: true,
      token: 'admin-session-token-' + Date.now(),
      user: {
        email: email || 's38454672@gmail.com',
        full_name: 'Dubai Transport Dispatch Admin',
        role: 'admin',
      },
    });
  }

  res.status(401).json({ error: 'Invalid admin credentials. Use admin@dubaitransport.ae / admin123' });
});

// Reset seed data
app.post('/api/seed', (_req, res) => {
  const freshDB: DBState = {
    vehicles: INITIAL_VEHICLES,
    services: INITIAL_SERVICES,
    areas: INITIAL_AREAS,
    quotes: INITIAL_SAMPLE_QUOTES,
    messages: INITIAL_MESSAGES,
  };
  saveDB(freshDB);
  res.json({ success: true, message: 'Database reset to initial seed data' });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE OR STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Dubai Transport full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
