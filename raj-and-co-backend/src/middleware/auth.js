const { createClient } = require('@supabase/supabase-js');
const { error } = require('../utils/response');
const prisma = require('../config/db');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

const authMiddleware = async (req, res, next) => {
  try {
    console.log('[AUTH] Incoming request:', req.method, req.originalUrl);
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.warn('[AUTH] ❌ Authorization header missing');
      return error(res, 'Authorization token is missing', 401);
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.warn('[AUTH] ❌ Invalid header format');
      return error(res, 'Invalid authorization format', 401);
    }

    const token = authHeader.split(' ')[1];
    console.log('[AUTH] Token received, length:', token?.length);

    // ─── Supabase getUser with 10s timeout protection ────────────
    let userData;
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase auth timed out after 10s')), 10000)
      );
      const userPromise = supabase.auth.getUser(token);
      userData = await Promise.race([userPromise, timeoutPromise]);
    } catch (timeoutErr) {
      console.error('[AUTH] ⏱️ Supabase getUser timed out:', timeoutErr.message);
      return error(res, 'Authentication service timed out. Please try again.', 503);
    }
    // ─────────────────────────────────────────────────────────────

    const { data, error: authError } = userData;

    if (authError || !data?.user) {
      console.error('[AUTH] ❌ Supabase verification failed:', authError?.message || 'User not found');
      console.error('[AUTH] SUPABASE_URL configured:', !!process.env.SUPABASE_URL);
      console.error('[AUTH] SUPABASE_ANON_KEY configured:', !!process.env.SUPABASE_ANON_KEY);
      return error(res, 'Invalid or expired session', 401);
    }

    const user = data.user;
    console.log('[AUTH] ✅ User verified:', user.email);

    const userCount = await prisma.user.count();

    // Sync with local DB
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        role: userCount === 0 ? 'admin' : 'user',
        isApproved: userCount === 0
      },
    });

    // Block unapproved users except on /api/auth/me
    if (!dbUser.isApproved && !req.originalUrl.includes('/api/auth/me')) {
      console.warn('[AUTH] 🚫 Blocking unapproved user:', dbUser.email);
      return error(res, 'Account pending administrator approval. Please wait for a few hours.', 403);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: dbUser.role,
      isApproved: dbUser.isApproved,
      ...user.user_metadata,
    };

    next();
  } catch (err) {
    console.error('[AUTH] 💥 Critical sync error:', err.message);
    return error(res, 'Internal Authentication Sync Error', 500);
  }
};

module.exports = authMiddleware;
