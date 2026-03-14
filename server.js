require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/claude', async (req, res) => {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await r.json();
  res.json(data);
});

app.get('/api/places/nearby', async (req, res) => {
  const { location, radius, rankby, type } = req.query;
  const params = new URLSearchParams({ location, type, key: process.env.GOOGLE_KEY });
  if (radius) params.set('radius', radius);
  if (rankby) params.set('rankby', rankby);
  const r = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + params);
  const data = await r.json();
  res.json(data);
});

app.get('/api/places/details', async (req, res) => {
  const { place_id, fields } = req.query;
  const params = new URLSearchParams({ place_id, key: process.env.GOOGLE_KEY });
  if (fields) params.set('fields', fields);
  const r = await fetch('https://maps.googleapis.com/maps/api/place/details/json?' + params);
  const data = await r.json();
  res.json(data);
});

if (require.main === module) {
  app.listen(3000, () => console.log('Open http://localhost:3000'));
}

module.exports = app;
