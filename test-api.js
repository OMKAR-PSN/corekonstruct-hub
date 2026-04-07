// RUN THIS FILE TO TEST FIREBASE: node test-api.js

const http = require('http');

const data = JSON.stringify({
  companyName: "CoreKonstruct Demo",
  name: "Admin User",
  email: "admin@test.com",
  password: "Password123"
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`\n=== API RESPONSE (${res.statusCode}) ===\n`);
    try {
      console.log(JSON.stringify(JSON.parse(body), null, 2));
      if (res.statusCode === 201) {
        console.log('\n✅ FIREBASE WORKS! The user was registered in Firestore.');
        console.log('👉 Now go to http://localhost:3000/login.html and login with: admin@test.com / Password123\n');
      } else {
        console.log('\n❌ Registration failed. Check the error above. Ensure Firebase JSON is correct in .env.\n');
      }
    } catch {
      console.log(body);
    }
  });
});

req.on('error', error => console.error('Error hitting API:', error));
req.write(data);
req.end();
