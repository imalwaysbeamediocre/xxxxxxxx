import fetch from 'node-fetch';

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1439213000455360624/Dj7Uh7hGHMX7CN5wRNN6hijz8ppS-bXFSwTuTX68n00k9YBNZ9miRmbR_HQ3TBW3iOeQ";

async function sendToDiscord(embed) {
  try {
    console.log('📤 Sending to Discord webhook...');
    
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: embed.content || null,
        embeds: [embed]
      })
    });

    console.log(`📨 Discord response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Discord error: ${errorText}`);
      return false;
    }
    
    console.log('✅ Discord webhook sent successfully');
    return true;
  } catch (error) {
    console.log('❌ Discord webhook failed:', error.message);
    return false;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { webhook, player, jobId, placeId, timestamp } = req.body;
      
      console.log('🎯 Hitcount received:', { player, jobId, placeId });

      // Send to Discord
      const discordSuccess = await sendToDiscord({
        title: "🎯 Hitcount Recorded",
        description: `Player: **${player}**\nServer: \`${jobId}\``,
        color: 0x00ff00,
        fields: [
          { name: "Place ID", value: placeId, inline: true },
          { name: "Timestamp", value: `<t:${timestamp}:R>`, inline: true },
          { name: "API Status", value: "Vercel → Discord", inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Roblox Tracker API" }
      });

      res.status(200).json({ 
        success: true, 
        discordSent: discordSuccess,
        message: 'Hitcount recorded',
        data: { player, jobId }
      });
    } catch (error) {
      console.error('❌ Error in hitcount:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
