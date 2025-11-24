import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

// Create Redis connection for BullMQ
// Note: BullMQ requires ioredis, not @upstash/redis
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Define queue names
export const QUEUE_NAMES = {
  OPPORTUNITY_DETECTION: 'opportunity-detection',
  BUSINESS_LAUNCH: 'business-launch',
  METRICS_AGGREGATION: 'metrics-aggregation',
} as const;

// Create queues
export const opportunityDetectionQueue = new Queue(
  QUEUE_NAMES.OPPORTUNITY_DETECTION,
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: {
        count: 100,
        age: 24 * 3600, // 24 hours
      },
      removeOnFail: {
        count: 1000,
      },
    },
  }
);

export const businessLaunchQueue = new Queue(QUEUE_NAMES.BUSINESS_LAUNCH, {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

export const metricsAggregationQueue = new Queue(
  QUEUE_NAMES.METRICS_AGGREGATION,
  {
    connection,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  }
);

// Job data types
export interface OpportunityDetectionJobData {
  sources: Array<'google_trends' | 'reddit' | 'product_hunt' | 'indie_hackers'>;
  forceRefresh?: boolean;
}

export interface BusinessLaunchJobData {
  businessId: string;
  userId: string;
  step: number;
}

export interface MetricsAggregationJobData {
  businessId: string;
  date: string;
}

// Helper functions to add jobs
export async function scheduleOpportunityDetection(
  data: OpportunityDetectionJobData
) {
  return await opportunityDetectionQueue.add('detect-opportunities', data, {
    repeat: {
      pattern: '0 */6 * * *', // Every 6 hours
    },
  });
}

export async function scheduleBusinessLaunchStep(data: BusinessLaunchJobData) {
  return await businessLaunchQueue.add('launch-step', data);
}

export async function scheduleMetricsAggregation(
  data: MetricsAggregationJobData
) {
  return await metricsAggregationQueue.add('aggregate-metrics', data);
}

// Queue events for monitoring
export const opportunityDetectionEvents = new QueueEvents(
  QUEUE_NAMES.OPPORTUNITY_DETECTION,
  { connection }
);

export const businessLaunchEvents = new QueueEvents(
  QUEUE_NAMES.BUSINESS_LAUNCH,
  { connection }
);

export const metricsAggregationEvents = new QueueEvents(
  QUEUE_NAMES.METRICS_AGGREGATION,
  { connection }
);

// Cleanup function
export async function closeQueues() {
  await opportunityDetectionQueue.close();
  await businessLaunchQueue.close();
  await metricsAggregationQueue.close();
  await connection.quit();
}
