import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const res = await apiRequest("POST", "/api/forgot-password", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      // In development we return the token so we can manually reset the password
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Track to Measure
          </h1>
        </div>

        {isSubmitted ? (
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent password reset instructions to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resetToken && (
                <Alert className="mb-4 bg-yellow-50 text-yellow-800 border-yellow-300">
                  <AlertDescription>
                    <p className="font-bold mb-2">Development Mode</p>
                    <p className="mb-2">Your reset token is:</p>
                    <p className="bg-gray-100 p-2 rounded text-sm break-all">{resetToken}</p>
                    <p className="mt-2">
                      <Link href={`/auth/reset-password?token=${resetToken}`} className="text-primary hover:underline">
                        Click here to reset your password
                      </Link>
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-center text-sm text-gray-500 mb-4">
                Please check your inbox and spam/junk folders. If you don't receive an email within a few minutes, you can try again.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                  Try Again
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth" className="text-sm text-primary hover:underline flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Forgot Your Password?</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              className="pl-10"
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
                    className="w-full"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth" className="text-sm text-primary hover:underline flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}