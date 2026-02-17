# nuxt-podcast-theme

A Nuxt 4 Layer that auto-generates a beautiful, fully-featured podcast website from an RSS feed URL. Point it at your feed, configure a few options, and get a complete podcast site with audio playback, search, dark mode, SEO, and more.

## Features

- **Auto-generated from RSS** - Provide your podcast RSS feed URL and get a full website
- **Persistent audio player** - Howler.js-powered player that persists across page navigation with skip, seek, speed control, and volume
- **Artwork-derived theme colors** - Extracts dominant colors from your podcast artwork and generates WCAG AA accessible light/dark palettes
- **Dark mode** - Built-in theme toggle with auto-detection, persisted preference
- **Client-side search** - Filter episodes by title, description, and show notes content
- **Clickable timestamps** - Timestamps in show notes seek the audio player
- **Listening progress** - Auto-saves playback position to localStorage, tracks started/completed episodes
- **Shareable timestamps** - Share episode links with `?t=` parameter to jump to a specific time
- **SEO optimized** - schema.org structured data (PodcastSeries, PodcastEpisode), Open Graph, Twitter Cards, RSS auto-discovery
- **Podcasting 2.0 support** - Transcripts (VTT/SRT), chapters, funding links, and person tags with dedicated person pages
- **Responsive design** - Mobile-first layout with tablet and desktop breakpoints
- **Clean, semantic styling** - Built on oat.css (~8KB, zero dependencies)
- **Smooth animations** - Spring-based card transitions via Motion Vue

## Quick Start

### 1. Install

```bash
pnpm add nuxt-podcast-theme
```

### 2. Extend the layer

Create a Nuxt project and extend the theme in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['nuxt-podcast-theme']
})
```

### 3. Configure your podcast

Add your podcast configuration in `app.config.ts`:

```ts
export default defineAppConfig({
  podcast: {
    feedUrl: 'https://feed.syntax.fm/',
    siteTitle: 'Syntax - Tasty Web Development Treats',
    platforms: {
      spotify: 'https://open.spotify.com/show/...',
      apple: 'https://podcasts.apple.com/...',
      youtube: 'https://youtube.com/...',
      pocketcasts: 'https://pca.st/...',
      overcast: 'https://overcast.fm/...',
      rss: 'https://feed.syntax.fm/',
    },
    episodesPerPage: 12,
    theme: 'auto',
  },
})
```

### 4. Run

```bash
pnpm dev
```

Your podcast website is live at `http://localhost:3000`.

## Configuration

All configuration lives in your project's `app.config.ts` under the `podcast` key.

### Required

| Option | Type | Description |
|--------|------|-------------|
| `feedUrl` | `string` | Your podcast RSS feed URL |

### Optional

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `siteTitle` | `string` | From feed | Override the title from the RSS feed |
| `platforms` | `PlatformLinks` | `{}` | Subscribe links (Spotify, Apple, YouTube, Pocket Casts, Overcast, RSS) |
| `funding` | `object` | `{}` | Funding links (Patreon, Buy Me a Coffee, Ko-fi, Stripe, PayPal) |
| `episodesPerPage` | `number` | `12` | Number of episodes per page |
| `hideArtwork` | `boolean` | `false` | Hide per-episode artwork in the grid |
| `heroType` | `'podcast' \| 'featured'` | `'podcast'` | Show overview hero or latest episode as hero |
| `navLogo` | `'text' \| 'image'` | `'text'` | Header logo style |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Default color scheme |

## Pages

The theme generates three route groups:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, search bar, paginated episode grid |
| `/episodes/:slug` | Episode detail | Full show notes, audio player, metadata, timestamps, transcript, persons |
| `/people` | People directory | All hosts and guests aggregated from Podcasting 2.0 person tags |
| `/people/:slug` | Person profile | Bio and list of episodes a person appears in |

## API Routes

### GET `/api/podcast`

Returns the parsed podcast feed with show metadata and all episodes. Results are cached for 1 hour.

### POST `/api/podcast/refresh`

Clears the feed cache and returns fresh data. Useful for webhooks when new episodes publish.

### GET `/api/podcast/colors`

Extracts dominant colors from podcast artwork and returns an accessible theme palette for light and dark modes.

### GET `/api/transcript?url=...`

Fetches and parses a podcast transcript (VTT, SRT, or plain text) from a given URL.

## RSS Feed Support

### Supported Namespaces

- **RSS 2.0** - title, description, link, guid, enclosure, pubDate
- **iTunes** - author, image, duration, episode type, explicit, keywords, season/episode numbers, categories
- **Podcasting 2.0** - transcript, chapters, persons, funding, guid

### Tested Feeds

| Podcast | Episodes | Platform | Notes |
|---------|----------|----------|-------|
| Syntax.fm | 978+ | Megaphone | Timestamps in show notes |
| The Rewatchables | 446+ | Megaphone | Large back catalog |
| 99% Invisible | 774+ | Simplecast | Bonus episodes, episode types |
| Acquired | 112+ | Transistor | Podcasting 2.0 features (transcripts, persons, chapters) |

## Customization

### Override Components

Create your own version of any component in your project's `components/` directory. Nuxt's layer system will use your version instead of the theme's:

```vue
<!-- app/components/PodcastHero.vue -->
<template>
  <div class="my-custom-hero">
    <!-- Your custom hero design -->
  </div>
</template>
```

### Override CSS

Add custom styles and import them in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['nuxt-podcast-theme'],
  css: ['~/assets/css/custom.css']
})
```

### Override Pages

Create your own pages to replace the defaults:

```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <!-- Your custom home page using usePodcast() composable -->
  </div>
</template>
```

### Use Composables

The theme exposes composables you can use in custom components:

```vue
<script setup lang="ts">
const { podcast, episodes, searchEpisodes } = usePodcast()
const { play, pause, isPlaying, currentTime } = useAudioPlayer()
const { getProgress, isCompleted } = useListeningProgress()
const { people, findPersonBySlug } = usePodcastPeople()
</script>
```

## Tech Stack

| Library | Purpose | Size |
|---------|---------|------|
| [Nuxt 4](https://nuxt.com) | Framework (SSR/SSG Layer) | - |
| [oat.css](https://oat.ink) | Semantic CSS framework | ~8KB |
| [Howler.js](https://howlerjs.com) | Cross-browser audio engine | ~7KB |
| [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) | RSS XML parsing | - |
| [VueUse](https://vueuse.org) | Vue composable utilities | - |
| [culori](https://culorijs.org) | OKLCH color space manipulation | - |
| [extract-colors](https://github.com/nicolo-ribaudo/extract-colors) | Dominant color extraction from artwork | - |
| [Motion Vue](https://motion.vueuse.org) | Spring-based animations | - |
| [Phosphor Icons](https://phosphoricons.com) | UI icons | - |

## Project Structure

```
nuxt-podcast-theme/
├── app/
│   ├── assets/css/           # oat.css overrides
│   ├── components/           # PodcastHero, EpisodeCard, AudioPlayer, etc.
│   ├── composables/          # useAudioPlayer, usePodcast, useListeningProgress, etc.
│   ├── layouts/              # Default layout (header, nav, footer, sticky player)
│   ├── pages/                # index, episodes/[slug], people/, people/[slug]
│   ├── plugins/              # audio-player.client.ts, oat.client.ts
│   └── utils/                # format, timestamps, structured-data, transcript
├── server/
│   ├── api/                  # /api/podcast, /api/podcast/refresh, /api/podcast/colors, /api/transcript
│   └── utils/                # feed-parser, feed-cache, slug, color-extractor, palette-generator
├── types/                    # TypeScript interfaces (Podcast, Episode, Person, ThemePalette)
├── tests/                    # Vitest unit tests
├── playground/               # Dev app for testing the layer
└── docs/                     # Documentation
```

## Development

### Setup

```bash
git clone https://github.com/yourusername/nuxt-podcast-theme
cd nuxt-podcast-theme
pnpm install
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start playground dev server |
| `pnpm build` | Build playground for production |
| `pnpm generate` | Static site generation |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Single test run |
| `pnpm test:coverage` | Run tests with coverage report |

### Testing

Tests use Vitest with happy-dom. Coverage includes:

- Utility functions (format, timestamps, structured data, slugs)
- Composables (audio player, listening progress)
- Server utilities (feed parser, palette generator)

```bash
pnpm test:run
```

## License

MIT

## Credits

Built with [Nuxt](https://nuxt.com), [oat.css](https://oat.ink), [Howler.js](https://howlerjs.com), and [VueUse](https://vueuse.org).
