const fs = require('fs');
let envContent = fs.readFileSync('.env', 'utf8');

const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_JSON=([\s\S]+)/);
if (match) {
  try {
    let rawStr = match[1].trim();
    
    // Evaluate the literal string that was pasted in the .env to get the JS object
    let parsed;
    eval('parsed = ' + rawStr); 
    
    // Stringify it perfectly onto one line
    const cleanStr = JSON.stringify(parsed);
    
    // Wrap it in SINGLE quotes so dotenv doesn't process escape sequences (\n becomes actual newlines)
    const newConfig = 'FIREBASE_SERVICE_ACCOUNT_JSON=\\'' + cleanStr.replace(/'/g, "\\\\'") + '\\'';
    
    envContent = envContent.replace(match[0], newConfig);
    fs.writeFileSync('.env', envContent);
    console.log('✅ Successfully fixed the Firebase JSON formatting in .env!');
  } catch(e) {
    console.error('Failed to auto-fix .env:', e);
  }
}
