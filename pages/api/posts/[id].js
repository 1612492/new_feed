import { getPosts } from '.';

export default async function handler(req, res) {
  const post = await getPost(req.query.id);
  res.status(200).json(post);
}

export async function getPost(id) {
  const posts = await getPosts();
  const post = posts.find((post) => post.pathname === id);

  return post;
}
