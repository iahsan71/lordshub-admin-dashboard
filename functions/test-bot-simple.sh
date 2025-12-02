#!/bin/bash

# Simple bot test using curl
# Update BOT_TOKEN with your new bot token

BOT_TOKEN="8046918233:AAEBiPcv-bPo2426MU6qKjRrNdvfkIf3NZ0"
ADMIN_ID="6331413591"

echo "🤖 Testing Telegram Bot"
echo "======================="
echo ""

# Test 1: Get bot info
echo "1️⃣  Testing bot connection..."
RESPONSE=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe")
echo "$RESPONSE"

if echo "$RESPONSE" | grep -q '"ok":true'; then
    BOT_USERNAME=$(echo "$RESPONSE" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Bot connected: @${BOT_USERNAME}"
else
    echo "❌ Bot connection failed"
    echo "   Check your bot token"
    exit 1
fi

echo ""
echo "2️⃣  Checking webhook status..."
WEBHOOK=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")
echo "$WEBHOOK" | grep -o '"url":"[^"]*"'
echo ""

echo "3️⃣  Sending test message to admin..."
MESSAGE="🧪 Test message from setup script\n\nIf you see this, the bot is working!"
SEND_RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\":\"${ADMIN_ID}\",\"text\":\"${MESSAGE}\"}")

echo "$SEND_RESPONSE"

if echo "$SEND_RESPONSE" | grep -q '"ok":true'; then
    echo ""
    echo "✅ Test message sent successfully!"
    echo "   Check your Telegram for the message"
else
    echo ""
    echo "❌ Failed to send test message"
    if echo "$SEND_RESPONSE" | grep -q "chat not found"; then
        echo ""
        echo "⚠️  ERROR: Chat not found"
        echo ""
        echo "   You need to start the bot first:"
        echo "   1. Open Telegram"
        echo "   2. Search for: @${BOT_USERNAME}"
        echo "   3. Click START button"
        echo "   4. Run this script again"
    fi
fi

echo ""
echo "📝 Bot Token: ${BOT_TOKEN:0:20}..."
echo "📝 Admin ID: ${ADMIN_ID}"
