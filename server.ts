import express from 'express';
import path from 'path';
import fs from 'fs';
import { findTemplatePreset, getCategoryCoverImage } from './src/data/eventTemplates';

// Guard against unhandled errors terminating process
process.on('uncaughtException', err => {
  console.error('[Process UncaughtException]', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process UnhandledRejection]', reason);
});

// Determine environment
const isProduction =
  process.env.NODE_ENV === 'production' ||
  (typeof __filename !== 'undefined' && (__filename.endsWith('server.cjs') || __filename.includes('dist')));

const app = express();

// In development, the AI Studio dev environment routes through nginx reverse proxy to port 3000.
// In production Cloud Run deployment, Cloud Run injects PORT (e.g. 8080) and requires listening on it.
const PORT = isProduction && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High body limits to allow uploaded photos and base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directory exists for persistent server storage
const DATA_DIR = path.join(process.cwd(), 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'saved_events.json');
const WISHES_FILE = path.join(DATA_DIR, 'saved_wishes.json');
const RSVPS_FILE = path.join(DATA_DIR, 'saved_rsvps.json');
const GUESTS_FILE = path.join(DATA_DIR, 'saved_guests.json');
const SHORT_LINKS_FILE = path.join(DATA_DIR, 'saved_short_links.json');
const PUBLIC_APP_URL = process.env.APP_URL || 'https://ais-pre-oi572nxogafsw6nsowqaaj-935767504529.asia-southeast1.run.app';

function getShortLinks(): Record<string, string> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SHORT_LINKS_FILE)) {
      return JSON.parse(fs.readFileSync(SHORT_LINKS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading short links file:', err);
  }
  return {};
}

function saveShortLink(code: string, url: string) {
  try {
    const links = getShortLinks();
    links[code] = url;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SHORT_LINKS_FILE, JSON.stringify(links, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving short link:', err);
  }
}

function getInjectedHtml(html: string, guestName: string | null, event: any, eventId?: string): string {
  const eventIdLower = (eventId || event?.id || '').toLowerCase();
  const eventType = (event?.eventType || '').toLowerCase();
  const eventNameLower = (event?.name || '').toLowerCase();

  const isBday = eventType === 'birthday' || eventIdLower.includes('birthday') || eventNameLower.includes('ខួប') || eventNameLower.includes('birthday');
  const isHouse = eventType === 'housewarming' || eventIdLower.includes('housewarming') || eventNameLower.includes('ឡើងផ្ទះ') || eventNameLower.includes('house');
  const isEngage = eventType === 'engagement' || eventIdLower.includes('engagement') || eventNameLower.includes('ភ្ជាប់ពាក្យ') || eventNameLower.includes('engage');

  const resolvedCategory = isBday ? 'birthday' : isHouse ? 'housewarming' : isEngage ? 'engagement' : 'wedding';

  const hostKhmerName = event?.groom?.trim() || '';

  const eventName =
    (isBday
      ? (hostKhmerName ? `ពិធីខួបកំណើត ${hostKhmerName}` : (event?.name || 'ពិធីខួបកំណើត'))
      : isHouse
      ? (hostKhmerName ? `ពិធីឡើងគេហដ្ឋានថ្មី ${hostKhmerName}` : (event?.name || 'ពិធីឡើងគេហដ្ឋានថ្មី'))
      : isEngage
      ? (event?.groom && event?.bride ? `ពិធីភ្ជាប់ពាក្យ ${event.groom} & ${event.bride}` : (event?.name || 'ពិធីភ្ជាប់ពាក្យ'))
      : (event?.singlePerson
        ? (hostKhmerName ? `កម្មវិធី ${hostKhmerName}` : (event?.name || 'លិខិតអញ្ជើញឌីជីថល'))
        : (event?.groom && event?.bride
        ? `អាពាហ៍ពិពាហ៍ ${event.groom} & ${event.bride}`
        : (event?.name || 'លិខិតអញ្ជើញឌីជីថល')))) ||
    'លិខិតអញ្ជើញឌីជីថល';

  let title = eventName;
  if (guestName && guestName !== 'Your Name') {
    title = `${eventName} - សូមគោរពអញ្ជើញ ${guestName}`;
  }

  let desc = `សូមគោរពអញ្ជើញ ${guestName || 'ភ្ញៀវកិត្តិយស'} ចូលរួមជាអធិបតី និងប្រសិទ្ធពរជ័យ`;
  if (isBday) {
    desc += ` ក្នុងពិធីខួបកំណើត ${event?.groom || eventName}`;
  } else if (isHouse) {
    desc += ` ក្នុងពិធីឡើងគេហដ្ឋានថ្មី ${event?.groom || eventName}`;
  } else if (isEngage) {
    desc += ` ក្នុងពិធីភ្ជាប់ពាក្យ ${event?.groom || ''} & ${event?.bride || ''}`;
  } else if (event?.groom && event?.bride && !event?.singlePerson) {
    desc += ` ក្នុងពិធីមង្គលការរវាង ${event.groom} & ${event.bride}`;
  } else if (event?.groom) {
    desc += ` ក្នុងកម្មវិធី ${event.groom}`;
  }

  if (event?.date) {
    desc += ` នៅថ្ងៃទី ${event.date}`;
  }
  if (event?.location?.name) {
    desc += ` ទីតាំង៖ ${event.location.name}`;
  }

  let coverImage =
    event?.image ||
    event?.cover_image ||
    event?.config?.photo_gallary?.photo1;

  if (
    !coverImage ||
    !coverImage.startsWith('http') ||
    coverImage.startsWith('data:') ||
    (resolvedCategory !== 'wedding' && coverImage.includes('491657278'))
  ) {
    coverImage = getCategoryCoverImage(resolvedCategory || eventIdLower);
  }

  let result = html;

  if (result.includes('<title>')) {
    result = result.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  } else {
    result = result.replace('</head>', `<title>${title}</title>\n</head>`);
  }

  const setMeta = (attr: string, key: string, content: string) => {
    const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`<meta\\s+${attr}="${escapedKey}"\\s+content=".*?"\\s*\\/?>`, 'i');
    if (regex.test(result)) {
      result = result.replace(regex, `<meta ${attr}="${key}" content="${content}" />`);
    } else {
      result = result.replace('</head>', `  <meta ${attr}="${key}" content="${content}" />\n</head>`);
    }
  };

  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:image', coverImage);
  setMeta('property', 'og:type', 'website');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', coverImage);

  return result;
}

function getSavedEvents(): Record<string, any> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(EVENTS_FILE)) {
      const content = fs.readFileSync(EVENTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading saved events file:', err);
  }
  return {};
}

function saveEvents(events: Record<string, any>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved events file:', err);
  }
}

function getSavedWishes(): any[] {
  try {
    if (fs.existsSync(WISHES_FILE)) {
      return JSON.parse(fs.readFileSync(WISHES_FILE, 'utf-8'));
    }
    const defaultWishes = [
      {
        id: 'w1',
        name: 'សុខ វិបុល (Sok Vibul)',
        relationship: 'មិត្តភក្តិ (Friend)',
        message: 'សូមជូនពរឱ្យប្អូនទាំងពីរមានសុភមង្គល ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង និងទទួលបានជោគជ័យគ្រប់ភារកិច្ច!',
        createdAt: '2026-01-02T08:30:00.000Z',
        likes: 12,
      },
      {
        id: 'w2',
        name: 'ចាន់ ស្រីមុំ (Chan Sreymom)',
        relationship: 'បងប្អូនជីដូនមួយ (Cousin)',
        message: 'រីករាយថ្ងៃមង្គលការបងម៉ាឡេ និងអូនវល្ខ័ក! សមគ្នាខ្លាំងណាស់ សូមឱ្យស្រឡាញ់គ្នាផ្អែមល្ហែមដូចទឹកឃ្មុំប្រចាំថ្ងៃណា៎ ❤️✨',
        createdAt: '2026-01-03T11:15:00.000Z',
        likes: 18,
      },
      {
        id: 'w3',
        name: 'រតនៈ ពិសិដ្ឋ (Rathana Piseth)',
        relationship: 'សហការី (Colleague)',
        message: 'Wishing both of you a lifetime of endless love, joy, good health, and prosperity! Happy Wedding!',
        createdAt: '2026-01-04T14:45:00.000Z',
        likes: 9,
      },
    ];
    saveWishes(defaultWishes);
    return defaultWishes;
  } catch (err) {
    console.error('Error reading saved wishes file:', err);
  }
  return [];
}

function saveWishes(wishes: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved wishes file:', err);
  }
}

function getSavedRSVPs(): any[] {
  try {
    if (fs.existsSync(RSVPS_FILE)) {
      return JSON.parse(fs.readFileSync(RSVPS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading saved RSVPs file:', err);
  }
  return [];
}

function saveRSVPs(rsvps: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved RSVPs file:', err);
  }
}

function getSavedGuests(): any[] {
  try {
    if (fs.existsSync(GUESTS_FILE)) {
      return JSON.parse(fs.readFileSync(GUESTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading saved guests file:', err);
  }
  return [];
}

function saveGuests(guests: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved guests file:', err);
  }
}

// API Routes FIRST before Vite middleware
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wishes API
app.get('/api/wishes', (req, res) => {
  const wishes = getSavedWishes();
  res.json({ success: true, wishes });
});

app.post('/api/wishes', (req, res) => {
  const wish = req.body;
  if (!wish || !wish.id) {
    return res.status(400).json({ error: 'Invalid wish data' });
  }
  const wishes = getSavedWishes();
  const existingIdx = wishes.findIndex((w: any) => w.id === wish.id);
  if (existingIdx >= 0) {
    wishes[existingIdx] = wish;
  } else {
    wishes.unshift(wish);
  }
  saveWishes(wishes);
  res.json({ success: true, wish });
});

app.delete('/api/wishes/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Invalid wish ID' });
  }
  let wishes = getSavedWishes();
  const initialLength = wishes.length;
  wishes = wishes.filter((w: any) => w.id !== id);
  saveWishes(wishes);
  res.json({ success: true, deleted: wishes.length < initialLength, id });
});

// RSVPs API
app.get('/api/rsvps', (req, res) => {
  const rsvps = getSavedRSVPs();
  res.json({ success: true, rsvps });
});

app.post('/api/rsvps', (req, res) => {
  const rsvp = req.body;
  if (!rsvp) {
    return res.status(400).json({ error: 'Invalid rsvp data' });
  }
  const rsvps = getSavedRSVPs();
  rsvps.push(rsvp);
  saveRSVPs(rsvps);
  res.json({ success: true, rsvp });
});

// Guests API
app.get('/api/guests', (req, res) => {
  const guests = getSavedGuests();
  res.json({ success: true, guests });
});

app.post('/api/guests', (req, res) => {
  const guest = req.body;
  if (!guest || !guest.id) {
    return res.status(400).json({ error: 'Invalid guest data' });
  }
  const guests = getSavedGuests();
  const existingIdx = guests.findIndex((g: any) => g.id === guest.id);
  if (existingIdx >= 0) {
    guests[existingIdx] = guest;
  } else {
    guests.push(guest);
  }
  saveGuests(guests);
  res.json({ success: true, guest });
});

app.delete('/api/guests', (req, res) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: 'Missing guest id' });
  }
  let guests = getSavedGuests();
  guests = guests.filter((g: any) => g.id !== id);
  saveGuests(guests);
  res.json({ success: true });
});

// Get Event by ID, Type, or default event
app.get('/api/event', (req, res) => {
  const eventId = req.query.id as string;
  const eventType = req.query.type as string;
  const events = getSavedEvents();
  
  // If specific ID is requested, return that specific template event
  if (eventId) {
    if (events[eventId]) {
      return res.json({ success: true, event: events[eventId], source: 'server', requestedId: eventId });
    }
    const preset = findTemplatePreset(eventId);
    if (preset) {
      return res.json({ success: true, event: preset.sampleEvent, source: 'preset', requestedId: eventId });
    }
    return res.json({ success: true, event: null, requestedId: eventId, source: 'not_found' });
  }

  // If template type is requested
  if (eventType) {
    if (events[`type_${eventType}`]) {
      return res.json({ success: true, event: events[`type_${eventType}`], source: 'server', requestedType: eventType });
    }
    const match = Object.values(events).find((e: any) => e?.eventType === eventType);
    if (match) {
      return res.json({ success: true, event: match, source: 'server', requestedType: eventType });
    }
    const preset = findTemplatePreset(eventType);
    if (preset) {
      return res.json({ success: true, event: preset.sampleEvent, source: 'preset', requestedType: eventType });
    }
    return res.json({ success: true, event: null, requestedType: eventType, source: 'not_found' });
  }
  
  // If no ID requested, check default or first saved
  if (events['default']) {
    return res.json({ success: true, event: events['default'], source: 'server' });
  }

  // If there is any saved event, use that
  const keys = Object.keys(events).filter(k => !k.startsWith('type_'));
  if (keys.length > 0) {
    return res.json({ success: true, event: events[keys[0]], source: 'server' });
  }

  // No custom event saved yet on server
  return res.json({ success: true, event: null, source: 'default' });
});

// List all saved template IDs on server
app.get('/api/templates', (req, res) => {
  const events = getSavedEvents();
  const list = Object.keys(events)
    .filter(key => !key.startsWith('type_') && key !== 'default')
    .map(key => ({
      key,
      id: events[key]?.id,
      name: events[key]?.name,
      eventType: events[key]?.eventType,
      updatedAt: events[key]?.updatedAt,
    }));
  res.json({ success: true, templates: list });
});

// Save or Update Event
app.post('/api/event', (req, res) => {
  const eventData = req.body;
  if (!eventData || typeof eventData !== 'object') {
    return res.status(400).json({ error: 'Invalid event data' });
  }

  const eventId = eventData.id || 'cmgrawhnk0003le0434762j7n';
  const eventType = eventData.eventType;
  const events = getSavedEvents();

  events[eventId] = eventData;
  if (eventType) {
    events[`type_${eventType}`] = eventData;
  }
  
  if (eventId === 'cmgrawhnk0003le0434762j7n') {
    events['default'] = eventData;
  } else {
    // Also update default if this was saved
    events['default'] = eventData;
    events['cmgrawhnk0003le0434762j7n'] = eventData;
  }

  saveEvents(events);
  res.json({ success: true, event: eventData });
});

app.post('/api/event/reset', (req, res) => {
  const eventId = req.body.id || 'cmgrawhnk0003le0434762j7n';
  const events = getSavedEvents();
  if (events[eventId]) {
    delete events[eventId];
  }
  // also delete default if it matches
  if (events['default'] && events['default'].id === eventId) {
    delete events['default'];
  }
  saveEvents(events);
  res.json({ success: true });
});

    // In-app short link endpoint with full Open Graph metadata preview for Telegram, Facebook, Messenger
app.get('/s/:code', (req, res, next) => {
  const code = req.params.code;
  const links = getShortLinks();
  const target = links[code];

  if (target) {
    let cleanTarget = target;
    if (cleanTarget.includes('localhost') || cleanTarget.includes('127.0.0.1')) {
      cleanTarget = cleanTarget.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
    }
    if (cleanTarget.includes('ais-dev-')) {
      cleanTarget = cleanTarget.replace('ais-dev-', 'ais-pre-');
    }

    // Merge any query params from request (e.g. /s/code?name=...)
    try {
      const urlObj = new URL(cleanTarget);
      for (const [key, val] of Object.entries(req.query)) {
        if (typeof val === 'string') {
          urlObj.searchParams.set(key, val);
        }
      }
      cleanTarget = urlObj.toString();
    } catch {
      // ignore
    }

    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isSocialBot =
      userAgent.includes('telegrambot') ||
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('facebot') ||
      userAgent.includes('twitterbot') ||
      userAgent.includes('whatsapp') ||
      userAgent.includes('slackbot') ||
      userAgent.includes('linkedinbot') ||
      userAgent.includes('discordbot') ||
      userAgent.includes('viber');

    // Extract guest name from target URL if present
    let guestName: string | null = null;
    try {
      const parsed = new URL(cleanTarget);
      guestName = parsed.searchParams.get('name') || parsed.searchParams.get('i') || parsed.searchParams.get('guest') || parsed.searchParams.get('to');
    } catch (e) {
      // ignore
    }

    // If it's a social media bot, render rich Open Graph HTML so the telegram preview shows the guest name
    if (isSocialBot) {
      const indexPath = process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'dist', 'index.html')
        : path.join(process.cwd(), 'index.html');

      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        const events = getSavedEvents();
        const customEvent = events['default'] || Object.values(events)[0];
        html = getInjectedHtml(html, guestName, customEvent);
        // Add direct client redirect for bots that execute JS
        html = html.replace('</head>', `<meta http-equiv="refresh" content="0;url=${cleanTarget}" /></head>`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
    }

    return res.redirect(302, cleanTarget);
  }

  return res.redirect(302, PUBLIC_APP_URL);
});

// API endpoint to shorten a URL
app.post('/api/shorten', async (req, res) => {
  const { url, origin: clientOrigin } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    let cleanUrl = url;
    if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
      cleanUrl = cleanUrl.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
    }
    if (cleanUrl.includes('ais-dev-')) {
      cleanUrl = cleanUrl.replace('ais-dev-', 'ais-pre-');
    }

    // Determine public origin: NEVER use localhost or dev domain
    let baseOrigin = PUBLIC_APP_URL;
    if (
      clientOrigin &&
      typeof clientOrigin === 'string' &&
      clientOrigin.startsWith('http') &&
      !clientOrigin.includes('localhost') &&
      !clientOrigin.includes('127.0.0.1')
    ) {
      baseOrigin = clientOrigin;
    }

    if (baseOrigin.includes('ais-dev-')) {
      baseOrigin = baseOrigin.replace('ais-dev-', 'ais-pre-');
    }

    // Check if an identical URL is already cached/saved
    const existingLinks = getShortLinks();
    for (const [existingCode, targetUrl] of Object.entries(existingLinks)) {
      if (targetUrl === cleanUrl) {
        const cachedShortUrl = `${baseOrigin}/s/${existingCode}`;
        return res.json({
          success: true,
          shortUrl: cachedShortUrl,
          internalShortUrl: cachedShortUrl,
          code: existingCode,
          provider: 'cached',
        });
      }
    }

    // Generate clean in-app short code: /s/:code
    let code = '';
    try {
      const urlObj = new URL(cleanUrl);
      const nameParam = urlObj.searchParams.get('name');
      if (nameParam) {
        const cleanName = nameParam.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
        const rand = Math.random().toString(36).substring(2, 6);
        code = cleanName ? `${cleanName}-${rand}` : rand;
      }
    } catch {
      // url parse error, fallback
    }

    if (!code) {
      code = Math.random().toString(36).substring(2, 8);
    }

    saveShortLink(code, cleanUrl);

    const internalShortUrl = `${baseOrigin}/s/${code}`;

    return res.json({
      success: true,
      shortUrl: internalShortUrl,
      internalShortUrl,
      code,
      provider: 'internal',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  // In development, mount Vite custom SSR transform middleware
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      // Ignore API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);

        const guestName = (req.query.name || req.query.i || req.query.guest || req.query.to) as string;
        const eventId = (req.query.id || req.query.type) as string;
        const events = getSavedEvents();

        let targetEvent: any = null;
        if (eventId) {
          targetEvent = events[eventId] || events[`type_${eventId}`];
          if (!targetEvent) {
            const preset = findTemplatePreset(eventId);
            if (preset) targetEvent = preset.sampleEvent;
          }
        }
        if (!targetEvent) {
          targetEvent = events['default'] || Object.values(events)[0];
        }
        if (!targetEvent && eventId) {
          const preset = findTemplatePreset(eventId);
          if (preset) targetEvent = preset.sampleEvent;
        }

        const html = getInjectedHtml(template, guestName, targetEvent, eventId);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // In production, serve compiled static assets from dist
    const possibleDistPaths = [
      path.join(process.cwd(), 'dist'),
      path.resolve(__dirname),
      path.resolve(__dirname, '..', 'dist'),
    ];
    const distPath = possibleDistPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || path.join(process.cwd(), 'dist');

    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        const guestName = (req.query.name || req.query.i || req.query.guest || req.query.to) as string;
        const eventId = (req.query.id || req.query.type) as string;
        const events = getSavedEvents();

        let targetEvent: any = null;
        if (eventId) {
          targetEvent = events[eventId] || events[`type_${eventId}`];
          if (!targetEvent) {
            const preset = findTemplatePreset(eventId);
            if (preset) targetEvent = preset.sampleEvent;
          }
        }
        if (!targetEvent) {
          targetEvent = events['default'] || Object.values(events)[0];
        }
        if (!targetEvent && eventId) {
          const preset = findTemplatePreset(eventId);
          if (preset) targetEvent = preset.sampleEvent;
        }

        html = getInjectedHtml(html, guestName, targetEvent, eventId);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wedding App Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
