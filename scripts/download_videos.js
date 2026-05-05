const fs = require('fs');
const https = require('https');
const path = require('path');

const videos = [
  {
    name: 'island.mp4',
    url: 'https://cdn.pixabay.com/video/2020/05/24/40061-424756592_tiny.mp4' // Santorini/Sea style
  },
  {
    name: 'city.mp4',
    url: 'https://cdn.pixabay.com/video/2019/08/21/26193-354923364_tiny.mp4' // City/Athens style
  },
  {
    name: 'mountain.mp4',
    url: 'https://cdn.pixabay.com/video/2021/08/17/85378-590059293_tiny.mp4' // Mountain style
  }
];

async function downloadVideo(url, filename) {
  const dest = path.join(__dirname, '..', 'public', 'videos', filename);
  const file = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 206) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
          console.log(`✅ Downloaded ${filename}`);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log('Downloading local fallback videos...');
  for (const v of videos) {
    try {
      await downloadVideo(v.url, v.name);
    } catch (e) {
      console.error(`❌ Error downloading ${v.name}:`, e.message);
    }
  }
}

run();
