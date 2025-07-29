import Parser from 'rss-parser';

const parser = new Parser();

const sources = [
  'https://feeds.simplecast.com/p7S4nr_h', // The Anthropocene Reviewed
  'https://feeds.megaphone.fm/VMP8871377602', // This is Love
  'https://feeds.megaphone.fm/LIT1443896445', // Emergence Magazine
  'https://feeds.simplecast.com/AuAxH_Bf', // On Being
  'https://feeds.simplecast.com/FO6kxYGj', // Ologies
];

interface FeedItem {
  feed?: string;
  title?: string;
  snippet?: string;
  link?: string;
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
          date,
          title: item.title,
          snippet: item.itunes.subtitle,
          link: item.link,
          audio,
        });
      });
    } catch (error) {
      console.error(`Error fetching source from ${source}:`, error);
    }
  })
);

//@ts-ignore
const getDate = ({ date }) => date ?? new Date().getTime();
export const sortedFeedItems = feedItems.sort(
  //@ts-ignore
  (a, b) => getDate(b) - getDate(a)
);
