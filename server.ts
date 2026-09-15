import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';


const app = express();

const PORT = 3000;

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

function getInjectedHtml(html: string, guestName: string | null, event: any): string {
  let title = event?.name || 'លិខិតអញ្ជើញអាពាហ៍ពិពាហ៍';
  if (guestName) {
    title = `${guestName} - ${title}`;
  }
  let desc = `សូមគោរពអញ្ជើញ ${guestName || 'ភ្ញៀវកិត្តិយស'} ចូលរួមជាអធិបតី និងប្រសិទ្ធពរជ័យ`;
  if (event?.groom && event?.bride) {
    desc += ` ក្នុងពិធីមង្គលការរវាង ${event.groom} & ${event.bride}`;
  }
  if (event?.date) {
    desc += ` នៅថ្ងៃទី ${event.date}`;
  }
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);
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
    // Return null so the client knows this specific template has not been customized on server yet
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
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        const guestName = (req.query.name || req.query.i || req.query.guest || req.query.to) as string;
        const events = getSavedEvents();
        const customEvent = events['default'] || Object.values(events)[0];
        html = getInjectedHtml(html, guestName, customEvent);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wedding App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
