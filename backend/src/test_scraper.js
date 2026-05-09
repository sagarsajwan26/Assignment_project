import axios from 'axios';
import * as cheerio from 'cheerio';

const HN_URL = 'https://news.ycombinator.com';
const SCRAPE_LIMIT = 10;

const testScrape = async () => {
  try {
    console.log('Fetching HN...');
    const { data } = await axios.get(HN_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').slice(0, SCRAPE_LIMIT).each((_, el) => {
      const id = $(el).attr('id');
      const titleEl = $(el).find('.titleline a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';

      const subtext = $(el).next().find('.subtext');
      const points = parseInt(subtext.find(`#score_${id}`).text()) || 0;
      const author = subtext.find('.hnuser').text().trim();
      const postedAt = subtext.find('.age').attr('title') || subtext.find('.age a').text().trim();

      if (title) stories.push({ title, url, points, author, postedAt });
    });

    console.log('Scraped stories:', stories.length);
    console.log('First story:', stories[0]);
  } catch (err) {
    console.error('Scrape failed:', err.message);
  }
};

testScrape();
