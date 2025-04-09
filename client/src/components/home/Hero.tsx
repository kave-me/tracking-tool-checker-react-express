import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl tracking-tight">
            Check if your tracking tools are installed correctly
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Instantly verify if your website has GTM, GA4, Google Ads, and Meta Pixel tags properly set up.
          </p>
          <div className="mt-8">
            <Button size="lg" className="gap-2" asChild>
              <a href="#tool">
                Check Your Website
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <div className="hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
            alt="Website analytics dashboard" 
            className="rounded-lg shadow-lg w-full h-auto object-cover" 
            width="600" 
            height="400" 
          />
        </div>
      </div>
    </header>
  );
}
