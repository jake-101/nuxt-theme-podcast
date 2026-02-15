# AudioPlayer Component

## Overview

Persistent bottom-bar audio player powered by Howler.js. State persists across page navigation.

## Usage

### In Layout

```vue
<template>
  <div>
    <header><!-- navigation --></header>
    <main class="main-content">
      <slot />
    </main>
    <AudioPlayer />
  </div>
</template>
```

### Play Episode from Any Component

```vue
<script setup>
import { useAudioPlayer } from '~/composables/useAudioPlayer'

const player = useAudioPlayer()

const playEpisode = (episode) => {
  player.play(episode)
}
</script>

<template>
  <button @click="playEpisode(episode)">
    Play Episode
  </button>
</template>
```

## Features

- ▶️ Play/Pause with loading state
- ⏪⏩ Skip backward/forward 15 seconds
- 🎯 Interactive seek bar (click or drag)
- ⚡ Playback speed: 1x, 1.25x, 1.5x, 1.75x, 2x (click to cycle)
- 🔊 Volume control (hidden on mobile)
- 📱 Responsive design (compact layout on mobile)
- 💾 Auto-saves listening progress every 10 seconds
- 🔗 Support for `?t=` timestamp URL parameter
- 🎨 Uses oat.css styling with custom overrides

## API

### useAudioPlayer()

**State (all computed refs):**
- `currentEpisode` - Currently loaded episode (Episode | null)
- `isPlaying` - Boolean
- `currentTime` - Current position in seconds
- `duration` - Total duration in seconds
- `volume` - 0-1
- `playbackRate` - Current speed (1, 1.25, 1.5, 1.75, 2)
- `isLoading` - Boolean
- `hasEpisode` - Boolean
- `progressPercent` - 0-100

**Methods:**
- `play(episode: Episode)` - Load and play episode
- `pause()` - Pause playback
- `toggle()` - Toggle play/pause
- `seek(seconds: number)` - Seek to position
- `skipForward(seconds = 15)` - Skip forward
- `skipBackward(seconds = 15)` - Skip backward
- `setSpeed(rate: number)` - Set playback speed
- `cycleSpeed()` - Cycle to next speed preset
- `setVolume(level: number)` - Set volume (0-1)
- `getShareUrl(episodeSlug: string)` - Generate URL with current timestamp

### useListeningProgress()

**Methods:**
- `getProgress(guid: string)` - Get saved progress
- `saveProgress(guid, position, duration)` - Save progress
- `isStarted(guid: string)` - Has user started episode
- `isCompleted(guid: string)` - Is within last 60s of duration
- `getProgressPercent(guid: string)` - 0-100
- `clearProgress(guid: string)` - Clear progress
- `clearAll()` - Clear all progress

**Statistics:**
- `getTotalListeningTime()` - Total seconds listened
- `getStartedCount()` - Number of started episodes
- `getCompletedCount()` - Number of completed episodes

## CSS Classes

All styles in `app/assets/css/overrides.css`:

- `.audio-player` - Fixed bottom bar container
- `.audio-player__container` - Flex layout for controls
- `.audio-player__artwork` - Episode thumbnail (60x60)
- `.audio-player__info` - Episode title
- `.audio-player__controls` - Play/pause/skip buttons
- `.audio-player__progress` - Seek bar container
- `.audio-player__progress-bar` - Seek bar track
- `.audio-player__progress-fill` - Seek bar fill
- `.audio-player__time` - Current/total time display
- `.audio-player__secondary-controls` - Speed/volume
- `.audio-player__speed-button` - Speed selector
- `.audio-player__volume` - Volume slider (hidden on mobile)

## Responsive Behavior

**Desktop:**
- All controls visible in single row
- Volume slider visible
- Fixed height: ~100px

**Mobile (< 768px):**
- Wraps to 2 rows (artwork/info on top, controls on bottom)
- Volume control hidden
- Seek bar takes full width
- Compact padding

## Integration Notes

1. **Main content padding**: Add `.main-content` class with `padding-bottom: 120px` to prevent content from being hidden behind player

2. **Timestamp linking**: Use `?t=` parameter to auto-seek on page load
   ```
   /episodes/my-episode?t=123
   /episodes/my-episode?t=1:23
   /episodes/my-episode?t=1:23:45
   ```

3. **Progress tracking**: Automatically saves every 10 seconds while playing, and once when pausing

4. **Episode artwork**: Falls back to show artwork if episode has no specific artwork

5. **State persistence**: Player state lives at app root level and survives navigation
