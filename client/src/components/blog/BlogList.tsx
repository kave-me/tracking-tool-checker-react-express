import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { BlogPostSummary } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogList() {
  const { data: posts, isLoading, error } = useQuery<BlogPostSummary[]>({
    queryKey: ['/api/blog-posts'],
  });

  if (isLoading) {
    return (
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="shadow-sm overflow-hidden flex flex-col h-full border border-gray-200">
            <CardContent className="p-6 flex-1">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <Skeleton className="h-5 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Failed to load blog posts</h3>
        <p className="mt-2 text-sm text-gray-600">Please try again later</p>
      </div>
    );
  }

  // If no posts, show placeholder
  if (!posts || posts.length === 0) {
    const defaultPosts: BlogPostSummary[] = [
      {
        id: 1,
        slug: 'how-to-set-up-google-tag-manager',
        title: 'How to Set Up Google Tag Manager',
        description: 'A step-by-step guide to installing and configuring Google Tag Manager on your website for better tracking.',
        date: new Date().toISOString(),
        readTime: 5
      },
      {
        id: 2,
        slug: 'migrating-from-universal-analytics-to-ga4',
        title: 'Migrating from Universal Analytics to GA4',
        description: 'Everything you need to know about transitioning to Google Analytics 4 before Universal Analytics stops working.',
        date: new Date().toISOString(),
        readTime: 6
      },
      {
        id: 3,
        slug: 'setting-up-meta-pixel-for-conversion-tracking',
        title: 'Setting Up Meta Pixel for Conversion Tracking',
        description: 'Learn how to implement the Meta (Facebook) Pixel for accurate conversion tracking and better ad performance.',
        date: new Date().toISOString(),
        readTime: 4
      }
    ];
    
    return (
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {defaultPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

interface BlogPostCardProps {
  post: BlogPostSummary;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.date);
  
  return (
    <Card className="shadow-sm overflow-hidden flex flex-col h-full border border-gray-200">
      <CardContent className="p-6 flex-1">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <time dateTime={formattedDate.toISOString()}>
            {formatDistanceToNow(formattedDate, { addSuffix: true })}
          </time>
          <span>&middot;</span>
          <span>{post.readTime} min read</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="block mt-2">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-base text-gray-600">
            {post.description}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Link 
          href={`/blog/${post.slug}`} 
          className="text-base font-medium text-primary hover:text-primary-600 flex items-center"
        >
          Read full guide 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
