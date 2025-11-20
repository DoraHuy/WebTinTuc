import { Post } from '@/lib/types/Homepage';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/data/homepage-data';
import PostDetailClient from './PostDetailClient';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);
  const post = getPostById(postId);

  if (!post) {
    notFound();
  }

  return <PostDetailClient post={post} />;
}
