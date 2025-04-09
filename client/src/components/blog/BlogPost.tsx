import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BlogPostFull } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPostProps {
  slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
  const { data: post, isLoading, error } = useQuery<BlogPostFull>({
    queryKey: [`/api/blog-posts/${slug}`],
  });

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Track to Measure`;
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Article Not Found</h1>
        <p className="mt-4 text-xl text-gray-600">
          Sorry, the blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(post.date);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" className="mb-8" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{post.title}</h1>
      
      <div className="mt-4 flex items-center space-x-3 text-sm text-gray-500">
        <time dateTime={formattedDate.toISOString()}>
          {formatDistanceToNow(formattedDate, { addSuffix: true })}
        </time>
        <span>&middot;</span>
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {post.readTime} min read
        </span>
      </div>
      
      <div 
        className="mt-10 prose prose-lg prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900">Need more help?</h2>
        <p className="mt-4 text-gray-600">
          Subscribe to our newsletter to get more guides and updates on tracking tools.
        </p>
        <Button className="mt-6" asChild>
          <a href="/#subscribe">Subscribe for Updates</a>
        </Button>
      </div>
    </article>
  );
}
