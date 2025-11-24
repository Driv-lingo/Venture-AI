import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error('REDIS_URL and REDIS_TOKEN must be defined in environment variables');
}

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Rate limiters for different operations
export const rateLimiters = {
  // API calls: 100 requests per hour per user
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),

  // Validation requests: 10 per day per user
  validation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '24 h'),
    analytics: true,
    prefix: 'ratelimit:validation',
  }),

  // Business launches: 5 per week per user
  launch: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '7 d'),
    analytics: true,
    prefix: 'ratelimit:launch',
  }),
};

// Cache key patterns
export const cacheKeys = {
  userProfile: (userId: string) => `user:${userId}:profile`,
  userOpportunities: (userId: string) => `user:${userId}:opportunities`,
  validation: (opportunityId: string, userId: string) => 
    `validation:${opportunityId}:${userId}`,
  businessMetrics: (businessId: string, date: string) => 
    `business:${businessId}:metrics:${date}`,
  leaderboardOpportunities: 'leaderboard:opportunities',
  leaderboardBusinesses: 'leaderboard:businesses',
  leaderboardUsers: 'leaderboard:users',
};

// Cache TTL values (in seconds)
export const cacheTTL = {
  userProfile: 3600, // 1 hour
  opportunities: 21600, // 6 hours
  validation: 86400, // 24 hours
  metrics: 300, // 5 minutes
  leaderboard: 3600, // 1 hour
};

// Helper functions for caching
export const cacheHelpers = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T | null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis pattern invalidation error:', error);
    }
  },
};

// Leaderboard helpers
export const leaderboardHelpers = {
  async addToLeaderboard(
    leaderboardKey: string,
    member: string,
    score: number
  ): Promise<void> {
    try {
      await redis.zadd(leaderboardKey, { score, member });
    } catch (error) {
      console.error('Redis ZADD error:', error);
    }
  },

  async getTopFromLeaderboard(
    leaderboardKey: string,
    count: number = 10
  ): Promise<Array<{ member: string; score: number }>> {
    try {
      const results = await redis.zrange(leaderboardKey, 0, count - 1, {
        rev: true,
        withScores: true,
      });
      
      const formatted: Array<{ member: string; score: number }> = [];
      for (let i = 0; i < results.length; i += 2) {
        formatted.push({
          member: results[i] as string,
          score: results[i + 1] as number,
        });
      }
      return formatted;
    } catch (error) {
      console.error('Redis ZRANGE error:', error);
      return [];
    }
  },

  async getRank(leaderboardKey: string, member: string): Promise<number | null> {
    try {
      const rank = await redis.zrevrank(leaderboardKey, member);
      return rank !== null ? rank + 1 : null;
    } catch (error) {
      console.error('Redis ZREVRANK error:', error);
      return null;
    }
  },
};

// Pub/Sub helpers for real-time updates
export const pubSubChannels = {
  businessMetrics: 'channel:business:metrics',
  launchProgress: 'channel:launch:progress',
  aiActivity: 'channel:ai:activity',
};
