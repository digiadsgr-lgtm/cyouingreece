const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream("public/beach.jpg");
https.get("https://images.unsplash.com/photo-1522513476839-4d693f1fa68c?q=80&w=2000&auto=format&fit=crop", function(response) {
  response.pipe(file);
});
