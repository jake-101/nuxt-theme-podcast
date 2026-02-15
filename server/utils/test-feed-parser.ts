/**
 * Test script for feed parser
 * Run with: npx tsx server/utils/test-feed-parser.ts
 */

import { parsePodcastFeed } from './feed-parser'

const TEST_FEEDS = [
  {
    name: 'Syntax.fm',
    url: 'https://feed.syntax.fm/',
    expectedEpisodes: 978,
    notes: 'Megaphone, timestamps in show notes',
  },
  {
    name: 'The Rewatchables',
    url: 'https://feeds.megaphone.fm/the-rewatchables',
    expectedEpisodes: 446,
    notes: 'Megaphone, guests in titles',
  },
  {
    name: '99% Invisible',
    url: 'https://feeds.simplecast.com/jn7O6Fnt',
    expectedEpisodes: 774,
    notes: 'Simplecast, episode types, keywords',
  },
  {
    name: 'ACQ2/Acquired',
    url: 'https://feeds.transistor.fm/acq2',
    expectedEpisodes: 112,
    notes: 'Transistor, Podcasting 2.0 tags',
  },
]

async function testFeed(feedConfig: typeof TEST_FEEDS[0]) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing: ${feedConfig.name}`)
  console.log(`URL: ${feedConfig.url}`)
  console.log(`Notes: ${feedConfig.notes}`)
  console.log('='.repeat(60))
  
  try {
    const startTime = Date.now()
    const feed = await parsePodcastFeed(feedConfig.url)
    const elapsed = Date.now() - startTime
    
    console.log(`\n✓ Parsed successfully in ${elapsed}ms\n`)
    
    // Show metadata
    console.log('Show Metadata:')
    console.log(`  Title: ${feed.podcast.title}`)
    console.log(`  Author: ${feed.podcast.author}`)
    console.log(`  Type: ${feed.podcast.type}`)
    console.log(`  Explicit: ${feed.podcast.explicit}`)
    console.log(`  Categories: ${feed.podcast.categories.join(', ')}`)
    console.log(`  Artwork: ${feed.podcast.artwork.substring(0, 60)}...`)
    console.log(`  Language: ${feed.podcast.language || 'N/A'}`)
    
    if (feed.podcast.podcast2) {
      console.log('\n  Podcasting 2.0 Tags:')
      if (feed.podcast.podcast2.guid) {
        console.log(`    GUID: ${feed.podcast.podcast2.guid}`)
      }
      if (feed.podcast.podcast2.funding) {
        console.log(`    Funding: ${feed.podcast.podcast2.funding.length} links`)
      }
    }
    
    // Episode statistics
    console.log(`\nEpisodes: ${feed.episodes.length} total`)
    console.log(`  Expected: ~${feedConfig.expectedEpisodes} (${Math.abs(feed.episodes.length - feedConfig.expectedEpisodes)} difference)`)
    
    const episodeTypes = feed.episodes.reduce((acc, ep) => {
      acc[ep.episodeType] = (acc[ep.episodeType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    console.log(`  Types: ${JSON.stringify(episodeTypes)}`)
    
    const withHtml = feed.episodes.filter(e => e.htmlContent).length
    const withKeywords = feed.episodes.filter(e => e.keywords && e.keywords.length > 0).length
    const withPodcast2 = feed.episodes.filter(e => e.podcast2).length
    
    console.log(`  With HTML content: ${withHtml}`)
    console.log(`  With keywords: ${withKeywords}`)
    console.log(`  With Podcast 2.0 tags: ${withPodcast2}`)
    
    // Show first episode details
    if (feed.episodes.length > 0) {
      const first = feed.episodes[0]
      console.log('\nFirst Episode:')
      console.log(`  Title: ${first.title}`)
      console.log(`  Slug: ${first.slug}`)
      console.log(`  Date: ${first.pubDate}`)
      console.log(`  Duration: ${first.duration} seconds (${Math.floor(first.duration / 60)} min)`)
      console.log(`  Episode #: ${first.episodeNumber || 'N/A'}`)
      console.log(`  Season #: ${first.seasonNumber || 'N/A'}`)
      console.log(`  Type: ${first.episodeType}`)
      console.log(`  Audio: ${first.audioUrl.substring(0, 60)}...`)
      console.log(`  Description: ${first.description.substring(0, 100)}...`)
      
      if (first.podcast2) {
        console.log('  Podcast 2.0:')
        if (first.podcast2.transcript) {
          console.log(`    Transcript: ${first.podcast2.transcript.url}`)
        }
        if (first.podcast2.chapters) {
          console.log(`    Chapters: ${first.podcast2.chapters.url}`)
        }
        if (first.podcast2.persons) {
          console.log(`    Persons: ${first.podcast2.persons.map(p => p.name).join(', ')}`)
        }
      }
    }
    
    console.log('\n✓ Test passed!')
    return true
  } catch (error) {
    console.error(`\n✗ Test failed:`, error)
    return false
  }
}

async function runTests() {
  console.log('RSS Feed Parser Test Suite')
  console.log('Testing against 4 different podcast feeds...\n')
  
  const results = []
  for (const feed of TEST_FEEDS) {
    const success = await testFeed(feed)
    results.push({ name: feed.name, success })
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('Summary:')
  console.log('='.repeat(60))
  results.forEach(r => {
    console.log(`  ${r.success ? '✓' : '✗'} ${r.name}`)
  })
  
  const passedCount = results.filter(r => r.success).length
  console.log(`\nPassed: ${passedCount}/${results.length}`)
  
  process.exit(passedCount === results.length ? 0 : 1)
}

// Run tests
runTests().catch(console.error)
