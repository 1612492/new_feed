import Parser from 'rss-parser';
import { getPathname } from '../../../utils/string';

const origin = [
  { src: 'Github Blog', url: 'https://github.blog/feed', parserOptions: {} },
  {
    src: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com/feed/',
    parserOptions: {},
  },
  { src: 'Overreacted', url: 'https://overreacted.io/rss.xml', parserOptions: {} },
  {
    src: 'web.dev',
    url: 'https://web.dev/feed.xml',
    parserOptions: {
      customFields: {
        item: [['content', 'content:encoded']],
      },
    },
  },
];

export default async function handler(req, res) {
  const posts = await getPosts();
  const groups = await getGroups(posts);
  res.status(200).json(groups);
}

export async function getGroups(posts) {
  let groups = posts.reduce((groups, post) => {
    const { pubDate } = post;
    if (!groups[pubDate]) {
      groups[pubDate] = [];
    }
    groups[pubDate].push(post);
    return groups;
  }, {});

  groups = Object.keys(groups)
    .map((pubDate) => {
      return {
        pubDate,
        posts: groups[pubDate],
      };
    })
    .sort((firstEl, secondEl) => secondEl.pubDate - firstEl.pubDate);

  return groups;
}

export async function getPosts() {
  const sources = await Promise.all(
    origin.map(async ({ src, url, parserOptions }) => {
      const parser = new Parser(parserOptions);
      const { items, ...rest } = await parser.parseURL(url);

      return {
        ...rest,
        items: items.map((item) => ({
          ...item,
          src,
          pubDate: new Date(item.pubDate).toISOString().split('T')[0],
          pathname: getPathname(item.link),
        })),
      };
    })
  );

  let posts = [];

  sources.forEach(({ items }) => {
    posts = [...posts, ...items];
  });

  return posts;
}
