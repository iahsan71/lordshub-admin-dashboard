/**
 * Simple bot test - more robust version
 * Run with: node test-bot-simple.js YOUR_BOT_TOKEN
 */

// Get bot token from command line or use default
const BOT_TOKEN = process.argv[2] || '8029311115:AAH6JOMdBGuUekWMcg0TXNQy-ngUFQ1M6I0';
const ADMIN_ID = '8249444980';

console.log('🤖 Testing Telegram Bot');
console.log('=======================\n');

// Test using fetch (Node 18+) or fallback to https
async function testBot() {
  try {
    // Test 1: Get bot info
    console.log('1️⃣  Testing bot connection...');
    const botInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getMe`;
    
    const botResponse = await fetch(botInfoUrl);
    const botData = await botResponse.json();
    
    if (botData.ok) {
      console.log('✅ Bot connected:', botData.result.username);
      console.log('   Bot ID:', botData.result.id);
      console.log('   Bot Name:', botData.result.first_name);
    } else {
      console.log('❌ Bot connection failed');
      console.log('   Error:', botData.description);
      console.log('\n⚠️  Please check your bot token');
      process.exit(1);
    }

    // Test 2: Check webhook
    console.log('\n2️⃣  Checking webhook status...');
    const webhookUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;
    const webhookResponse = await fetch(webhookUrl);
    const webhookData = await webhookResponse.json();
    
    if (webhookData.ok) {
      console.log('   Webhook URL:', webhookData.result.url || '(not set)');
      console.log('   Pending updates:', webhookData.result.pending_update_count);
      if (webhookData.result.last_error_message) {
        console.log('   ⚠️  Last error:', webhookData.result.last_error_message);
      }
    }

    // Test 3: Send test message
    console.log('\n3️⃣  Sending test message to admin...');
    const sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const sendResponse = await fetch(sendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_ID,
        text: '🧪 Test message from bot test script\n\nIf you see this, the bot is working correctly!'
      })
    });
    
    const sendData = await sendResponse.json();
    
    if (sendData.ok) {
      console.log('✅ Test message sent successfully!');
      console.log('   Message ID:', sendData.result.message_id);
      console.log('\n📱 Check your Telegram for the message');
    } else {
      console.log('❌ Failed to send test message');
      console.log('   Error:', sendData.description);
      
      if (sendData.description.includes('chat not found')) {
        console.log('\n⚠️  SOLUTION:');
        console.log('   1. Open Telegram');
        console.log('   2. Search for: @' + botData.result.username);
        console.log('   3. Click START button');
        console.log('   4. Run this script again');
      }
    }

    console.log('\n✅ Test complete!');
    console.log('\n📝 Configuration:');
    console.log('   Bot Token:', BOT_TOKEN.substring(0, 20) + '...');
    console.log('   Admin ID:', ADMIN_ID);
    console.log('   Bot Username: @' + botData.result.username);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('fetch is not defined')) {
      console.log('\n⚠️  Your Node.js version is too old');
      console.log('   Please upgrade to Node.js 18+ or use the shell script:');
      console.log('   bash test-bot-simple.sh');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      console.log('\n⚠️  Network error - check your internet connection');
    }
  }
}

testBot();
