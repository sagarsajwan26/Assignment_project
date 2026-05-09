import rateLimit from 'express-rate-limit';

const make = (windowMs, max, message) =>
  rateLimit({ windowMs, max, message: { success: false, message }, standardHeaders: true, legacyHeaders: false });

export const globalLimiter = make(15 * 60 * 1000, 100, 'Too many requests, please try again later.');
export const authLimiter = make(15 * 60 * 1000, 10, 'Too many auth attempts, please try again after 15 minutes.');
export const scrapeLimiter = make(60 * 60 * 1000, 5, 'Scrape limit reached, please try again after an hour.');
