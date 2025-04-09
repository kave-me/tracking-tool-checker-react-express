import BlogPost from '@/components/blog/BlogPost';

interface BlogPostPageProps {
  params: {
    slug: string;
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  return <BlogPost slug={slug} />;
}
