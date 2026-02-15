# Future Features

Ideas for post-MVP features, roughly ordered by value and feasibility.

---

## Transcript Display

If `podcast:transcript` is present in the feed (links to SRT/VTT/JSON files), fetch and render the transcript alongside the player on the episode page. Highlight the current line as audio plays when using a timed format (VTT/SRT). Massive for accessibility and SEO since Google indexes transcript text.

Adoption of the `podcast:transcript` tag is growing, especially on Transistor and indie-hosted feeds. Even when the tag isn't present, some podcasts host transcripts on their own sites and link to them in show notes.

## Chapter Navigation

If `podcast:chapters` is present (links to a JSON chapters file), display a chapter list in the player and on the episode page. Clicking a chapter jumps the audio player to that timestamp. As a fallback, parse timestamp patterns from HTML show notes (Syntax.fm style, e.g. `#t=12:30`) and present them as pseudo-chapters.

The JSON Chapters format spec: https://github.com/Podcastindex-org/podcast-namespace/blob/main/chapters/jsonchapters.md

## Host & Guest Profiles (podcast:person)

If `podcast:person` tags are present, display host and guest info with avatars on episode pages. Could enable a "browse by guest" view where fans search for episodes featuring a specific guest. Even without the tag, guest names could be parsed from episode titles (The Rewatchables does "With Bill Simmons, Chris Ryan...").

Could also support a manually curated hosts/guests config in `app.config.ts` for shows that don't use the tag.

## Embed Widget

A small embeddable player widget for any episode, similar to Spotify's embed cards. Render at a route like `/embed/[slug]` with a minimal player UI (artwork, title, play button, seek bar). Creators can embed episodes in blog posts, newsletters, and social media.

Would need its own minimal layout without the full site chrome, and a small snippet of embed code users can copy.

## Funding & Support Links (podcast:funding)

Display Patreon, Buy Me a Coffee, Ko-fi, or other funding links prominently on the site. The `podcast:funding` tag in the RSS feed provides these URLs directly. For shows without the tag, support a `funding` config option in `app.config.ts`.

Important for indie creators whose website should drive financial support.

## Newsletter / Email Signup

A config option to add an email signup form integrated with common providers (Buttondown, Mailchimp, ConvertKit, etc.). Many podcast creators use newsletters as a companion channel. Could be as simple as accepting a form action URL in config and rendering a styled signup form.

## Analytics Hook

Not tracking users directly, but providing a config option for creators to plug in privacy-respecting analytics (Plausible, Fathom, Simple Analytics, etc.). In the simplest form, just a slot to inject a script tag. For the SaaS version, this becomes a first-class feature.

## Custom Pages

Allow creators to add static pages (About, Contact, Sponsors) to their site. The consuming Nuxt project can already add pages since this is a Layer, but providing a config-driven approach (markdown files, or a simple pages array in config) would lower the barrier. Could integrate with Nuxt Content for a markdown-driven approach.

## Season-Based Navigation

For podcasts that use seasons (`itunes:season`), offer a season-based browsing view in addition to the chronological episode grid. Especially useful for serial podcasts (`itunes:type: serial`) where listening order matters. Could include a season selector dropdown and season overview pages.

## Podcast Network Support

Support for multi-show networks where one site hosts several podcasts. Would require a config array of feed URLs and a show selector in the UI. Relevant for the SaaS product where a network might want a unified site.

## Social Sharing Cards

Auto-generate Open Graph images for each episode using episode artwork, title, and show branding. Could use `@nuxtjs/og-image` or a server-side canvas rendering approach. Better social sharing drives discovery.

## Podcast Recommendations (podcast:podroll)

If `podcast:podroll` is present, display recommended podcasts from the creator. Could render as a small "Also listen to" section on the site. Helps with cross-promotion between shows.

## Live Episode Support (podcast:liveItem)

If `podcast:liveItem` is present, display a "Live Now" banner when a live recording is happening. Link to the live stream. Could integrate with `podcast:chat` for live interaction.

## Search Engine for Episodes

Full-text search across episode transcripts and show notes, not just titles and descriptions. Would require indexing transcript content. Could use a client-side search library like Fuse.js or MiniSearch for smaller catalogs, or a server-side solution for large ones.

## Playback Sync Across Devices

Optional account system (or anonymous device linking) to sync listening progress across devices. Would require a small backend. More relevant for the SaaS product than the open-source theme.

## RSS Feed Enhancements

Generate an enhanced RSS feed from the site that includes any manually added metadata (chapters, transcripts, guest info) that wasn't in the original feed. Useful for creators who want to enrich their existing feed through the website CMS.
