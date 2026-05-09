import rateLimit from 'express-rate-limit';

const make = (windowMs, max, message) =>
  rateLimit({ windowMs, max, message: { success: false, message }, standardHeaders: true, legacyHeaders: false });

const FIFTEEN_MIN = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export const globalLimiter = make(FIFTEEN_MIN, 100, 'Too many requests, please try again later.');
export const authLimiter = make(FIFTEEN_MIN, 10, 'Too many auth attempts, please try again after 15 minutes.');
export const scrapeLimiter = make(ONE_HOUR, 5, 'Scrape limit reached, please try again after an hour.');
