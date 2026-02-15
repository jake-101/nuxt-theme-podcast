# Podcast API Endpoints

Server-side API routes for fetching and caching podcast RSS feed data.

## Endpoints

### `GET /api/podcast`

Returns the parsed podcast feed from the configured RSS URL with caching.

**Response:** `PodcastFeed` object
```typescript
{
  podcast: Podcast,      // Show metadata
  episodes: Episode[]    // Array of episodes
}
```

**Status Codes:**
- `200` - Success
- `500` - Feed URL not configured or invalid
- `502` - Feed unavailable or invalid format
- `504` - Feed request timeout

**Caching:** 
- Results cached for 1 hour (3600 seconds)
- Cache key based on feed URL
- Cache persists between requests in both dev and production

**Example:**
```bash
curl http://localhost:3000/api/podcast
```

### `POST /api/podcast/refresh`

Clears the cached feed and fetches fresh data. Useful for webhooks or cron jobs.

**Response:** `PodcastFeed` object (fresh data)

**Status Codes:** Same as `GET /api/podcast`

**Behavior:**
1. Clears cache for the configured feed URL
2. Fetches fresh data from RSS source
3. Returns and caches the fresh data

**Example:**
```bash
curl -X POST http://localhost:3000/api/podcast/refresh
```

## Implementation Details

### Feed Cache (`server/utils/feed-cache.ts`)

- Uses Nitro's `defineCachedFunction` for automatic caching
- Cache TTL: 1 hour (3600 seconds)
- Cache key generation: Base64-encoded feed URL
- Provides `clearFeedCache(feedUrl)` to invalidate specific feed
- Provides `clearAllFeedCaches()` to clear all cached feeds

**Cache Storage:**
- Development: In-memory storage
- Production: Persistent storage (filesystem, redis, etc. depending on Nitro preset)

### Error Handling

Both endpoints provide comprehensive error handling:

**Configuration Errors (500):**
- Feed URL not configured in `app.config.ts`
- Invalid feed URL format (must be HTTP/HTTPS)

**Fetch Errors (502):**
- RSS feed server unavailable
- Invalid XML format
- Parse errors

**Timeout Errors (504):**
- Feed request timeout

**Generic Errors (500):**
- Unexpected errors logged to console
- Safe error messages returned to client

### Configuration

Feed URL is read from `app.config.ts`:

```typescript
export default defineAppConfig({
  podcast: {
    feedUrl: 'https://feed.syntax.fm/',
    // ... other config
  }
})
```

## Testing

### Manual Testing

1. Start the dev server:
```bash
pnpm dev
```

2. Test GET endpoint:
```bash
curl http://localhost:3000/api/podcast | jq '.podcast.title'
```

3. Test cache refresh:
```bash
curl -X POST http://localhost:3000/api/podcast/refresh | jq '.episodes | length'
```

### Integration with Client

From Vue components, use `useFetch`:

```typescript
// app/composables/usePodcast.ts
export function usePodcast() {
  const { data, error, refresh } = useFetch('/api/podcast')
  
  return {
    podcast: computed(() => data.value?.podcast),
    episodes: computed(() => data.value?.episodes || []),
    error,
    refresh,
  }
}
```

## Future Enhancements

- [ ] Add webhook endpoint for RSS feed update notifications
- [ ] Add pagination support for large feeds (>1000 episodes)
- [ ] Add configurable cache TTL via app.config
- [ ] Add cache warming on deployment
- [ ] Add metrics/logging for cache hit/miss rates
