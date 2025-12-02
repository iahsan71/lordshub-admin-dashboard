/**
 * Simple test script to verify Telegram bot is working
 * Run with: node test-telegram.js
 */

const https = require('https');

const BOT_TOKEN = '8046918233:AAEBiPcv-bPo2426MU6qKjRrNdvfkIf3NZ0';
const ADMIN_ID = '6331413591';

function makeRequest(method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/${method}`,
      method: data ? 'POST' : 'GET',
      headers: data ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      } : {}
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🤖 Testing Telegram Bot Integration\n');

  try {
    // Test 1: Get bot info
    console.log('1️⃣ Testing bot connection...');
    const botInfo = await makeRequest('getMe');
    if (botInfo.ok) {
      console.log('✅ Bot connected:', botInfo.result.username);
      console.log('   Bot ID:', botInfo.result.id);
      console.log('   Bot Name:', botInfo.result.first_name);
    } else {
      console.log('❌ Failed to connect to bot');
      return;
    }

    // Test 2: Check webhook
    console.log('\n2️⃣ Checking webhook status...');
    const webhookInfo = await makeRequest('getWebhookInfo');
    if (webhookInfo.ok) {
      const info = webhookInfo.result;
      console.log('✅ Webhook info:');
      console.log('   URL:', info.url || '(not set)');
      console.log('   Pending updates:', info.pending_update_count);
      if (info.last_error_message) {
        console.log('   ⚠️  Last error:', info.last_error_message);
      }
    }

    // Test 3: Send test message
    console.log('\n3️⃣ Sending test message to admin...');
    const testMessage = await makeRequest('sendMessage', {
      chat_id: ADMIN_ID,
      text: '🧪 Test message from setup script\n\nIf you see this, the bot is working correctly!'
    });
    
    if (testMessage.ok) {
      console.log('✅ Test message sent successfully!');
      console.log('   Message ID:', testMessage.result.message_id);
    } else {
      console.log('❌ Failed to send test message');
      console.log('   Error:', testMessage.description);
    }

    console.log('\n✅ All tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Check your Telegram for the test message');
    console.log('2. Deploy functions: cd functions && npm run build && cd .. && firebase deploy --only functions');
    console.log('3. Set webhook: Visit https://us-central1-lordshubgaming.cloudfunctions.net/setTelegramWebhook');
    console.log('4. Test with a real customer message');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
