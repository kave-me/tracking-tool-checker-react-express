import { useEffect } from 'react';
import BlogList from '@/components/blog/BlogList';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog | Track to Measure';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Setup Guides & Tutorials</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Learn how to properly install and configure tracking tools for your website with our step-by-step guides
        </p>
      </div>
      
      <div className="mt-12">
        <BlogList />
      </div>
      
      <div className="mt-16 border-t border-gray-200 pt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Can't find what you need?</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Subscribe to our newsletter to get notified when we publish new guides, or contact us with your specific questions.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href="/#subscribe">Subscribe for Updates</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:contact@tracktomeasure.com">Contact Us</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
