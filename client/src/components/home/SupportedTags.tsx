import { Card, CardContent } from '@/components/ui/card';
import { SiGoogletagmanager, SiGoogleanalytics, SiGoogleads, SiFacebook } from 'react-icons/si';

const tags = [
  {
    icon: SiGoogletagmanager,
    color: 'text-blue-600',
    title: 'Google Tag Manager',
    description: 'Container for all your marketing tags'
  },
  {
    icon: SiGoogleanalytics,
    color: 'text-green-600',
    title: 'Google Analytics 4',
    description: 'Latest version of Google Analytics'
  },
  {
    icon: SiGoogleads,
    color: 'text-red-600',
    title: 'Google Ads',
    description: 'Conversion tracking for ads'
  },
  {
    icon: SiFacebook,
    color: 'text-blue-700',
    title: 'Meta Pixel',
    description: 'Facebook\'s conversion tracking'
  }
];

export default function SupportedTags() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Supported Tags</h2>
        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto text-center">
          We check for these essential tracking tools
        </p>
        
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {tags.map((tag) => (
            <Card key={tag.title} className="shadow-sm border border-gray-200">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-12 w-12 flex items-center justify-center">
                  <tag.icon className={`text-3xl ${tag.color}`} />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">{tag.title}</h3>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {tag.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
