# nuxt-podcast-theme

A Nuxt 4 Layer that auto-generates a beautiful podcast website from an RSS feed URL.

## Features

- 🎙️ **Auto-generated from RSS** - Just provide your podcast RSS feed URL
- 🎨 **Clean, minimal design** - Using oat.css for semantic, zero-dependency styling
- 🎵 **Persistent audio player** - Powered by Howler.js, plays across page navigation
- 📱 **Fully responsive** - Mobile-first design with tablet/desktop optimizations
- 🌙 **Dark mode support** - Built-in theme toggle
- 🔍 **Client-side search** - Filter episodes by title and description
- ⏱️ **Clickable timestamps** - Show notes with timestamps that seek the audio
- 💾 **Listening progress** - Auto-saves position to localStorage
- 🔗 **Shareable timestamps** - Share episode links with `?t=` parameter
- 🎯 **SEO optimized** - schema.org structured data, Open Graph, Twitter Cards
- 📊 **Podcasting 2.0 support** - Transcripts, chapters, funding, persons (when available)

## Quick Start

### 1. Install

```bash
npm install nuxt-podcast-theme
# or
pnpm add nuxt-podcast-theme
# or
yarn add nuxt-podcast-theme
```

### 2. Extend the layer

Create a minimal Nuxt project and extend the theme in `nuxt.config.ts`:

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
    theme: 'auto', // 'light' | 'dark' | 'auto'
  },
})
```

### 4. Run

```bash
npm run dev
```

Your podcast website is now live at `http://localhost:3000`!

## Configuration

### Required Settings

- `feedUrl` - Your podcast RSS feed URL (required)

### Optional Settings

- `siteTitle` - Override the title from the RSS feed
- `platforms` - Links to your podcast on various platforms (for subscribe buttons)
- `episodesPerPage` - Number of episodes per page (default: 12)
- `theme` - Default theme: 'light', 'dark', or 'auto' (default: 'auto')

## Development

### Local Development

Clone this repo and set up the playground:

```bash
git clone https://github.com/yourusername/nuxt-podcast-theme
cd nuxt-podcast-theme
pnpm install
pnpm dev
```

The playground uses the Syntax.fm podcast feed as an example.

### Tech Stack

- **Framework:** Nuxt 4
- **CSS:** oat.css (~8KB, zero dependencies)
- **Audio:** Howler.js (~7KB)
- **RSS Parsing:** fast-xml-parser
- **Utilities:** VueUse

### Project Structure

```
nuxt-podcast-theme/
├── app/
│   ├── components/       # Vue components
│   ├── composables/      # Composables (useAudioPlayer, usePodcast, etc.)
│   ├── layouts/          # Layouts (default.vue)
│   ├── pages/            # Pages (index, episodes/[slug])
│   ├── plugins/          # Plugins (audio player, oat.css)
│   └── utils/            # Utilities (format, slug, timestamps, SEO)
├── server/
│   ├── api/              # API routes (/api/podcast, /api/podcast/refresh)
│   └── utils/            # Server utilities (feed parser, caching)
├── types/                # TypeScript interfaces
├── playground/           # Dev/test app
└── docs/                 # Documentation
```

## RSS Feed Support

### Supported Namespaces

- **Standard RSS 2.0** - title, description, link, guid, enclosure, pubDate
- **iTunes** - author, image, duration, episode type, explicit, keywords, season/episode numbers
- **Podcasting 2.0** - transcript, chapters, persons, funding, guid (optional)

### Tested Feeds

This theme has been tested against:
- Syntax.fm (978 episodes, Megaphone)
- The Rewatchables (446 episodes, Megaphone)
- 99% Invisible (774 episodes, Simplecast)
- Acquired (112 episodes, Transistor, Podcasting 2.0)

## API Routes

### GET `/api/podcast`

Returns the parsed podcast feed with show metadata and episodes.

**Response:**
```json
{
  "podcast": {
    "title": "...",
    "author": "...",
    "description": "...",
    "artwork": "...",
    ...
  },
  "episodes": [
    {
      "guid": "...",
      "title": "...",
      "slug": "...",
      "audioUrl": "...",
      ...
    }
  ]
}
```

**Caching:** Results are cached for 1 hour.

### POST `/api/podcast/refresh`

Clears the cache and returns fresh data. Useful for webhooks or manual refresh.

## Customization

### Override Components

Create your own version of any component in your project's `app/components/` directory:

```vue
<!-- app/components/PodcastHero.vue -->
<template>
  <div class="my-custom-hero">
    <!-- Your custom hero design -->
  </div>
</template>
```

### Override CSS

Add your own styles in your project:

```css
/* app/assets/css/custom.css */
.episode-grid {
  gap: 3rem; /* Override the default 1.5rem */
}
```

Then import in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['nuxt-podcast-theme'],
  css: ['~/app/assets/css/custom.css']
})
```

### Override Pages

Create your own pages to replace the defaults:

```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <!-- Your custom home page -->
  </div>
</template>
```

## Future Features

See [docs/future-features.md](./docs/future-features.md) for planned enhancements including:
- Transcript display with sync highlighting
- Chapter navigation
- Host/guest profiles
- Embed widget
- Newsletter integration

## License

MIT

## Credits

Built with:
- [Nuxt 4](https://nuxt.com)
- [oat.css](https://oat.ink) by [@knadh](https://github.com/knadh)
- [Howler.js](https://howlerjs.com) by [@goldfire](https://github.com/goldfire)
- [VueUse](https://vueuse.org)
