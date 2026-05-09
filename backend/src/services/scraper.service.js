import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../model/post.model.js';

const HN_URL = 'https://news.ycombinator.com';

export const scrapeTopStories = async () => {
  const { data } = await axios.get(HN_URL, { timeout: 10000 });
  const $ = cheerio.load(data);

  const stories = [];

  $('.athing').slice(0, 10).each((_, el) => {
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

  await Story.deleteMany({});
  return Story.insertMany(stories);
};
