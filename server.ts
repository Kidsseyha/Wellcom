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

// API Routes FIRST before Vite middleware
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get Event by ID or default event
app.get('/api/event', (req, res) => {
  const eventId = (req.query.id as string) || 'cmgrawhnk0003le0434762j7n';
  const events = getSavedEvents();
  
  // Return specific event, or fallback to the latest saved event if any
  if (events[eventId]) {
    return res.json({ success: true, event: events[eventId], source: 'server' });
  }
  
  // If there is any saved event (e.g. 'default' or single wedding), use that
  const keys = Object.keys(events);
  if (keys.length > 0) {
    return res.json({ success: true, event: events[keys[0]], source: 'server' });
  }

  // No custom event saved yet on server
  return res.json({ success: true, event: null, source: 'default' });
});

// Save or Update Event
app.post('/api/event', (req, res) => {
  const eventData = req.body;
  if (!eventData || typeof eventData !== 'object') {
    return res.status(400).json({ error: 'Invalid event data' });
  }

  const eventId = eventData.id || 'cmgrawhnk0003le0434762j7n';
  const events = getSavedEvents();
  events[eventId] = eventData;
  events['default'] = eventData; // also store as default fallback
  saveEvents(events);

  console.log(`[API] Event ${eventId} saved successfully by host.`);
  return res.json({ success: true, id: eventId, event: eventData });
});

// Reset event on server
app.post('/api/event/reset', (req, res) => {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      fs.unlinkSync(EVENTS_FILE);
    }
  } catch (err) {
    console.error('Error resetting event:', err);
  }
  return res.json({ success: true, message: 'Server event reset to default' });
});

const PUBLIC_APP_URL = 'https://ais-pre-oi572nxogafsw6nsowqaaj-935767504529.asia-southeast1.run.app';

// Short links storage
const SHORT_LINKS_FILE = path.join(DATA_DIR, 'short_links.json');
function getShortLinks(): Record<string, string> {
  try {
    if (fs.existsSync(SHORT_LINKS_FILE)) {
      const raw = fs.readFileSync(SHORT_LINKS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      let modified = false;
      for (const k of Object.keys(data)) {
        if (typeof data[k] === 'string') {
          if (data[k].includes('localhost') || data[k].includes('127.0.0.1')) {
            data[k] = data[k].replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
            modified = true;
          }
          if (data[k].includes('ais-dev-')) {
            data[k] = data[k].replace('ais-dev-', 'ais-pre-');
            modified = true;
          }
        }
      }
      if (modified) {
        fs.writeFileSync(SHORT_LINKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
      return data;
    }
  } catch (e) {
    console.error('Error reading short links:', e);
  }
  return {};
}

function saveShortLink(code: string, originalUrl: string) {
  try {
    let cleanUrl = originalUrl;
    if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
      cleanUrl = cleanUrl.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
    }
    if (cleanUrl.includes('ais-dev-')) {
      cleanUrl = cleanUrl.replace('ais-dev-', 'ais-pre-');
    }
    const links = getShortLinks();
    links[code] = cleanUrl;
    fs.writeFileSync(SHORT_LINKS_FILE, JSON.stringify(links, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving short link:', e);
  }
}

function getInjectedHtml(originalHtml: string, guestName?: string | null, customEvent?: any): string {
  let title = 'អាពាហ៍ពិពាហ៍ ម៉ាឡេ & វល្ខ័ក';
  let desc = 'សូមគោរពអញ្ជើញ - លិខិតអញ្ជើញអាពាហ៍ពិពាហ៍ ម៉ាឡេ & វល្ខ័ក Plan Essential Digital Invitation';

  if (customEvent && customEvent.config) {
    const groom = customEvent.config.groom_name_kh || customEvent.config.groom_name_en || 'ម៉ាឡេ';
    const bride = customEvent.config.bride_name_kh || customEvent.config.bride_name_en || 'វល្ខ័ក';
    title = `អាពាហ៍ពិពាហ៍ ${groom} & ${bride}`;
  }

  if (guestName && guestName.trim() && guestName !== 'Your Name') {
    desc = `សូមគោរពអញ្ជើញ ${guestName.trim()} - លិខិតអញ្ជើញ${title} Plan Essential Digital Invitation`;
  } else {
    desc = `សូមគោរពអញ្ជើញ ភ្ញៀវកិត្តិយស - លិខិតអញ្ជើញ${title} Plan Essential Digital Invitation`;
  }

  return originalHtml
    .replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`)
    .replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${desc}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta property="twitter:title" content=".*?" \/>/gi, `<meta property="twitter:title" content="${title}" />`)
    .replace(/<meta property="twitter:description" content=".*?" \/>/gi, `<meta property="twitter:description" content="${desc}" />`);
}

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
