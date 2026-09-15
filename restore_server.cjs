const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Strip out mongoose import
content = content.replace("import { connectDB, EventModel, WishModel, RSVPModel, GuestModel } from './server/db.js';\n", "");
content = content.replace("connectDB();\n", "");

const preRoutes = content.split('// API Routes FIRST before Vite middleware')[0];
const postRoutes = content.split('// In-app short link endpoint')[1];

const newRoutes = `// API Routes FIRST before Vite middleware
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
  const id = req.query.id;
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
  const eventId = req.query.id;
  const eventType = req.query.type;
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
    if (events[\`type_\${eventType}\`]) {
      return res.json({ success: true, event: events[\`type_\${eventType}\`], source: 'server', requestedType: eventType });
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
    events[\`type_\${eventType}\`] = eventData;
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

// In-app short link endpoint`;

fs.writeFileSync('server.ts', preRoutes + newRoutes + postRoutes);
