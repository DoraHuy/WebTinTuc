import { Post } from '@/lib/types/Homepage';

const homepageDataJson = require('../../public/data/homepage-data.json');

export function getPostById(id: number): Post | null {
  const data = homepageDataJson;
  const post = data.posts.find((p: any) => p.id === id);
  
  if (!post) return null;
  
  return {
    ...post,
    nguoiDung: data.authors.find((a: any) => a.id === post.authorId),
    danhMuc: post.categoryIds.map((cId: number) => 
      data.categories.find((c: any) => c.id === cId)
    ),
    tags: post.tagIds.map((tId: number) => 
      data.tags.find((t: any) => t.id === tId)
    ),
  };
}

export function incrementView(postId: number) {
  // In real app, this would update database
  console.log(`View incremented for post ${postId}`);
}
