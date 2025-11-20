import { Post } from '@/lib/types/Homepage';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  title?: string;
}

export function PostGrid({ posts, title }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không có bài viết nào</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
