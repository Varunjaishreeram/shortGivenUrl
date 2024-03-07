require('dotenv').config();
const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const app = express();
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
const urlDatabase = {};

// Endpoint to handle URL shortening
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  console.log(url)

  // Check if URL is valid
  if (!validUrl.isWebUri(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL
  const shortUrl = shortid.generate();

  // Store original URL and short URL in the database
  urlDatabase[shortUrl] = url;

  res.json({ original_url: url, short_url: shortUrl });
});

// Endpoint to handle redirection to original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;

  // Check if short URL exists in the database
  if (!urlDatabase.hasOwnProperty(shortUrl)) {
    return res.json({ error: 'invalid short url' });
  }

  // Redirect to the original URL
  res.redirect(urlDatabase[shortUrl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
