import { cronJobs } from 'convex/server';
import { internal } from './_generated/api.js';

const crons = cronJobs();

crons.interval(
  'clean expired rate-limit buckets',
  { hours: 1 },
  internal.backend.cleanExpiredRateLimits,
);

export default crons;
