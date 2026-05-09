import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../model/post.model.js';

const HN_URL = process.env.HN_URL || 'https://news.ycombinator.com';
const SCRAPE_LIMIT = parseInt(process.env.SCRAPE_LIMIT) || 10;

export const scrapeTopStories = async () => {
  const { data } = await axios.get(HN_URL, { timeout: 10000 });
  const $ = cheerio.load(data);

  const stories = [];

  $('.athing').slice(0, SCRAPE_LIMIT).each((_, el) => {
    const id = $(el).attr('id');
    const titleEl = $(el).find('.titleline > a').first();
    const title = titleEl.text().trim();
    const url = titleEl.attr('href') || '';

    const subtext = $(`#score_${id}`).closest('.subtext');
    const points = parseInt($(`#score_${id}`).text()) || 0;
    const author = subtext.find('.hnuser').text().trim();
    const postedAt = subtext.find('.age').attr('title') || subtext.find('.age a').text().trim();

    if (title) stories.push({ title, url, points, author, postedAt });
  });

  if (!stories.length) return [];

  // only delete stories that were scraped (no creator)
  await Story.deleteMany({ createdBy: null });
  return Story.insertMany(stories);
};
