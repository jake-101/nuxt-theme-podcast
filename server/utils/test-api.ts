/**
 * Test script to validate the podcast API endpoints
 * Run with: pnpm tsx server/utils/test-api.ts
 */

import { parsePodcastFeed } from './feed-parser'

async function testAPI() {
  console.log('Testing Podcast API Implementation...\n')
  
  const testFeedUrl = 'https://feed.syntax.fm/'
  
  try {
    console.log(`Fetching feed: ${testFeedUrl}`)
    const feed = await parsePodcastFeed(testFeedUrl)
    
    console.log('\n✅ Feed parsed successfully!\n')
    console.log('Podcast Info:')
    console.log(`  Title: ${feed.podcast.title}`)
    console.log(`  Author: ${feed.podcast.author}`)
    console.log(`  Type: ${feed.podcast.type}`)
    console.log(`  Episodes: ${feed.episodes.length}`)
    
    if (feed.episodes.length > 0) {
      const latest = feed.episodes[0]
      console.log('\nLatest Episode:')
      console.log(`  Title: ${latest.title}`)
      console.log(`  Slug: ${latest.slug}`)
      console.log(`  Duration: ${latest.duration}s`)
      console.log(`  Type: ${latest.episodeType}`)
      console.log(`  Audio URL: ${latest.audioUrl.substring(0, 60)}...`)
    }
    
    console.log('\n✅ All tests passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

testAPI()
