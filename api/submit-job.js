export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = 'your_really_secret_key_here'; // Set this to your actual secret key!
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }

  // Grab job data
  const { job_id, place_id, webhook, player_name, server_link, vps_response } = req.body || {};

  if (!webhook || !/^https:\/\/discord\.com\/api\/webhooks\//.test(webhook)) {
    return res.status(400).json({ error: 'Invalid or missing Discord webhook.' });
  }

  // Build the embed to match your sample
  const embed = {
    title: "Skid idk",
    color: 16753920,
    fields: [
      {
        name: "📋 Job ID",
        value: job_id ? `\`${job_id}\`` : "`N/A`",
        inline: true
      },
      {
        name: "🎯 Place ID",
        value: place_id ? `\`${place_id}\`` : "`N/A`",
        inline: true
      },
      {
        name: "👤 Player",
        value: player_name ? `\`${player_name}\`` : "`N/A`",
        inline: true
      },
      {
        name: "🌐 Server Link",
        value: server_link ? `[Join Server](${server_link})` : "`N/A`",
        inline: false
      },
    ],
    timestamp: new Date().toISOString(),
  };

  // Create Discord payload as in your Lua example
  const discordPayload = {
    content: "🔧 **Job ID Test Completed**",
    embeds: [embed]
  };

  // Send to Discord
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload)
  });

  if (response.ok) {
    return res.status(200).json({ ok: true, message: "Job received and custom embed sent to Discord!" });
  } else {
    return res.status(500).json({ ok: false, error: "Failed sending to Discord." });
  }
}
