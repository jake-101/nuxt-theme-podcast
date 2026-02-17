<script setup lang="ts">
import type { NewsletterConfig } from '~/types/podcast'

const props = defineProps<{
  newsletter: NewsletterConfig
}>()

// Platform display metadata
const platformMeta: Record<string, { label: string; icon: string; color: string }> = {
  beehiiv: { label: 'Beehiiv', icon: 'ph:envelope-bold', color: '#FF6154' },
  substack: { label: 'Substack', icon: 'simple-icons:substack', color: '#FF6719' },
  mailchimp: { label: 'Mailchimp', icon: 'simple-icons:mailchimp', color: '#FFE01B' },
  kit: { label: 'Kit', icon: 'ph:envelope-bold', color: '#FB6970' },
}

const platformInfo = computed(() =>
  props.newsletter.platform ? platformMeta[props.newsletter.platform] : null
)

const ctaLabel = computed(() => props.newsletter.label || 'Subscribe to the newsletter')

const description = computed(() => props.newsletter.description || '')

// Whether to show an embed form vs a simple link
const hasEmbed = computed(() => !!props.newsletter.embedCode?.trim())
const hasUrl = computed(() => !!props.newsletter.url?.trim())

// Is there anything to render at all?
const hasContent = computed(() => hasEmbed.value || hasUrl.value)
</script>

<template>
  <div v-if="hasContent" class="newsletter-signup">
    <div class="newsletter-signup__inner">
      <div class="newsletter-signup__text">
        <Icon name="ph:envelope-open-bold" class="newsletter-signup__icon" size="20" />
        <div>
          <p class="newsletter-signup__label">{{ ctaLabel }}</p>
          <p v-if="description" class="newsletter-signup__description">{{ description }}</p>
        </div>
      </div>

      <!-- Embed mode: render raw HTML from platform -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="hasEmbed" class="newsletter-signup__embed" v-html="newsletter.embedCode" />

      <!-- Link mode: simple CTA button -->
      <a
        v-else-if="hasUrl"
        :href="newsletter.url"
        target="_blank"
        rel="noopener noreferrer"
        class="newsletter-signup__btn"
        :style="platformInfo ? `--newsletter-color: ${platformInfo.color}` : undefined"
      >
        <Icon v-if="platformInfo" :name="platformInfo.icon" size="14" />
        {{ platformInfo ? `Subscribe on ${platformInfo.label}` : ctaLabel }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.newsletter-signup {
  border-top: 1px solid var(--border);
  padding: 1.25rem 0;
}

.newsletter-signup__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.newsletter-signup__text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.newsletter-signup__icon {
  color: var(--primary);
  flex-shrink: 0;
}

.newsletter-signup__label {
  margin: 0;
  font-weight: 600;
  color: var(--foreground);
  font-size: 0.875rem;
}

.newsletter-signup__description {
  margin: 0.15rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.8rem;
}

.newsletter-signup__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 1rem;
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  color: var(--primary);
  border: 1px solid color-mix(in srgb, var(--primary) 35%, transparent);
  border-radius: var(--radius-full, 9999px);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.newsletter-signup__btn:hover {
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  border-color: color-mix(in srgb, var(--primary) 55%, transparent);
  text-decoration: none;
}

.newsletter-signup__embed {
  width: 100%;
  margin-top: 0.75rem;
}

/* When there's an embed, stack vertically */
.newsletter-signup__inner:has(.newsletter-signup__embed) {
  flex-direction: column;
  align-items: flex-start;
}

@media (max-width: 600px) {
  .newsletter-signup__inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .newsletter-signup__btn {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
