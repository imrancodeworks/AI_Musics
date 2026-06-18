const http = require('http');
const fs = require('fs');

// Create minimal valid MP3 (ID3 header + empty frame)
const mp3Buffer = Buffer.from('ID3' + '\x03\x00\x00\x00\x00\x00\x00' + '\xff\xfb\x90\x44\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00', 'binary');
fs.writeFileSync('valid.mp3', mp3Buffer);

// Create minimal valid GIF/JPG (1x1 transparent gif)
const imgBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
fs.writeFileSync('valid.gif', imgBuffer);

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const payload = `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nCrashTest\r\n` +
`--${boundary}\r\nContent-Disposition: form-data; name="artist"\r\n\r\nTester\r\n` +
`--${boundary}\r\nContent-Disposition: form-data; name="duration"\r\n\r\n10\r\n` +
`--${boundary}\r\nContent-Disposition: form-data; name="audioFile"; filename="valid.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n` + fs.readFileSync('valid.mp3', 'binary') + `\r\n` +
`--${boundary}\r\nContent-Disposition: form-data; name="coverFile"; filename="valid.gif"\r\nContent-Type: image/gif\r\n\r\n` + fs.readFileSync('valid.gif', 'binary') + `\r\n` +
`--${boundary}--\r\n`;

const req = http.request({
  hostname: 'localhost',
  port: 3002,
  path: '/api/songs',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': payload.length
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', body));
});

req.on('error', e => console.error(e));
req.write(payload, 'binary');
req.end();
