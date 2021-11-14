import React from 'react';
import { getPosts } from './api/posts';
import { getPost } from './api/posts/[id]';

export default function Post({ post }) {
  return (
    <div className="container px-4 md:mx-auto md:px-0 py-8">
      <h1 className="text-2xl border-b pb-2 mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post['content:encoded'] }} />
    </div>
  );
}

export async function getStaticPaths() {
  const posts = await getPosts();

  const paths = posts.map((post) => ({
    params: { id: post.pathname },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.id);

  return { props: { post } };
}
