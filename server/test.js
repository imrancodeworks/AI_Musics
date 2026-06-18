const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const payload = `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\ntest\r\n--${boundary}\r\nContent-Disposition: form-data; name="artist"\r\n\r\ntester\r\n--${boundary}\r\nContent-Disposition: form-data; name="duration"\r\n\r\n100\r\n--${boundary}--\r\n`;

const req = http.request({
  hostname: 'localhost',
  port: 3002,
  path: '/api/songs',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', body));
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
