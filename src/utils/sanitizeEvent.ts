import { WeddingEvent } from '../types';
import { WEDDING_EVENT } from '../data/weddingData';
import { VERIFIED_CATEGORY_COVERS, getCategoryCoverImage, findTemplatePreset } from '../data/eventTemplates';

export const VERIFIED_WEDDING_COVER = 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/event/cover/1760580473926-q6ph48-491657278_9322919307805207_5998846575526453583_n.jpg';
export const VERIFIED_AUDIO = 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/audio/audio-2.mp3';

/**
 * Validates and sanitizes event data to resolve mismatched resources,
 * corrupted cross-template attributes (e.g., birthday or housewarming with wedding couple photos),
 * and broken media links.
 */
export function sanitizeWeddingEvent(rawEvent: any): WeddingEvent {
  if (!rawEvent || typeof rawEvent !== 'object') {
    return WEDDING_EVENT;
  }

  // Detect event type and ID
  const eventId = (rawEvent.id || '').toLowerCase();
  const rawEventType = ((rawEvent.eventType || '') as string).toLowerCase();
  const isBirthday = rawEventType === 'birthday' || eventId.includes('birthday') || (rawEvent.name && (rawEvent.name.includes('ខួប') || rawEvent.name.toLowerCase().includes('birthday')));
  const isHousewarming = rawEventType === 'housewarming' || eventId.includes('housewarming') || (rawEvent.name && (rawEvent.name.includes('ឡើងផ្ទះ') || rawEvent.name.toLowerCase().includes('housewarming')));
  const isEngagement = rawEventType === 'engagement' || eventId.includes('engagement') || (rawEvent.name && (rawEvent.name.includes('ភ្ជាប់ពាក្យ') || rawEvent.name.toLowerCase().includes('engagement')));

  const resolvedType = isBirthday ? 'birthday' : isHousewarming ? 'housewarming' : isEngagement ? 'engagement' : 'wedding';

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
    const portraitShape = rawEvent.config?.portrait_shape || 'circle';
    return {
      ...WEDDING_EVENT,
      eventType: 'wedding',
      config: {
        ...WEDDING_EVENT.config,
        portrait_shape: portraitShape,
      },
    };
  }

  // Ensure category-appropriate cover image
  const defaultCategoryCover = getCategoryCoverImage(resolvedType);
  let sanitizedImage = rawEvent.image;

  if (!sanitizedImage || typeof sanitizedImage !== 'string' || sanitizedImage.includes('pixabay.com')) {
    sanitizedImage = defaultCategoryCover;
  } else if (sanitizedImage.includes('focuz-staging-space.sgp1.digitaloceanspaces.com') && !sanitizedImage.includes('.cdn.')) {
    sanitizedImage = sanitizedImage.replace('focuz-staging-space.sgp1.digitaloceanspaces.com', 'focuz-staging-space.sgp1.cdn.digitaloceanspaces.com');
  }

  // Prevent wedding couple cover photo from leaking into non-wedding templates
  if (resolvedType !== 'wedding' && sanitizedImage.includes('491657278_9322919307805207_5998846575526453583_n.jpg')) {
    sanitizedImage = defaultCategoryCover;
  }

  // Ensure music URL is working (replace any broken Pixabay links)
  let backgroundMusic = rawEvent.config?.background_music;
  if (!backgroundMusic || backgroundMusic.includes('pixabay.com')) {
    backgroundMusic = VERIFIED_AUDIO;
  }

  // Clean out any conflicting legacy keys
  const { groom_name, bride_name, title, ...cleanEvent } = rawEvent;

  // Clean config gallery if contaminated with wrong category photos
  let photoGallary = cleanEvent.config?.photo_gallary;
  if (resolvedType === 'birthday') {
    const preset = findTemplatePreset('birthday');
    if (preset && (!photoGallary?.photo1 || photoGallary.photo1.includes('9318228111607660') || photoGallary.photo1.includes('491657278'))) {
      photoGallary = preset.sampleEvent.config.photo_gallary;
    }
  } else if (resolvedType === 'housewarming') {
    const preset = findTemplatePreset('housewarming');
    if (preset && (!photoGallary?.photo1 || photoGallary.photo1.includes('9318228111607660') || photoGallary.photo1.includes('491657278'))) {
      photoGallary = preset.sampleEvent.config.photo_gallary;
    }
  } else if (resolvedType === 'engagement') {
    const preset = findTemplatePreset('engagement');
    if (preset && (!photoGallary?.photo1 || photoGallary.photo1.includes('9318228111607660') || photoGallary.photo1.includes('491657278'))) {
      photoGallary = preset.sampleEvent.config.photo_gallary;
    }
  }

  return {
    ...cleanEvent,
    eventType: resolvedType,
    image: sanitizedImage,
    config: {
      ...(cleanEvent.config || {}),
      image: sanitizedImage,
      photo_gallary: photoGallary || cleanEvent.config?.photo_gallary,
      background_music: backgroundMusic,
      portrait_shape: cleanEvent.config?.portrait_shape || 'circle',
    },
  } as WeddingEvent;
}
