import { createServer } from 'http';
import { logger } from './lib/logger';
import Redis from 'ioredis';
import { supabase } from '@docshot/database';

const PORT = process.env.HEALTH_CHECK_PORT || 3001;

export function startHealthCheckServer() {
  const server = createServer(async (req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      try {
        // Check Redis connection
        const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        await redis.ping();
        await redis.quit();
        
        // Check Supabase connection
        const { error } = await supabase
          .from('projects')
          .select('id')
          .limit(1);
        
        if (error) {
          throw new Error(`Database check failed: ${error.message}`);
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          checks: {
            redis: 'connected',
            database: 'connected',
          },
        }));
      } catch (error) {
        logger.error('Health check failed', {
          error: error instanceof Error ? error.message : String(error),
        });
        
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  server.listen(PORT, () => {
    logger.info(`Health check server listening on port ${PORT}`);
  });
  
  return server;
}