export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    service: 'Roblox Tracker',
    timestamp: new Date().toISOString(),
    webhook: 'enabled'
  });
}
