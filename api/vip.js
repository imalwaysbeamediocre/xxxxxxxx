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
  if (req.method === 'GET') {
    const player = req.query.player || 'unknown';
    const userId = req.query.userId || 'unknown';
    
    // Add your VIP players here
    const vipPlayers = ["YourMainUsername", "AltAccount1"];
    const isVIP = vipPlayers.includes(player);
    
    console.log('👑 VIP check:', player, isVIP);
    
    // Send to Discord
    await sendToDiscord({
      title: "👑 VIP Check",
      description: `VIP status for **${player}**`,
      color: isVIP ? 0xffd700 : 0x95a5a6,
      fields: [
        { name: "User ID", value: userId, inline: true },
        { name: "VIP Status", value: isVIP ? "✅ VIP" : "❌ Not VIP", inline: true },
        { name: "Checked", value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: true }
      ],
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({ 
      success: true, 
      vip: isVIP,
      player: player
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
