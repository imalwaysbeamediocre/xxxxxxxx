export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { jobId, placeId } = req.query;
      
      const links = {
        roblox: `https://www.roblox.com/games/${placeId}?gameInstanceId=${jobId}`,
        floating: `https://floating.gg/?placeID=${placeId}&gameInstanceId=${jobId}`,
        direct: `roblox://gameId=${placeId}&placeId=${placeId}&gameInstanceId=${jobId}`,
        deeplink: `https://roblox.com/games/start?placeId=${placeId}&gameInstanceId=${jobId}`
      };

      res.status(200).json({ 
        success: true, 
        links: links
      });
    } catch (error) {
      console.error('Error in links:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
