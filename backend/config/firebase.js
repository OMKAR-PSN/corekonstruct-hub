const admin = require('firebase-admin');

// Ensure the service account JSON string exists in .env
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.warn('⚠️   FIREBASE_SERVICE_ACCOUNT_JSON not set.');
  console.warn('     Get the JSON from Firebase Console -> Project Settings -> Service Accounts, stringify it, and add to .env');
  module.exports = null;
} else {
  try {
    let rawStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    // If dotenv corrupted the backslashes inside private_key by turning them into real newlines
    // we can attempt to reconstruct it by matching the private key format.
    if (rawStr.includes('-----BEGIN PRIVATE KEY-----') && rawStr.includes('\\n')) {
       // It's probably already fine, let JSON.parse handle it.
       // However, if parsing fails, we will try to fix the newlines.
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(rawStr);
    } catch (e) {
      // If parsing fails, it's usually because dotenv evaluated '\\n' as an actual newline
      // inside the private_key JSON string, breaking JSON spec.
      // We'll replace actual newlines with the literal characters '\\n'
      const sanitizedStr = rawStr.replace(/\n/g, '\\n').replace(/\r/g, '');
      serviceAccount = JSON.parse(sanitizedStr);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅  Firebase connected.');
    module.exports = admin.firestore();
  } catch (err) {
    console.error('❌  Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. Ensure it is valid JSON.');
    module.exports = null;
  }
}
