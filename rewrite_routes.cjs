const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const preRoutes = content.split('// API Routes FIRST before Vite middleware')[0];
const postRoutes = content.split('// In-app short link endpoint')[1];

const newRoutes = `// API Routes FIRST before Vite middleware
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wishes API
app.get('/api/wishes', async (req, res) => {
  try {
    const wishes = await WishModel.find().sort({ _id: -1 }).lean();
    res.json({ success: true, wishes: wishes.length ? wishes : getSavedWishes() });
  } catch(e) {
    res.json({ success: true, wishes: getSavedWishes() });
  }
});
app.post('/api/wishes', async (req, res) => {
  const wish = req.body;
  if (!wish || !wish.id) return res.status(400).json({ error: 'Invalid wish data' });
  try {
    await WishModel.findOneAndUpdate({ id: wish.id }, wish, { upsert: true, new: true });
  } catch(e) {}
  res.json({ success: true, wish });
});

// RSVPs API
app.get('/api/rsvps', async (req, res) => {
  try {
    const rsvps = await RSVPModel.find().sort({ _id: 1 }).lean();
    res.json({ success: true, rsvps: rsvps.length ? rsvps : getSavedRSVPs() });
  } catch(e) {
    res.json({ success: true, rsvps: getSavedRSVPs() });
  }
});
app.post('/api/rsvps', async (req, res) => {
  const rsvp = req.body;
  if (!rsvp) return res.status(400).json({ error: 'Invalid rsvp data' });
  if(!rsvp.id) rsvp.id = 'rsvp-' + Date.now();
  try {
    await RSVPModel.findOneAndUpdate({ id: rsvp.id }, rsvp, { upsert: true, new: true });
  } catch(e) {}
  res.json({ success: true, rsvp });
});

// Guests API
app.get('/api/guests', async (req, res) => {
  try {
    const guests = await GuestModel.find().lean();
    res.json({ success: true, guests: guests.length ? guests : getSavedGuests() });
  } catch(e) {
    res.json({ success: true, guests: getSavedGuests() });
  }
});
app.post('/api/guests', async (req, res) => {
  const guest = req.body;
  if (!guest || !guest.id) return res.status(400).json({ error: 'Invalid guest data' });
  try {
    await GuestModel.findOneAndUpdate({ id: guest.id }, guest, { upsert: true, new: true });
  } catch(e) {}
  res.json({ success: true, guest });
});
app.delete('/api/guests', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Missing guest id' });
  try {
    await GuestModel.findOneAndDelete({ id });
  } catch(e) {}
  res.json({ success: true });
});

// Get Event by ID, Type, or default event
app.get('/api/event', async (req, res) => {
  const eventId = req.query.id;
  const eventType = req.query.type;
  try {
    if (eventId) {
      const dbEvent = await EventModel.findOne({ id: eventId }).lean();
      if (dbEvent) {
        delete dbEvent._id;
        return res.json({ success: true, event: dbEvent, source: 'mongodb', requestedId: eventId });
      }
    }
    if (eventType) {
      const dbEvent = await EventModel.findOne({ eventType }).sort({ updatedAt: -1 }).lean();
      if (dbEvent) {
        delete dbEvent._id;
        return res.json({ success: true, event: dbEvent, source: 'mongodb', requestedType: eventType });
      }
    }
    const dbDefault = await EventModel.findOne({ id: 'cmgrawhnk0003le0434762j7n' }).lean() || await EventModel.findOne().lean();
    if(dbDefault) {
      delete dbDefault._id;
      return res.json({ success: true, event: dbDefault, source: 'mongodb' });
    }
  } catch (e) {
    console.error('Mongo error in get event:', e);
  }
  return res.json({ success: true, event: null, source: 'not_found' });
});

app.get('/api/templates', async (req, res) => {
  try {
    const list = await EventModel.find({}).select('id name eventType updatedAt').lean();
    res.json({ success: true, templates: list.map(t => ({ ...t, key: t.id })) });
  } catch (e) {
    res.json({ success: true, templates: [] });
  }
});

app.post('/api/event', async (req, res) => {
  const eventData = req.body;
  if (!eventData || typeof eventData !== 'object') {
    return res.status(400).json({ error: 'Invalid event data' });
  }
  const eventId = eventData.id || 'cmgrawhnk0003le0434762j7n';
  
  try {
    await EventModel.findOneAndUpdate({ id: eventId }, eventData, { upsert: true, new: true });
    if(eventId !== 'cmgrawhnk0003le0434762j7n') {
      await EventModel.findOneAndUpdate({ id: 'cmgrawhnk0003le0434762j7n' }, eventData, { upsert: true });
    }
  } catch(e) {
    console.error('Mongo error in post event:', e);
  }
  res.json({ success: true, event: eventData });
});

app.post('/api/event/reset', async (req, res) => {
  const eventId = req.body.id || 'cmgrawhnk0003le0434762j7n';
  try {
    await EventModel.findOneAndDelete({ id: eventId });
  } catch (e) {}
  res.json({ success: true });
});

// In-app short link endpoint`;

fs.writeFileSync('server.ts', preRoutes + newRoutes + postRoutes);
