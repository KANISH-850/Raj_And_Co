const { createClient } = require('@supabase/supabase-js');
const { error } = require('../utils/response');

// 1. Initialize Supabase Admin for verification (uses ANON key or SERVICE key for more power)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

/**
 * JWT Authentication Middleware using Supabase Auth
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authorization token is missing', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Ask Supabase to verify this token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return error(res, 'Invalid or expired session', 401);
    }

    // 3. Attach Supabase user info to the request
    req.user = {
      id: user.id,
      email: user.email,
      ...user.user_metadata
    };
    
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return error(res, 'Internal Authentication Error', 401);
  }
};

module.exports = authMiddleware;
