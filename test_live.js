const https = require('https');

https.get('https://cyouingreece.com', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { 
    console.log("fo-verify exists?", data.includes('fo-verify'));
    console.log(data.substring(0, 800));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
