import Parser from 'rss-parser';
import Link from 'next/link';
import { merge } from '../utils/string';

export default function HomePage({ groups }) {
  return (
    <div className="container mx-auto py-8">
      {groups.map(({ posts, pubDate }, groupIndex) => (
        <div key={groupIndex} className="border-l">
          <div className="relative -left-1 pb-4 pt-8">
            <span className="bg-white text-gray-300">
              <i className="fas fa-genderless"></i>
            </span>
            <span className="text-lg font-bold mx-3">{pubDate}</span>
          </div>
          <div className="mx-4 border rounded-md">
            {posts.map((post, postIndex) => {
              return (
                <div key={postIndex} className={merge(postIndex !== 0 && 'border-t', 'p-4')}>
                  <h2 className="text-xl font-bold hover:text-blue-600 hover:underline">
                    <Link href="/">
                      <a>{post.title}</a>
                    </Link>
                  </h2>
                  <span className="text-xs font-bold">{post.src}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
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
        })),
      };
    })
  );

  let posts = [];

  sources.forEach(({ items }) => {
    posts = [...posts, ...items];
  });

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

  return { props: { posts, groups } };
}
