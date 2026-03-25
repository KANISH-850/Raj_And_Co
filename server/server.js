require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/projects', require('./routes/projectRoutes'));
app.use('/api/v1/workers', require('./routes/workerRoutes'));
app.use('/api/v1/expenses', require('./routes/expenseRoutes'));
app.use('/api/v1/tenders', require('./routes/tenderRoutes'));
app.use('/api/v1/accounts', require('./routes/accountRoutes'));
app.use('/api/v1/salary', require('./routes/salaryRoutes'));
app.use('/api/v1/contractors', require('./routes/contractorRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
