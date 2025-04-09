import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type FormValues = z.infer<typeof formSchema>;

export default function EmailSignup() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const subscribe = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/subscribe', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscribed successfully!",
        description: "You'll receive updates and tips in your inbox.",
      });
      setIsSuccess(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to subscribe",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FormValues) {
    subscribe.mutate(data);
  }
  
  return (
    <section id="subscribe" className="py-12 bg-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Get Updates & Tips</h2>
          <p className="mt-4 text-xl text-primary-100">
            Subscribe to receive guides, tips, and new feature announcements
          </p>
        </div>
        
        <div className="mt-8 max-w-md mx-auto">
          {isSuccess ? (
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium text-white">Thanks for subscribing!</h3>
              <p className="mt-2 text-primary-100">
                Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="sm:flex">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-5 py-3 rounded-md bg-white border-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-white/90 mt-1" />
                    </FormItem>
                  )}
                />
                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                    disabled={subscribe.isPending}
                  >
                    {subscribe.isPending ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
          <p className="mt-3 text-sm text-primary-200">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
