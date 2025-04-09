import { TagResults } from '@shared/types';
import { Check, X, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '@/components/ui/card';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { Link } from 'wouter';

interface ResultsDisplayProps {
  results: TagResults;
}

interface TagItem {
  name: string;
  result: TagResults['gtm'] | TagResults['ga4'] | TagResults['googleAds'] | TagResults['metaPixel'];
  description: string;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const tags: TagItem[] = [
    { 
      name: 'Google Tag Manager', 
      result: results.gtm,
      description: results.gtm.id ? `Container ID: ${results.gtm.id}` : 'Not detected'
    },
    { 
      name: 'Google Analytics 4', 
      result: results.ga4,
      description: results.ga4.id ? `Measurement ID: ${results.ga4.id}` : 'Not detected'
    },
    { 
      name: 'Google Ads', 
      result: results.googleAds,
      description: results.googleAds.id ? `Conversion ID: ${results.googleAds.id}` : 'Not detected'
    },
    { 
      name: 'Meta Pixel', 
      result: results.metaPixel,
      description: results.metaPixel.id ? `Pixel ID: ${results.metaPixel.id}` : 'Not detected'
    }
  ];

  return (
    <div className="mt-8">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle>Tag Detection Results</CardTitle>
          <CardDescription>
            Results for: {results.url}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-gray-200">
          {tags.map((tag) => (
            <div key={tag.name} className="px-4 py-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full ${tag.result.found ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                  {tag.result.found ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{tag.name}</p>
                  <p className="text-xs text-gray-500">{tag.description}</p>
                </div>
              </div>
              {tag.result.location ? (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  &lt;{tag.result.location}&gt;
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                  Not found
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Alert className="mt-6 bg-blue-50 text-blue-800 border-blue-100">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle>Need help setting up these tags?</AlertTitle>
        <AlertDescription>
          <div className="text-blue-700">
            <p>Check out our setup guides below or subscribe to get notified when we add new features.</p>
            <div className="mt-3">
              <Link href="/blog" className="text-sm font-medium text-blue-700 hover:text-blue-600 inline-flex items-center">
                View setup guides 
                <svg 
                  className="ml-1 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
