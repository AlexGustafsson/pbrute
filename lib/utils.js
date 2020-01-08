/* globals window */

// Divide two BigInts without rounding
function integerDivision(a, b) {
  return (((a * 10n) / b) - 5n) / 10n;
}

// Perform a HTTPS GET request on Node or in the browser
function request(path) {
  if (typeof window === 'object')
    return window.fetch(path).then(response => response.text());

  const https = require('https');

  return new Promise((resolve, reject) => {
    const request = https.get(path, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data.replace(/\r\n/g, '\n'));
      });
    });

    request.on('error', error => reject(error));
  });
}

// Hash using SHA-1 on Node or in the browser
async function sha1(data) {
  if (typeof window === 'object') {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const digest = await window.crypto.subtle.digest('SHA-1', buffer);
    const digestArray = [...new Uint8Array(digest)];
    const hex = digestArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hex;
  }

  const crypto = require('crypto');
  const shasum = crypto.createHash('sha1');
  shasum.update(data);
  return shasum.digest('hex');
}

module.exports = {
  integerDivision,
  request,
  sha1
};
