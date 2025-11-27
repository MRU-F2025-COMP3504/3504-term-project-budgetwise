/**
 * Centralized API client for BudgetWise backend
 * Single source of truth for all fetch calls to /api routes
 * Includes caching layer to prevent flash of loading states
 */

// ============================================================================
// Cache layer for API responses with localStorage persistence
// ============================================================================

const CACHE_KEY = 'budgetwise_api_cache';
const CACHE_DURATION = 30000; // 30 seconds default

// Load cache from localStorage on initialization
function loadCacheFromStorage() {
  if (typeof window === 'undefined') return new Map(); // SSR safety
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch (err) {
    console.warn('Failed to load cache from localStorage:', err);
  }
  return new Map();
}

// Save cache to localStorage
function saveCacheToStorage(cache) {
  if (typeof window === 'undefined') return; // SSR safety
  try {
    const obj = Object.fromEntries(cache.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch (err) {
    console.warn('Failed to save cache to localStorage:', err);
  }
}

const cache = loadCacheFromStorage();

function getCacheKey(url, options = {}, userId) {
  // Create unique key from URL, method, and user context
  const method = options.method || 'GET';
  const userSegment = userId ? `:user:${userId}` : ':anon';
  return `${method}:${url}${userSegment}`;
}

function getCachedData(url, options = {}, userId) {
  const key = getCacheKey(url, options, userId);
  const cached = cache.get(key);
  
  if (!cached) return null;
  
  // Check if cache is still valid
  if (Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  // Cache expired, remove it
  cache.delete(key);
  saveCacheToStorage(cache);
  return null;
}

function setCachedData(url, options, data, userId) {
  const key = getCacheKey(url, options, userId);
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
  saveCacheToStorage(cache);
}

function invalidateCache(pattern) {
  // Invalidate all cache entries matching pattern
  if (!pattern) {
    cache.clear();
    saveCacheToStorage(cache);
    return;
  }
  
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
  saveCacheToStorage(cache);
}

// ============================================================================
// Core fetch wrapper with error handling and caching
// ============================================================================

async function request(url, options = {}) {
  // Determine session/user before attempting cache lookup so cache is user-specific
  let userId = null;
  try {
    const { createSupabaseBrowserClient } = await import('@/lib/helpers/supabaseBrowserClient');
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    userId = session?.user?.id || null;
  } catch (_) {
    // ignore if not available
  }

  const shouldCache = !options.method || options.method === 'GET';
  if (shouldCache) {
    const cachedData = getCachedData(url, options, userId);
    if (cachedData) return cachedData;
  }
  
  try {
    // Build headers
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    };

    // Cookies are automatically sent by the browser, no need for manual Authorization header

    const response = await fetch(url, {
      headers,
      credentials: 'include', // Ensure cookies are sent
      ...options,
    });

    // Handle non-JSON responses (file uploads return raw response)
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType?.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        // Empty response or parse error
        data = {};
      }
    }

    if (!response.ok) {
      const error = new Error(data?.error || data?.message || `Request failed: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    const result = { data, response };
    
    // Cache successful GET requests
    if (shouldCache) {
      setCachedData(url, options, result, userId);
    }
    
    // Invalidate related caches for mutating operations
    if (options.method === 'POST' || options.method === 'PATCH' || options.method === 'DELETE') {
      if (url.includes('/api/transactions')) {
        invalidateCache('/api/transactions');
      }
      if (url.includes('/api/statements')) {
        invalidateCache('/api/statements');
        invalidateCache('/api/transactions'); // Statements affect transactions
      }
      if (url.includes('/api/user_profile')) {
        invalidateCache('/api/user_profile');
      }
    }

    return result;
  } catch (err) {
    // Network errors, timeouts, etc
    if (!err.status) {
      err.message = err.message || 'Network error or server unavailable';
    }
    throw err;
  }
}

// ============================================================================
// Authentication endpoints
// ============================================================================

export const auth = {
  /**
   * Login user with email and password
   * @returns {Promise<{data: {session, user}}>}
   */
  async login(email, password) {
    return request('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register new user
   * @returns {Promise<{data: {session, user}}>}
   */
  async register(name, email, password) {
    return request('/api/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
};

// ============================================================================
// User Profile endpoints
// ============================================================================

export const profile = {
  /**
   * Get current user profile
   * @returns {Promise<{data: {profile}}>}
   */
  async get() {
    return request('/api/user_profile');
  },

  /**
   * Create or update user profile (quiz submission)
   * @returns {Promise<{data}>}
   */
  async upsert(profileData) {
    return request('/api/user_profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },
};

// ============================================================================
// Statements endpoints
// ============================================================================

export const statements = {
  /**
  * Upload a bank statement CSV file
   * @param {FormData} formData - File upload form data
  * @returns {Promise<{data: {statement}}>} Upload summary
   */
  async upload(formData) {
    // Don't set Content-Type for FormData - browser sets it with boundary
    return request('/api/statements', {
      method: 'POST',
      headers: {}, // Clear default JSON header
      body: formData,
    });
  },

  /**
   * Get all statements for current user
   * @returns {Promise<{data: {statements: Array}}>} Array of statement rows
   */
  async list() {
    return request('/api/statements');
  },

  /**
   * Delete a statement by ID
   * @returns {Promise<{data}>}
   */
  async delete(statementId) {
    return request(`/api/statements?id=${statementId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Transactions endpoints
// ============================================================================

export const transactions = {
  /**
   * Get all transactions for current user
   * @returns {Promise<{data: {transactions: Array}}>} Array of transaction rows
   */
  async list() {
    return request('/api/transactions');
  },

  /**
   * Update transaction category/details
   * @returns {Promise<{data}>}
   */
  async update(transactionId, updates) {
    return request('/api/transactions', {
      method: 'PATCH',
      body: JSON.stringify({ id: transactionId, ...updates }),
    });
  },

  /**
   * Delete a transaction
   * @returns {Promise<{data}>}
   */
  async delete(transactionId) {
    return request(`/api/transactions?id=${transactionId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// AI Assistant endpoints
// ============================================================================

export const ai = {
  /**
   * Send message to AI assistant
   * @returns {Promise<{data: {reply: string}}>}
   */
  async chat(message, context = {}) {
    return request('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  },

  /**
   * Get AI insights for user's spending
   * @returns {Promise<{data}>}
   */
  async getInsights() {
    return request('/api/ai/insights');
  },
};

// ============================================================================
// Quiz endpoints
// ============================================================================

export const quiz = {
  /**
   * Submit quiz answers to create/update profile
   * @returns {Promise<{data}>}
   */
  async submit(answers) {
    return request('/api/quiz', {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  },
};

// ============================================================================
// Export default API object with all services
// ============================================================================

const api = {
  auth,
  profile,
  statements,
  transactions,
  ai,
  quiz,
  
  // Cache utilities
  cache: {
    /**
     * Clear all cached data
     */
    clear: () => invalidateCache(),
    
    /**
     * Clear cached data for specific pattern
     * @param {string} pattern - URL pattern to match (e.g., 'transactions')
     */
    invalidate: (pattern) => invalidateCache(pattern),
  },
};

export default api;
