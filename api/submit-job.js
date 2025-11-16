export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = 'your_really_secret_key_here'; // Set this to your secret key

  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }

  // Grab job data
  const { job_id, place_id, webhook, player_name } = req.body || {};

  // Validate webhook looks like a Discord URL
  if (!webhook || !/^https:\/\/discord\.com\/api\/webhooks\//.test(webhook)) {
    return res.status(400).json({ error: 'Invalid or missing Discord webhook.' });
  }

  // Compose the message for Discord
  const content = 
    `🚀 **New Job Submitted!**\n` +
    `• **Job ID:** \`${job_id}\`\n` +
    `• **Place ID:** \`${place_id}\`\n` +
    `• **Player:** \`${player_name}\``;

  // POST to Discord webhook
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  if (response.ok) {
    return res.status(200).json({ ok: true, message: 'Job received and sent to Discord!' });
  } else {
    return res.status(500).json({ ok: false, error: 'Failed to send to Discord webhook' });
  }
}
