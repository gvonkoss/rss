import Parser from 'rss-parser';
import { sources } from './podcasts';

const parser = new Parser();

interface FeedItem {
  feed?: string;
  link?: string;
  title?: string;
  snippet?: string;
  date?: Date;
  audio?: string;
}

const feedItems: FeedItem[] = [];

await Promise.allSettled(
  sources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source);
      feed.items.forEach((item) => {
        console.log(item);

        const date = item.pubDate ? new Date(item.pubDate) : undefined;
        const audio =
          item.enclosure?.type === 'audio/mpeg'
            ? item.enclosure.url
            : undefined;

        feedItems.push({
          feed: feed.title,
          link: item.link,
          date,
          title: item.title,
          snippet: item.itunes.subtitle,
          audio,
        });
      });
    } catch (error) {
      console.error(`Error fetching source from ${source}:`, error);
    }
  }),
);

//@ts-ignore
const getDate = ({ date }) => date ?? new Date().getTime();
export const sortedFeedItems = feedItems.sort(
  //@ts-ignore
  (a, b) => getDate(b) - getDate(a),
);
