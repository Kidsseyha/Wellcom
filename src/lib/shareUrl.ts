export const PUBLIC_APP_URL = 'https://ais-pre-oi572nxogafsw6nsowqaaj-935767504529.asia-southeast1.run.app';

/**
 * Generates the live working share URL for wedding guests.
 * Automatically converts internal dev URLs (ais-dev-) and localhost to publicly accessible preview URLs (ais-pre-)
 * so guests on any phone, Telegram, Facebook, or browser can open the link directly.
 */
export function getPublicShareUrl(guestName?: string, eventId?: string): string {
  let origin = PUBLIC_APP_URL;

  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    // If running on a public custom domain or live host (and not localhost or internal dev)
    if (
      currentOrigin &&
      !currentOrigin.includes('localhost') &&
      !currentOrigin.includes('127.0.0.1')
    ) {
      if (currentOrigin.includes('ais-dev-')) {
        origin = currentOrigin.replace('ais-dev-', 'ais-pre-');
      } else {
        origin = currentOrigin;
      }
    }
  }

  const url = new URL(origin + '/');

  // Append ID if customized or needed
  if (eventId && eventId !== 'cmgrawhnk0003le0434762j7n') {
    url.searchParams.set('id', eventId);
  }

  if (guestName && guestName.trim() && guestName.trim() !== 'Your Name') {
    url.searchParams.set('name', guestName.trim());
  }

  return url.toString();
}

/**
 * In-memory cache for shortened URLs so repeated requests are instantaneous
 */
const shortUrlCache = new Map<string, string>();

/**
 * Converts a long URL to a short link (using in-app /s/:code)
 */
export async function shortenUrl(longUrl: string): Promise<string> {
  if (!longUrl) return '';

  let cleanedUrl = longUrl;
  if (cleanedUrl.includes('localhost') || cleanedUrl.includes('127.0.0.1')) {
    cleanedUrl = cleanedUrl.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
  }
  if (cleanedUrl.includes('ais-dev-')) {
    cleanedUrl = cleanedUrl.replace('ais-dev-', 'ais-pre-');
  }

  if (shortUrlCache.has(cleanedUrl)) {
    return shortUrlCache.get(cleanedUrl)!;
  }

  // Try server-side shortener endpoint
  try {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanedUrl, origin: PUBLIC_APP_URL }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.shortUrl) {
        let finalShortUrl = data.shortUrl;
        if (finalShortUrl.includes('localhost') || finalShortUrl.includes('127.0.0.1')) {
          finalShortUrl = finalShortUrl.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
        }
        if (finalShortUrl.includes('ais-dev-')) {
          finalShortUrl = finalShortUrl.replace('ais-dev-', 'ais-pre-');
        }
        shortUrlCache.set(cleanedUrl, finalShortUrl);
        return finalShortUrl;
      }
    }
  } catch (err) {
    console.warn('API shorten failed, falling back to direct URL:', err);
  }

  return cleanedUrl;
}


