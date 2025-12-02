/**
 * Local testing script for Firestore triggers
 * Run with: node test-local.js
 * 
 * Make sure emulators are running first:
 * firebase emulators:start
 */

const admin = require('firebase-admin');

// Connect to emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

admin.initializeApp({
  projectId: 'lordshubgaming'
});

const db = admin.firestore();

async function testCustomerMessage() {
  console.log('🧪 Testing customer message trigger...\n');

  const sessionId = 'test-session-' + Date.now();
  
  try {
    // Create a test chat session
    console.log('1️⃣  Creating test chat session...');
    const sessionRef = db.collection('chatSessions').doc(sessionId);
    
    await sessionRef.set({
      visitorId: 'visitor_test_123',
      visitorName: 'Test User',
      lastMessage: '',
      lastMessageType: 'text',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount: 0
    });
    console.log('✅ Chat session created:', sessionId);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add a test message (this triggers onNewCustomerMessage)
    console.log('\n2️⃣  Adding test message...');
    await sessionRef.collection('messages').add({
      sender: 'visitor',
      text: 'Hello, this is a test message from local emulator!',
      type: 'text',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
    console.log('✅ Test message added to Firestore');

    console.log('\n📋 Summary:');
    console.log('   Session ID:', sessionId);
    console.log('   Collection: chatSessions/' + sessionId + '/messages');
    console.log('\n📱 Check emulator logs to see if function executed');
    console.log('   If Telegram message was sent, check your Telegram!');
    console.log('\n🌐 View in Emulator UI: http://localhost:4000/firestore');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function testAdminMessage() {
  console.log('\n🧪 Testing admin message trigger...\n');

  const sessionId = 'test-session-' + Date.now();
  
  try {
    // Create a test chat session
    console.log('1️⃣  Creating test chat session...');
    const sessionRef = db.collection('chatSessions').doc(sessionId);
    
    await sessionRef.set({
      visitorId: 'visitor_test_456',
      visitorName: 'Another Test User',
      lastMessage: '',
      lastMessageType: 'text',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount: 0
    });
    console.log('✅ Chat session created:', sessionId);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add admin message from web (this triggers onNewAdminMessage)
    console.log('\n2️⃣  Adding admin message from web...');
    await sessionRef.collection('messages').add({
      sender: 'admin',
      text: 'This is an admin reply from web app',
      type: 'text',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      sentVia: 'web'
    });
    console.log('✅ Admin message added to Firestore');

    console.log('\n📋 Summary:');
    console.log('   Session ID:', sessionId);
    console.log('   This should sync to Telegram (if thread exists)');
    console.log('\n📱 Check emulator logs for function execution');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function testImageMessage() {
  console.log('\n🧪 Testing image message...\n');

  const sessionId = 'test-session-' + Date.now();
  
  try {
    console.log('1️⃣  Creating test chat session...');
    const sessionRef = db.collection('chatSessions').doc(sessionId);
    
    await sessionRef.set({
      visitorId: 'visitor_test_789',
      visitorName: 'Image Test User',
      lastMessage: '',
      lastMessageType: 'text',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount: 0
    });
    console.log('✅ Chat session created:', sessionId);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n2️⃣  Adding image message...');
    await sessionRef.collection('messages').add({
      sender: 'visitor',
      text: '📷 Image',
      type: 'image',
      imageUrl: 'https://picsum.photos/400/300',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
    console.log('✅ Image message added to Firestore');

    console.log('\n📋 Summary:');
    console.log('   Session ID:', sessionId);
    console.log('   Image URL: https://picsum.photos/400/300');
    console.log('\n📱 Check Telegram for image notification');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Main menu
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Telegram Integration - Local Testing                ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const args = process.argv.slice(2);
  const testType = args[0];

  if (!testType) {
    console.log('Usage: node test-local.js [test-type]\n');
    console.log('Available tests:');
    console.log('  customer  - Test customer message (triggers onNewCustomerMessage)');
    console.log('  admin     - Test admin message (triggers onNewAdminMessage)');
    console.log('  image     - Test image message');
    console.log('  all       - Run all tests\n');
    console.log('Example: node test-local.js customer\n');
    console.log('⚠️  Make sure emulators are running: firebase emulators:start');
    process.exit(0);
  }

  // Check if emulator is running
  try {
    await db.collection('_test').doc('_test').get();
  } catch (error) {
    console.error('❌ Cannot connect to Firestore emulator!');
    console.error('   Make sure emulators are running: firebase emulators:start');
    console.error('   Error:', error.message);
    process.exit(1);
  }

  switch (testType) {
    case 'customer':
      await testCustomerMessage();
      break;
    case 'admin':
      await testAdminMessage();
      break;
    case 'image':
      await testImageMessage();
      break;
    case 'all':
      await testCustomerMessage();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await testAdminMessage();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await testImageMessage();
      break;
    default:
      console.error('❌ Unknown test type:', testType);
      console.log('   Use: customer, admin, image, or all');
      process.exit(1);
  }

  console.log('\n✅ Test complete!\n');
  process.exit(0);
}

main();
