import { Post } from '@/lib/types/Homepage';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/data/homepage-data';
import PostDetailClient from './PostDetailClient';

export default async function PostDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const postId = parseInt(id);
  const post = getPostById(postId);

  if (!post) {
    notFound();
  }

  return <PostDetailClient post={post} />;
}
