# Test Podcast Feeds

This document lists podcast RSS feeds useful for development and testing. These feeds cover different hosting platforms, feed structures, and Podcasting 2.0 features.

All feeds verified working as of Feb 2026.

## Current Test Feeds

| Podcast | Feed URL | Platform | Episodes | Notable Features |
|---------|----------|----------|----------|------------------|
| **Syntax.fm** | `https://feed.syntax.fm/` | Megaphone | 978+ | Rich HTML show notes, timestamps in notes (~301), video enclosures |
| **The Rewatchables** | `https://feeds.megaphone.fm/the-rewatchables` | Megaphone | 446+ | content:encoded, trailer episode |
| **99% Invisible** | `https://feeds.simplecast.com/jn7O6Fnt` | Simplecast | 774+ | 88 bonus + 1 trailer episodes, episode numbers, keywords |
| **Acquired** | `https://feeds.transistor.fm/acquired` | Transistor | 212+ | podcast:person (424 tags), seasons, episode numbers, keywords, 24 bonus + 1 trailer, podcast:guid |
| **What The Hack** | `https://feeds.transistor.fm/what-the-hack-podcast` | Transistor | 17+ | **podcast:person with unique guests per episode** (88 tags, 1 host + many guests), podcast:guid |
| **70mm** | `https://feeds.transistor.fm/70mm` | Transistor | 349+ | **podcast:chapters (346 eps)**, podcast:transcript (10 eps), podcast:funding, episode numbers, keywords, 49 bonus + 1 trailer |
| **The Sustainable Tech Podcast** | `https://feeds.transistor.fm/the-sustainable-tech-podcast` | Transistor | 33+ | podcast:person (host + unique guest per ep), **podcast:transcript (VTT + JSON)**, podcast:guid, podcast:podroll, episode numbers, keywords, content:encoded |
| **Cheeky Pint** | `https://feeds.transistor.fm/cheeky-pint-with-john-collison` | Transistor | 22+ | podcast:transcript (plain text per ep), podcast:guid, podcast:trailer, per-episode artwork, episode numbers, timestamps in show notes, content:encoded |

## Additional Test Feeds

These feeds provide additional testing scenarios:

| Podcast | Feed URL | Platform | Episodes | Notable Features |
|---------|----------|----------|----------|------------------|
| **Podnews Daily** | `https://podnews.net/rss` | Custom | 151+ | **podcast:transcript (VTT, 150 eps)**, podcast:person, podcast:funding, podcast:location (23), podcast:value, video enclosures, multiple audio formats (mp3/aac/opus) |
| **The Joe Rogan Experience** | `https://feeds.megaphone.fm/GLT1412515089` | Megaphone | 2639+ | Massive catalog, episode numbers (~1002), content:encoded |
| **The Daily (NYT)** | `https://feeds.simplecast.com/54nAGcIl` | Simplecast | 2770+ | Massive catalog (17MB feed), content:encoded, video references in notes |
| **Huberman Lab** | `https://feeds.megaphone.fm/hubermanlab` | Megaphone | 381+ | Episode numbers, 29 bonus + 1 trailer episodes, content:encoded |
| **Lex Fridman Podcast** | `https://lexfridman.com/feed/podcast/` | Custom (WordPress) | 492+ | No content:encoded (description only), podcast:guid |
| **The Rest Is History** | `https://feeds.megaphone.fm/GLT4787413333` | Megaphone | 675+ | Seasons (111 eps), episode numbers (643), 13 bonus + 1 trailer, content:encoded |
| **New Heights (Kelce Bros)** | `https://rss.art19.com/new-heights` | Art19 | 186+ | Every episode has season + episode number, video references, content:encoded |
| **Crime Junkie** | `https://feeds.simplecast.com/qm_9xx0g` | Simplecast | 490+ | Content:encoded on all episodes |
| **SmartLess** | `https://rss.art19.com/smartless` | Art19 | 336+ | Episode numbers, 30+ bonus episodes, content:encoded |
| **Dateline NBC** | `https://podcastfeeds.nbcnews.com/dateline-nbc` | NBC (Megaphone) | 759+ | Episode numbers (~224), keywords (517), 23 bonus + 1 trailer, content:encoded, video references |
| **Pod Save America** | `https://audioboom.com/channels/5166624.rss` | Audioboom | 1139+ | Episode numbers, 22 bonus episodes, podcast:guid, no content:encoded (description only), video references |

### News & Current Events

| Podcast | Feed URL | Platform | Episodes | Notable Features |
|---------|----------|----------|----------|------------------|
| **Hard Fork** | `https://feeds.simplecast.com/l2i9YnTd` | Simplecast | 182+ | NYT tech news, content:encoded, episode numbers |
| **Planet Money** | `https://feeds.npr.org/510289/podcast.xml` | NPR | 355+ | NPR feed format, content:encoded |
| **It's Been a Minute** | `https://feeds.npr.org/510317/podcast.xml` | NPR | 981+ | NPR feed format, large catalog, content:encoded |
| **TED Radio Hour** | `https://feeds.npr.org/510298/podcast.xml` | NPR | 300+ | NPR feed format, content:encoded |
| **The Ezra Klein Show** | `https://feeds.simplecast.com/82FI35Px` | Simplecast | 482+ | NYT, content:encoded |
| **StarTalk Radio** | `https://feeds.simplecast.com/4T39_jAj` | Simplecast | 1077+ | Science/news, seasons, episode numbers, content:encoded |

### History & Narrative

| Podcast | Feed URL | Platform | Episodes | Notable Features |
|---------|----------|----------|----------|------------------|
| **American History Tellers** | `https://rss.art19.com/american-history-tellers` | Art19 | 465+ | Seasons, episode numbers, content:encoded |
| **American Scandal** | `https://rss.art19.com/american-scandal` | Art19 | 132+ | Seasons, episode numbers, content:encoded |
| **Tides of History** | `https://rss.art19.com/tides-of-history` | Art19 | 378+ | Seasons, episode numbers, content:encoded |
| **Historical Figures** | `https://rss.art19.com/historical-figures` | Art19 | 71+ | Episode numbers, content:encoded |
| **Freakonomics Radio** | `https://rss.art19.com/freakonomics-radio` | Art19 | 888+ | Episode numbers, content:encoded |
| **Stuff You Should Know** | `https://rss.art19.com/stuff-you-should-know` | Art19 | 2000+ | Massive catalog, episode numbers, content:encoded |
| **EconTalk** | `https://feeds.simplecast.com/wgl4xEgL` | Simplecast | 1037+ | Large catalog, episode numbers, content:encoded |

### Technology & Developer

| Podcast | Feed URL | Platform | Episodes | Notable Features |
|---------|----------|----------|----------|------------------|
| **Darknet Diaries** | `https://podcast.darknetdiaries.com/` | Independent | 170+ | Cybersecurity, episode numbers, seasons, podcast:guid, content:encoded |
| **Home Assistant Podcast** | `https://feeds.redcircle.com/f8fe71b6-911e-4abb-8fdc-cebda631a2da` | RedCircle | 234+ | Smart home, episode numbers, podcast:guid |
| **Self-Hosted** | `https://feeds.fireside.fm/selfhosted/rss` | Fireside | 151+ | podcast:person, podcast:chapters, content:encoded, homelab/self-hosting |
| **LINUX Unplugged** | `https://feeds.fireside.fm/linuxunplugged/rss` | Fireside | 654+ | Linux/open source, episode numbers, podcast:guid, content:encoded |
| **Coder Radio** | `https://feeds.fireside.fm/coder/rss` | Fireside | 589+ | Dev/programming, podcast:person, content:encoded |
| **TechSNAP** | `https://feeds.fireside.fm/techsnap/rss` | Fireside | 240+ | Sysadmin/security, podcast:person, podcast:chapters, content:encoded |
| **The Changelog** | `https://changelog.com/podcast/feed` | Changelog | 999+ | Open source/dev, **podcast:person**, **podcast:chapters**, content:encoded |
| **The Stack Overflow Podcast** | `https://feeds.simplecast.com/XA_851k3` | Simplecast | 911+ | Developer focused, episode numbers, content:encoded |
| **Hanselminutes** | `https://feeds.simplecast.com/gvtxUiIf` | Simplecast | 1000+ | Developer interviews, episode numbers, content:encoded |

### Comedy & Entertainment

| Podcast | Feed URL | Platform | Episodes | Notable Features |
|---------|----------|----------|----------|------------------|
| **Matt and Shane's Secret Podcast** | `https://feeds.megaphone.fm/GLT1158789509` | Megaphone | 346+ | Explicit, content:encoded, comedy |
| **Conan O'Brien Needs A Friend** | `https://feeds.simplecast.com/dHoohVNH` | Simplecast | 670+ | Episode numbers, content:encoded, large catalog |
| **Office Ladies** | `https://rss.art19.com/office-ladies` | Art19 | 420+ | The Office rewatch, content:encoded |

## Feed Health Notes

- **Crime Junkie**: Old URL `https://feeds.simplecast.com/i6hk` returns 404. Use `qm_9xx0g` instead.
- **SmartLess**: Art19 URL (`rss.art19.com/smartless`) works directly.
- **Dateline NBC**: Redirects to `https://podcastfeeds.nbcnews.com/HL4TzgYC`.
- **Lex Fridman**: Custom WordPress feed — no `content:encoded`, only plain descriptions.
- **Pod Save America**: Audioboom feed — no `content:encoded`, only plain descriptions.
- **Darknet Diaries**: Feed lives at `podcast.darknetdiaries.com/` (not a standard hosting platform).
- **Matt & Shane's Secret Podcast**: Feed not publicly accessible — moved platforms multiple times, currently behind paywall/app.

## Testing Guidelines

When testing the theme with these feeds:

1. **Feed Parsing**: Verify all feeds parse correctly and extract metadata
2. **Episode Display**: Check that episodes render properly with varying metadata
3. **Audio Playback**: Confirm enclosure URLs work across different platforms
4. **Special Features**: Test bonus/trailer badges, season/episode numbers, keywords
5. **Performance**: Monitor load times with feeds of different sizes (151 vs 2770+ episodes)
6. **Transcripts**: Use Podnews Daily or Cheeky Pint feeds to test transcript viewer
7. **Edge Cases**: Lex Fridman and Pod Save America have no rich show notes (no content:encoded)
8. **Large catalogs**: Stuff You Should Know, The Daily, EconTalk, Joe Rogan for pagination stress testing
9. **Podcasting 2.0**: Self-Hosted, Changelog, TechSNAP for podcast:person and podcast:chapters

## Podcasting 2.0 Features

Adoption of Podcasting 2.0 namespace tags is limited among mainstream podcasts. The following tags are supported by the theme:

| Tag | Feeds with this tag |
|-----|---------------------|
| **`podcast:transcript`** | Podnews Daily (150 eps), 70mm (10 eps), The Sustainable Tech Podcast (VTT + JSON per ep), Cheeky Pint (plain text per ep) |
| **`podcast:chapters`** | 70mm (346 eps), Self-Hosted, TechSNAP, Changelog |
| **`podcast:person`** | Acquired (424 tags), What The Hack (88 tags, unique guests), Podnews Daily, The Sustainable Tech Podcast (host + guest per ep), Self-Hosted, Coder Radio, TechSNAP, Changelog |
| **`podcast:funding`** | Podnews Daily, 70mm |
| **`podcast:guid`** | Acquired, Lex Fridman, Podnews Daily, Pod Save America, 70mm, The Sustainable Tech Podcast, Cheeky Pint, Darknet Diaries, Home Assistant Podcast, LINUX Unplugged |
| **`podcast:location`** | Podnews Daily (23) |
| **`podcast:value`** | Podnews Daily (4) |
| **`podcast:locked`** | Acquired, 70mm, The Sustainable Tech Podcast, Cheeky Pint |
| **`podcast:podroll`** | The Sustainable Tech Podcast |
| **`podcast:trailer`** | Cheeky Pint |

Refer to the [Podcasting 2.0 namespace spec](https://github.com/Podcastindex-org/podcast-namespace) for full details.
