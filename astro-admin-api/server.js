const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// CHANGE THIS PATH to match your Astro project directory:
const contentPath = path.join(__dirname, '../src/content/post');

app.post('/api/create-post', (req, res) => {
  const { title, description, tags, content } = req.body;

  const formattedDate = formatDate(new Date());

  const metadata = `---
title: "${title}"
description: "${description}"
publishDate: "${formattedDate}"
tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]
---
  
  ${content}
  `;

  const filename = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '') + '.md';

  const filepath = path.join(contentPath, filename);

  fs.writeFile(filepath, metadata, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating markdown file');
    }
    res.send('✅ Post created successfully!');
  });
});


app.listen(4000, () => {
  console.log('🚀 Express API running at http://localhost:4000');
});

function formatDate(date) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
