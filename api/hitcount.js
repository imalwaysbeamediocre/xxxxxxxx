export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { webhook, player, jobId, placeId, timestamp } = req.body;
      
      console.log('📊 Hitcount received:', {
        player: player,
        jobId: jobId,
        placeId: placeId,
        timestamp: new Date(timestamp * 1000).toISOString()
      });

      // If you want to forward to Discord webhook
      if (webhook && webhook.includes('discord.com')) {
        try {
          const discordResponse = await fetch(webhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: `🎯 Hitcount from ${player} in server ${jobId}`,
              embeds: [{
                title: "Hitcount Recorded",
                fields: [
                  { name: "Player", value: player, inline: true },
                  { name: "Server", value: jobId, inline: true },
                  { name: "Place", value: placeId, inline: true }
                ],
                timestamp: new Date().toISOString(),
                color: 0x00ff00
              }]
            })
          });
        } catch (discordError) {
          console.log('Discord webhook failed:', discordError);
        }
      }

      res.status(200).json({ 
        success: true, 
        message: 'Hitcount recorded',
        received: {
          player: player,
          jobId: jobId,
          placeId: placeId
        }
      });
    } catch (error) {
      console.error('Error in hitcount:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
