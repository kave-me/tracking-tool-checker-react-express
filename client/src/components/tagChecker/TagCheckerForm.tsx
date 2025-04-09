import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TagResults } from '@shared/types';
import { useToast } from '@/hooks/use-toast';
import { isValidUrl } from '@/lib/validateUrl';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import ResultsDisplay from './ResultsDisplay';

const formSchema = z.object({
  url: z.string()
    .min(1, 'Please enter a URL')
    .refine(val => isValidUrl(val), 'Please enter a valid URL including http:// or https://')
});

type FormValues = z.infer<typeof formSchema>;

export default function TagCheckerForm() {
  const { toast } = useToast();
  const [results, setResults] = useState<TagResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const checkTags = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/check-tags', data);
      return response.json() as Promise<TagResults>;
    },
    onSuccess: (data) => {
      setResults(data);
      setError(null);
    },
    onError: (error) => {
      setResults(null);
      setError(error instanceof Error ? error.message : 'Failed to scan website. Please try again.');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to scan website',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(data: FormValues) {
    setResults(null);
    setError(null);
    checkTags.mutate(data);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tag Checker Tool</h2>
        <p className="mt-4 text-xl text-gray-600">
          Enter your website URL to check for tracking tags
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <div className="flex items-center relative">
                    <div className="flex items-center absolute left-0 top-0 h-full pl-3 pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="https://www.example.com"
                        className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-50 py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              size="lg" 
              disabled={checkTags.isPending}
            >
              {checkTags.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Now'
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Loading state */}
      {checkTags.isPending && (
        <div className="mt-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Scanning website for tracking tags...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && !checkTags.isPending && (
        <div className="mt-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error scanning website</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Results display */}
      {results && !checkTags.isPending && (
        <ResultsDisplay results={results} />
      )}
    </div>
  );
}
