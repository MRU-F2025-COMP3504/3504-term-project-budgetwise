# BudgetWise API Service Layer

Single source of truth for all backend API calls in BudgetWise.

## Features

✅ **Single source of truth** - All API routes defined in one place  
✅ **Consistent error handling** - Unified try/catch across the app  
✅ **Smart caching** - GET requests cached for 30 seconds to prevent loading flashes  
✅ **Auto cache invalidation** - Mutations automatically clear related caches  
✅ **Easy to modify** - Change endpoint or add auth headers in one location  
✅ **Type-safe ready** - Can add TypeScript types/JSDoc later  
✅ **Testable** - Mock the entire API layer for unit tests

## Usage

```javascript
import api from "../services/api";

// Login
const { data } = await api.auth.login(email, password);

// Get user profile (cached for 30s)
const { data } = await api.profile.get();

// Upload statement (invalidates transactions & statements cache)
const formData = new FormData();
formData.append("file", file);
await api.statements.upload(formData);

// Get transactions (cached for 30s)
const { data } = await api.transactions.list();

// AI chat
const { data } = await api.ai.chat(message, context);
```

## Caching Behavior

### Automatic Caching

- **GET requests** are automatically cached for 30 seconds
- Navigating between pages shows cached data instantly (no loading flash)
- Cache automatically refreshes after 30 seconds
- **Persists across page refreshes** using localStorage

### Cache Persistence

The cache survives:

- ✅ Navigating between pages
- ✅ Page refreshes (F5)
- ✅ Browser back/forward buttons
- ✅ Closing and reopening tabs (until cache expires)

Cache expires:

- ⏱️ After 30 seconds of being stored
- 🔄 When related mutations occur (upload, update, delete)

### Auto Cache Invalidation

- **POST/PATCH/DELETE** operations automatically invalidate related caches:
  - Uploading statements → clears statements + transactions cache
  - Updating transactions → clears transactions cache
  - Updating profile → clears profile cache

### Manual Cache Control

```javascript
// Clear all cached data
api.cache.clear();

// Clear specific cache pattern
api.cache.invalidate("transactions");
api.cache.invalidate("/api/user_profile");
```

## API Structure

### `api.auth`

- `login(email, password)` - Authenticate user
- `register(name, email, password)` - Create new account

### `api.profile`

- `get()` - Fetch user profile
- `upsert(profileData)` - Create or update profile

### `api.statements`

- `upload(formData)` - Upload bank statement CSV
- `list()` - Get all user statements
- `delete(statementId)` - Remove statement

### `api.transactions`

- `list()` - Get all user transactions
- `update(transactionId, updates)` - Modify transaction
- `delete(transactionId)` - Remove transaction

### `api.ai`

- `chat(message, context)` - Send message to AI assistant
- `getInsights()` - Get spending insights

### `api.quiz`

- `submit(answers)` - Submit quiz responses

## Error Handling

All API methods throw errors with:

- `message`: Human-readable error description
- `status`: HTTP status code (if available)
- `data`: Raw error response from server

```javascript
try {
  await api.auth.login(email, password);
} catch (err) {
  console.error(err.message); // "Invalid credentials"
  console.error(err.status); // 401
}
```

## Benefits

✅ **Single source of truth** - All API routes defined in one place  
✅ **Consistent error handling** - Unified try/catch across the app  
✅ **Easy to modify** - Change endpoint or add auth headers in one location  
✅ **Type-safe ready** - Can add TypeScript types/JSDoc later  
✅ **Testable** - Mock the entire API layer for unit tests

## Future Enhancements

- Add TypeScript types for request/response shapes
- Implement request caching/deduplication
- Add retry logic for failed requests
- Support request cancellation (AbortController)
- Add request/response interceptors for logging
- Implement optimistic updates for mutations
