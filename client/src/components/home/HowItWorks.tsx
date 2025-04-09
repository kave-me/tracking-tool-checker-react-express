import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: 1,
    title: 'Enter URL',
    description: 'Paste your website URL in the checker tool'
  },
  {
    number: 2,
    title: 'Scan',
    description: 'Our tool checks for tracking tags in your website\'s code'
  },
  {
    number: 3,
    title: 'Get Insights',
    description: 'See which tracking tools are present or missing'
  }
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto text-center">
          Check your website's tracking setup in three simple steps
        </p>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="shadow-sm border border-gray-200">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">{step.title}</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
