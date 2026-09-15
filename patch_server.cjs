const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

// Add import
const importStr = "import { connectDB, EventModel, WishModel, RSVPModel, GuestModel } from './server/db.js';\n";
content = content.replace("const app = express();", importStr + "\nconst app = express();\nconnectDB();\n");

// Replace getSavedEvents, saveEvents, etc with async/await versions or just leave the JSON as fallback 
// actually I'll just rewrite the endpoints.
content = content.replace(
  /app\.get\('\/api\/wishes'.*?\}\);/s,
  `app.get('/api/wishes', async (req, res) => {
  try {
    const wishes = await WishModel.find().sort({ _id: -1 }).lean();
    res.json({ success: true, wishes: wishes.length ? wishes : getSavedWishes() });
  } catch(e) {
    res.json({ success: true, wishes: getSavedWishes() });
  }
});`
);

content = content.replace(
  /app\.post\('\/api\/wishes'.*?\}\);/s,
  `app.post('/api/wishes', async (req, res) => {
  const wish = req.body;
  if (!wish || !wish.id) return res.status(400).json({ error: 'Invalid wish data' });
  try {
    await WishModel.findOneAndUpdate({ id: wish.id }, wish, { upsert: true, new: true });
  } catch(e) {}
  const wishes = getSavedWishes();
  const existingIdx = wishes.findIndex((w: any) => w.id === wish.id);
  if (existingIdx >= 0) wishes[existingIdx] = wish;
  else wishes.unshift(wish);
  saveWishes(wishes);
  res.json({ success: true, wish });
});`
);

content = content.replace(
  /app\.get\('\/api\/rsvps'.*?\}\);/s,
  `app.get('/api/rsvps', async (req, res) => {
  try {
    const rsvps = await RSVPModel.find().sort({ _id: 1 }).lean();
    res.json({ success: true, rsvps: rsvps.length ? rsvps : getSavedRSVPs() });
  } catch(e) {
    res.json({ success: true, rsvps: getSavedRSVPs() });
  }
});`
);

content = content.replace(
  /app\.post\('\/api\/rsvps'.*?\}\);/s,
  `app.post('/api/rsvps', async (req, res) => {
  const rsvp = req.body;
  if (!rsvp) return res.status(400).json({ error: 'Invalid rsvp data' });
  if(!rsvp.id) rsvp.id = 'rsvp-' + Date.now();
  try {
    await RSVPModel.findOneAndUpdate({ id: rsvp.id }, rsvp, { upsert: true, new: true });
  } catch(e) {}
  const rsvps = getSavedRSVPs();
  rsvps.push(rsvp);
  saveRSVPs(rsvps);
  res.json({ success: true, rsvp });
});`
);

content = content.replace(
  /app\.get\('\/api\/guests'.*?\}\);/s,
  `app.get('/api/guests', async (req, res) => {
  try {
    const guests = await GuestModel.find().lean();
    res.json({ success: true, guests: guests.length ? guests : getSavedGuests() });
  } catch(e) {
    res.json({ success: true, guests: getSavedGuests() });
  }
});`
);

content = content.replace(
  /app\.post\('\/api\/guests'.*?\}\);/s,
  `app.post('/api/guests', async (req, res) => {
  const guest = req.body;
  if (!guest || !guest.id) return res.status(400).json({ error: 'Invalid guest data' });
  try {
    await GuestModel.findOneAndUpdate({ id: guest.id }, guest, { upsert: true, new: true });
  } catch(e) {}
  const guests = getSavedGuests();
  const existingIdx = guests.findIndex((g: any) => g.id === guest.id);
  if (existingIdx >= 0) guests[existingIdx] = guest;
  else guests.push(guest);
  saveGuests(guests);
  res.json({ success: true, guest });
});`
);

content = content.replace(
  /app\.delete\('\/api\/guests'.*?\}\);/s,
  `app.delete('/api/guests', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Missing guest id' });
  try {
    await GuestModel.findOneAndDelete({ id });
  } catch(e) {}
  let guests = getSavedGuests();
  guests = guests.filter((g: any) => g.id !== id);
  saveGuests(guests);
  res.json({ success: true });
});`
);

content = content.replace(
  /app\.get\('\/api\/event'.*?\}\);/s,
  `app.get('/api/event', async (req, res) => {
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

  // Fallback to JSON
  const events = getSavedEvents();
  if (eventId) {
    if (events[eventId]) return res.json({ success: true, event: events[eventId], source: 'server', requestedId: eventId });
    return res.json({ success: true, event: null, requestedId: eventId, source: 'not_found' });
  }
  if (eventType) {
    if (events[\`type_\${eventType}\`]) return res.json({ success: true, event: events[\`type_\${eventType}\`], source: 'server', requestedType: eventType });
    const match = Object.values(events).find((e: any) => e?.eventType === eventType);
    if (match) return res.json({ success: true, event: match, source: 'server', requestedType: eventType });
    return res.json({ success: true, event: null, requestedType: eventType, source: 'not_found' });
  }
  if (events['default']) return res.json({ success: true, event: events['default'], source: 'server' });
  const keys = Object.keys(events).filter(k => !k.startsWith('type_'));
  if (keys.length > 0) return res.json({ success: true, event: events[keys[0]], source: 'server' });
  return res.json({ success: true, event: null, source: 'default' });
});`
);

content = content.replace(
  /app\.post\('\/api\/event'.*?\}\);/s,
  `app.post('/api/event', async (req, res) => {
  const eventData = req.body;
  if (!eventData || typeof eventData !== 'object') {
    return res.status(400).json({ error: 'Invalid event data' });
  }
  const eventId = eventData.id || 'cmgrawhnk0003le0434762j7n';
  const eventType = eventData.eventType;
  
  try {
    await EventModel.findOneAndUpdate({ id: eventId }, eventData, { upsert: true, new: true });
    if(eventId !== 'cmgrawhnk0003le0434762j7n') {
      await EventModel.findOneAndUpdate({ id: 'cmgrawhnk0003le0434762j7n' }, eventData, { upsert: true });
    }
  } catch(e) {
    console.error('Mongo error in post event:', e);
  }
  
  const events = getSavedEvents();
  events[eventId] = eventData;
  if (eventType) events[\`type_\${eventType}\`] = eventData;
  events['default'] = eventData;
  saveEvents(events);
  res.json({ success: true, event: eventData });
});`
);


fs.writeFileSync('server.ts', content);
