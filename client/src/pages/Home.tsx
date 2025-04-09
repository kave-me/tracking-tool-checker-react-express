import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import SupportedTags from '@/components/home/SupportedTags';
import TagCheckerForm from '@/components/tagChecker/TagCheckerForm';
import EmailSignup from '@/components/home/EmailSignup';
import BlogList from '@/components/blog/BlogList';

export default function Home() {
  useEffect(() => {
    document.title = 'Track to Measure - Check Your Website\'s Tracking Tags';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Supported Tags Section */}
      <SupportedTags />
      
      {/* Tag Checker Section */}
      <section id="tool" className="py-16 bg-white border-t border-b border-gray-200">
        <TagCheckerForm />
      </section>
      
      {/* Email Signup Section */}
      <EmailSignup />
      
      {/* Blog Section */}
      <section id="blog" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Setup Guides</h2>
            <p className="mt-4 text-xl text-gray-600">
              Learn how to properly install and configure your tracking tools
            </p>
          </div>
          
          <div className="mt-12">
            <BlogList />
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View all guides
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
