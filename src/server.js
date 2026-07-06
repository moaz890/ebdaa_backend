const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./lib/db');
const leadsRoutes = require('./routes/leads');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically reflect the incoming origin to guarantee CORS validation succeeds on all domains (including custom Vercel domains)
    callback(null, origin || '*');
  },
  credentials: true,
}));
app.use(express.json());

// Ensure MongoDB is connected before handling API requests (required on Vercel serverless)
app.use('/api', async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB]', err.message);
    res.status(500).json({ success: false, message: 'خطأ في الاتصال بقاعدة البيانات' });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/leads', leadsRoutes);
app.use('/api/auth', authRoutes);

// ─── Health check & Welcome ───────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Ebdaa Telecom API is running' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Connect to MongoDB + Start server ────────────────────────────────────────
// Only start Express listener if running locally (not in serverless production)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
