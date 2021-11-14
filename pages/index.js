import Parser from 'rss-parser';
import Link from 'next/link';
import { merge } from '../utils/string';
import { getPosts, getGroups } from './api/posts';

export default function HomePage({ groups }) {
  return (
    <div className="container px-4 md:mx-auto md:px-0 py-8">
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
                    <Link href={post.pathname}>
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

export async function getStaticProps() {
  const posts = await getPosts();
  const groups = await getGroups(posts);

  return { props: { posts, groups } };
}
