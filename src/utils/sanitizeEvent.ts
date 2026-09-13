import { WeddingEvent } from '../types';
import { WEDDING_EVENT } from '../data/weddingData';

export const VERIFIED_WEDDING_COVER = 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/event/cover/1760580473926-q6ph48-491657278_9322919307805207_5998846575526453583_n.jpg';
export const VERIFIED_AUDIO = 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/audio/audio-2.mp3';

/**
 * Validates and sanitizes event data to resolve mismatched resources,
 * corrupted cross-template attributes (e.g., housewarming titles with wedding couple photos),
 * and broken media links.
 */
export function sanitizeWeddingEvent(rawEvent: any): WeddingEvent {
  if (!rawEvent || typeof rawEvent !== 'object') {
    return WEDDING_EVENT;
  }

  // Detect corrupted hybrid state: Wedding ID or Wedding Title mixed with Housewarming hosts
  const isWeddingId = rawEvent.id === 'cmgrawhnk0003le0434762j7n';
  const hasWeddingNaming = (rawEvent.name && (rawEvent.name.includes('ម៉ាឡេ') || rawEvent.name.includes('វល្ខ័ក'))) ||
                           (rawEvent.slug && (rawEvent.slug.includes('ម៉ាឡេ') || rawEvent.slug.includes('វល្ខ័ក')));
  const hasHousewarmingContamination = 
    rawEvent.groom === 'លោក សំ ភារម្យ' ||
    rawEvent.groomEn === 'Mr. Sam Phearom' ||
    rawEvent.config?.invitation_kh?.main_title === 'ពិធីឡើងគេហដ្ឋានថ្មី' ||
    rawEvent.config?.cover_subtitle_kh === 'ពិធីឡើងគេហដ្ឋានថ្មី';

  if ((isWeddingId || hasWeddingNaming) && hasHousewarmingContamination) {
    console.warn('[Sanitizer] Detected mismatched template resources (Housewarming data in Wedding event). Reconciling to clean Wedding event.');
    // Preserve any custom user portrait_shape or custom wishes if desired, but restore wedding core
    const portraitShape = rawEvent.config?.portrait_shape || 'circle';
    return {
      ...WEDDING_EVENT,
      config: {
        ...WEDDING_EVENT.config,
        portrait_shape: portraitShape,
      },
    };
  }

  // Ensure image uses fast CDN and is non-empty
  let sanitizedImage = rawEvent.image;
  if (!sanitizedImage || typeof sanitizedImage !== 'string' || sanitizedImage.includes('pixabay.com')) {
    sanitizedImage = VERIFIED_WEDDING_COVER;
  } else if (sanitizedImage.includes('focuz-staging-space.sgp1.digitaloceanspaces.com') && !sanitizedImage.includes('.cdn.')) {
    sanitizedImage = sanitizedImage.replace('focuz-staging-space.sgp1.digitaloceanspaces.com', 'focuz-staging-space.sgp1.cdn.digitaloceanspaces.com');
  }

  // Ensure music URL is working (replace any broken Pixabay links)
  let backgroundMusic = rawEvent.config?.background_music;
  if (!backgroundMusic || backgroundMusic.includes('pixabay.com')) {
    backgroundMusic = VERIFIED_AUDIO;
  }

  // Clean out any conflicting legacy keys
  const { groom_name, bride_name, title, ...cleanEvent } = rawEvent;

  return {
    ...cleanEvent,
    image: sanitizedImage,
    config: {
      ...(cleanEvent.config || {}),
      image: sanitizedImage,
      background_music: backgroundMusic,
      portrait_shape: cleanEvent.config?.portrait_shape || 'circle',
    },
  } as WeddingEvent;
}
