const { createClient } = require('@supabase/supabase-js');
const { error } = require('../utils/response');
const prisma = require('../config/db');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

const authMiddleware = async (req, res, next) => {
  try {
    console.log('[AUTH DEBUG] Incoming request:', req.method, req.originalUrl);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.warn('[AUTH DEBUG] Authorization header missing');
      return error(res, 'Authorization token is missing', 401);
    }

    console.log('[AUTH DEBUG] Raw header exists');

    if (!authHeader.startsWith('Bearer ')) {
      console.warn('[AUTH DEBUG] Invalid header format:', authHeader.slice(0, 30));
      return error(res, 'Invalid authorization format', 401);
    }

    const token = authHeader.split(' ')[1];

    console.log('[AUTH DEBUG] Token received:', token?.slice(0, 20) + '...');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error(
        '[AUTH DEBUG] Supabase verification failed:',
        authError?.message || 'User not found'
      );
      console.error('[AUTH DEBUG] Env check:', {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      });
      return error(res, 'Invalid or expired session', 401);
    }

    console.log('[AUTH DEBUG] Verified user:', user.email);

    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
      },
    });

    req.user = {
      id: user.id,
      email: user.email,
      ...user.user_metadata,
    };

    next();
  } catch (err) {
    console.error('[AUTH DEBUG] Critical exception:', err.message);
    return error(res, 'Internal Authentication Sync Error', 401);
  }
};

module.exports = authMiddleware;
