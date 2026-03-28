const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./modules/auth/auth.routes');
const projectsRoutes = require('./modules/projects/projects.routes');
const workersRoutes = require('./modules/workers/workers.routes');
const expensesRoutes = require('./modules/expenses/expenses.routes');
const tendersRoutes = require('./modules/tenders/tenders.routes');
const salaryRoutes = require('./modules/salary/salary.routes');
const contractorsRoutes = require('./modules/contractors/contractors.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const searchRoutes = require('./modules/search/search.routes');
const documentsRoutes = require('./modules/documents/documents.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

/**
 * Standard Middleware
 */
app.use(helmet());

// ─── CORS (DEEP DEBUG MODE) ──────────────────────────────────
// Allows ANY origin temporarily to identify the "Network Error"
// Once working, reset this to process.env.FRONTEND_URL
// ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: true, // true = allow any origin that makes the request
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});

app.use('/api/auth', limiter);

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/tenders', tendersRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/admin', adminRoutes);

/**
 * Root Route & Health Check
 */
app.get('/', (req, res) => {
  res.status(200).json({
    project: '🏗️ Raj & Co Management System',
    status: 'Backend is running (CORS Debug Mode Active)',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', origin: req.headers.origin });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

module.exports = app;
