import fetch from 'node-fetch';

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1439213000455360624/Dj7Uh7hGHMX7CN5wRNN6hijz8ppS-bXFSwTuTX68n00k9YBNZ9miRmbR_HQ3TBW3iOeQ";

async function sendToDiscord(embed) {
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });
  } catch (error) {
    console.log('Discord webhook failed:', error);
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { webhook, player, jobId, placeId, timestamp } = req.body;
    
    console.log('🎯 Hitcount:', player, jobId);
    
    // Send to Discord
    await sendToDiscord({
      title: "🎯 Hitcount Recorded",
      description: `Player: **${player}**\nServer: \`${jobId}\``,
      color: 0x00ff00,
      fields: [
        { name: "Place ID", value: placeId, inline: true },
        { name: "Timestamp", value: `<t:${timestamp}:R>`, inline: true }
      ],
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Hitcount recorded',
      data: { player, jobId }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
