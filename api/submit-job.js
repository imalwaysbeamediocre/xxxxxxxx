export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { webhook, jobId, placeId, player, timestamp } = req.body;
      
      console.log('🚀 Job submitted:', {
        player: player,
        jobId: jobId,
        placeId: placeId,
        webhook: webhook ? 'Provided' : 'None'
      });

      res.status(200).json({ 
        success: true, 
        message: 'Job submitted successfully',
        data: {
          jobId: jobId,
          placeId: placeId,
          player: player,
          processedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in submit-job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
