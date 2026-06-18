const http = require('http');
const fs = require('fs');

fs.writeFileSync('dummy.mp3', Buffer.from([0,1,2,3]));

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const payload1 = `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\ntest\r\n--${boundary}\r\nContent-Disposition: form-data; name="audioFile"; filename="dummy.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n` + fs.readFileSync('dummy.mp3') + `\r\n--${boundary}--\r\n`;

const req = http.request({
  hostname: 'localhost',
  port: 3002,
  path: '/api/songs',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(payload1)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', body));
});

req.on('error', e => console.error(e));
req.write(payload1);
req.end();
