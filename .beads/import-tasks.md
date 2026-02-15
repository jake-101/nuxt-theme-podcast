# Project Tasks

## Epic: Project Scaffolding

### Scaffold Nuxt layer project structure
- Initialize pnpm project with correct package.json (`main: nuxt.config.ts`, `type: module`)
- Create `nuxt.config.ts` with layer-appropriate config
- Create `app.config.ts` with typed podcast config schema and defaults
- Create playground directory with `nuxt.config.ts` that extends `..`
- Create playground `app.config.ts` with Syntax.fm test feed

### Install and configure dependencies
- Install `@knadh/oat`, `howler`, `fast-xml-parser`
- Install dev dependencies: `nuxt`, `typescript`, `@types/howler`
- Configure oat.css import in `nuxt.config.ts` (CSS file path with `fileURLToPath` for layer compatibility)
- Create `app/assets/css/overrides.css` with podcast-specific styles (grid layout, sticky player, hero)
- Import oat.js as a client-only plugin or via `app/plugins/`
- Verify oat.css dark mode works with `data-theme="dark"` on body

## Epic: TypeScript Interfaces

### Define podcast data types
- Create `types/podcast.ts` with `Podcast` interface (title, author, description, artwork, categories, feedUrl, type, etc.)
- Create `Episode` interface (title, slug, description, htmlContent, audioUrl, pubDate, duration, artwork, episodeNumber, seasonNumber, episodeType, guid, explicit, keywords, link)
- Create `PodcastFeed` interface combining show metadata + episode array
- Create `PlatformLinks` interface for subscribe button config
- Create `PodcastConfig` interface matching the app.config.ts schema
- Handle optional Podcasting 2.0 fields: transcript, chapters, persons, funding

## Epic: RSS Feed Parser

### Build server-side feed parser
- Create `server/utils/feed-parser.ts`
- Use `fast-xml-parser` to parse RSS XML into JS object
- Map channel-level tags to `Podcast` interface (itunes:author, itunes:image, itunes:category, itunes:type, description)
- Map item-level tags to `Episode` interface (title, enclosure, pubDate, itunes:duration, itunes:image, itunes:episodeType, itunes:season, itunes:episode, content:encoded, guid)
- Handle duration format variations: seconds (int) vs HH:MM:SS string
- Generate URL-safe slugs from episode titles (using `utils/slug.ts` logic server-side)
- Gracefully handle optional Podcasting 2.0 tags (podcast:transcript, podcast:chapters, podcast:person, podcast:funding, podcast:guid)
- Test parser against all 4 test feeds to verify correct extraction

## Epic: Server API Routes

### Create podcast data API with caching
- Create `server/utils/feed-cache.ts` using Nitro `cachedEventHandler` or storage-based caching with configurable TTL (default 1 hour)
- Create `server/api/podcast.get.ts` - fetches RSS feed URL from runtime config, parses with feed-parser, returns typed `PodcastFeed` JSON
- Create `server/api/podcast/refresh.post.ts` - clears the feed cache and triggers a re-fetch, returns fresh data
- Read feed URL from runtime config (populated from app.config.ts)
- Handle fetch errors gracefully (feed unavailable, invalid XML, timeout)

## Epic: Client Data Layer

### Build client-side composable for podcast data
- Create `app/composables/usePodcast.ts`
- Use `useFetch('/api/podcast')` to retrieve parsed feed data
- Expose reactive `podcast` (show metadata) and `episodes` (array) refs
- Provide helper to find episode by slug
- Support client-side filtering/search by title and description text
- Handle loading and error states

## Epic: UI Components

### Build PodcastHero component
- Show artwork image (large), podcast title, author, description
- Render subscribe buttons for each configured platform
- Use oat.css semantic elements (headings, paragraphs, buttons)
- Responsive layout: artwork beside text on desktop, stacked on mobile

### Build SubscribeButton component
- Accept platform name and URL as props
- Render appropriate icon/label per platform (Spotify, Apple, YouTube, Pocket Casts, Overcast, RSS)
- Use oat.css button styling with `role="button"` semantic approach
- Open links in new tab with `rel="noopener"`

### Build EpisodeCard component
- Show episode artwork (or fallback to show artwork), title, date, duration, episode type badge
- Truncated description preview
- Episode type badge (full/bonus/trailer) with visual differentiation
- "In progress" indicator if user has listening history for this episode (from localStorage)
- Click navigates to episode detail page
- Play button that loads episode into persistent audio player
- Use oat.css card component styling

### Build EpisodeSearch component
- Text input that filters episodes by title and description
- Debounced input to avoid excessive re-renders
- Show result count
- Clear button to reset search
- Use oat.css form element styling

### Build EpisodeGrid component
- Responsive CSS grid of EpisodeCard components
- Client-side pagination (configurable episodes per page from app.config)
- Previous/Next page navigation
- Integrates with EpisodeSearch filtering

### Build PodcastFooter component
- Simple footer with podcast title, RSS link, and "Powered by nuxt-podcast-theme" attribution
- Use oat.css semantic footer styling

## Epic: Audio Player

### Build useAudioPlayer composable
- Wrap Howler.js in a Vue composable
- Expose reactive state: `currentEpisode`, `isPlaying`, `currentTime`, `duration`, `volume`, `playbackRate`, `isLoading`
- Methods: `play(episode)`, `pause()`, `toggle()`, `seek(seconds)`, `skipForward(15)`, `skipBackward(15)`, `setSpeed(rate)`, `setVolume(level)`
- Speed presets: 1x, 1.25x, 1.5x, 1.75x, 2x
- Auto-load latest episode on first visit (paused, ready to play)
- Handle `?t=` URL parameter to auto-seek to timestamp on episode pages
- Provide state at app root level so it persists across page navigation

### Build useListeningProgress composable
- Save playback position per episode GUID in localStorage
- Periodically save current position while playing (every 10-15 seconds)
- Retrieve saved position for any episode
- Mark episode as "started" vs "completed" (completed = within last 60 seconds of duration)
- Expose: `getProgress(episodeGuid)`, `saveProgress(episodeGuid, position)`, `isStarted(episodeGuid)`, `isCompleted(episodeGuid)`

### Build AudioPlayer component
- Fixed-position bottom bar, always visible when an episode is loaded
- Show: episode artwork (small), episode title, play/pause button, skip back 15s, skip forward 15s, seek bar with current time / duration, playback speed selector, volume control
- Seek bar is interactive (click/drag to seek)
- Playback speed cycles through presets on click
- Responsive: collapse some controls on small screens (hide volume, show compact layout)
- Use oat.css styling (buttons, progress/meter elements)

### Create audio-player.client.ts plugin
- Client-only plugin that initializes the audio player composable at app root
- Ensures Howler.js only loads on client side (no SSR)

## Epic: Pages & Layout

### Build default layout
- Sticky audio player at bottom of viewport
- Main content area with proper padding to account for player height
- RSS auto-discovery meta tag: `<link rel="alternate" type="application/rss+xml">`
- Dark mode support: toggle that sets `data-theme` on body
- Use oat.css base styling

### Build home page (index.vue)
- PodcastHero at the top
- EpisodeSearch below hero
- EpisodeGrid with paginated episodes
- SEO: structured data for PodcastSeries (schema.org), Open Graph meta tags

### Build episode detail page (episodes/[slug].vue)
- Episode artwork, title, date, duration, episode type badge
- Play button that loads this episode into the audio player
- Support `?t=` query parameter to auto-seek to timestamp
- Full HTML show notes from `content:encoded` with clickable timestamps (HH:MM:SS patterns linked to player seek)
- Display all available metadata: season/episode numbers, keywords, explicit flag, link to original
- Graceful display of optional Podcasting 2.0 data if present (transcript link, chapters, persons)
- SEO: structured data for PodcastEpisode (schema.org), Open Graph with episode artwork
- Share button/link that includes current playback timestamp

## Epic: Utilities

### Build formatting utilities
- `utils/format.ts`: `formatDate(dateString)` for human-readable dates, `formatDuration(seconds)` for `HH:MM:SS` or `MM:SS` display, `parseDuration(input)` to normalize seconds-int vs HH:MM:SS string to number
- `utils/slug.ts`: `generateSlug(title, episodeNumber?)` to create URL-safe slugs from episode titles, handle special characters, duplicates
- `utils/timestamps.ts`: `linkifyTimestamps(html)` to find `HH:MM:SS` or `MM:SS` patterns in HTML show notes and wrap them in clickable links that emit a seek event
- `utils/structured-data.ts`: `generatePodcastSeriesSD(podcast)` and `generateEpisodeSD(episode, podcast)` returning JSON-LD objects for schema.org

## Epic: Polish & Testing

### Test with all 4 feed URLs
- Verify feed parsing works for each test feed
- Verify episode grid renders correctly with different feed sizes (112 to 978 episodes)
- Verify audio playback works with enclosure URLs from each feed
- Verify episode pages render correctly with varying metadata availability
- Check that timestamps in Syntax.fm show notes are clickable
- Verify episode type badges show correctly for 99% Invisible (has bonus episodes)

### Responsive design pass
- Test hero section at mobile, tablet, desktop breakpoints
- Test episode grid layout at all breakpoints
- Test audio player compact mode on mobile
- Ensure oat.css grid utilities are used appropriately

### Dark mode verification
- Verify dark theme toggle works
- Check all components render correctly in dark mode
- Verify oat.css `data-theme="dark"` applies correctly
