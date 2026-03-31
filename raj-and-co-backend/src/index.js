require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// ─── Startup Environment Validation ──────────────────────────────
console.log('🔍 [STARTUP] ENV CHECK:');
console.log('   SUPABASE_URL     :', process.env.SUPABASE_URL || '❌ MISSING');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? `✅ Loaded (${process.env.SUPABASE_ANON_KEY.length} chars)` : '❌ MISSING');
console.log('   DATABASE_URL     :', process.env.DATABASE_URL ? '✅ Loaded' : '❌ MISSING');
console.log('   NODE_ENV         :', process.env.NODE_ENV || 'development');
// ────────────────────────────────────────────────────────────────

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 [RAJ & CO BACKEND] Server running on port ${PORT}`);
      console.log(`🟢 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
