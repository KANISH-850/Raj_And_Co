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

const app = express();

/**
 * Standard Middleware
 */
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────
// Accepts requests from local dev AND any deployed frontend.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined entries

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server calls (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limit specifically to auth routes
app.use('/api/auth', limiter);

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/workers', workersRoutes); // Also handles /:id stand-alone
app.use('/api/expenses', expensesRoutes); // Also handles /:id stand-alone
app.use('/api/tenders', tendersRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/dashboard', dashboardRoutes);

/**
 * Root Route — Prevents 'Cannot GET /' errors
 */
app.get('/', (req, res) => {
  res.status(200).json({
    project: '🏗️ Raj & Co Management System',
    status: 'Backend is running',
    version: '1.0.0',
    docs: '/health',
  });
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

/**
 * 404 — Catch-All for Unknown Routes
 */
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

module.exports = app;
