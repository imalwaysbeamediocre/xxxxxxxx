export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { player, currentJobId, placeId } = req.body;
      
      console.log('🔄 Server hop requested by:', player);
      
      // In a real implementation, you might have a list of active servers
      // For now, we'll just acknowledge the request
      res.status(200).json({ 
        success: true, 
        message: 'Hop request received',
        note: 'Actual server hopping happens client-side in Roblox'
      });
    } catch (error) {
      console.error('Error in hop:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
