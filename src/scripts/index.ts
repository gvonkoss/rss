import Parser from 'rss-parser';

const parser = new Parser();

const sources = [
  'https://feeds.simplecast.com/p7S4nr_h', // The Anthropocene Reviewed
  'https://feeds.megaphone.fm/VMP8871377602', // This is Love
  'https://feeds.megaphone.fm/LIT1443896445', // Emergence Magazine
  // 'https://feeds.simplecast.com/AuAxH_Bf', // On Being
  'https://feeds.simplecast.com/FO6kxYGj', // Ologies
  'https://rss.amperwave.net/v2/feed/podcorn/4b34b711a4a1ede47c37820155127439', // Deadtalks
];

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
