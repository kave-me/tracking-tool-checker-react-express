import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, LockKeyhole, CheckCircle } from "lucide-react";
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

// Schema for reset password form
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_, navigate] = useLocation();

  useEffect(() => {
    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (!tokenParam) {
      setError("No reset token found. Please request a new password reset link.");
    } else {
      setToken(tokenParam);
    }
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string, password: string }) => {
      const res = await apiRequest("POST", "/api/reset-password", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to reset password. Please try again.");
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({
      token,
      password: data.password,
    });
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
              <CardTitle className="text-center">Password Reset Successful</CardTitle>
              <CardDescription className="text-center">
                Your password has been reset successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-gray-500 mb-4">
                You will be redirected to the login page in a few seconds.
              </p>
              <div className="flex justify-center">
                <Link href="/auth">
                  <Button>Go to Login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Reset Your Password</CardTitle>
              <CardDescription>
                Please create a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert className="mb-4 bg-red-50 text-red-800 border-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {!token ? (
                <div className="flex justify-center mt-4">
                  <Link href="/auth/forgot-password">
                    <Button>Request New Reset Link</Button>
                  </Link>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <div className="relative">
                            <LockKeyhole className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your new password"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <div className="relative">
                            <LockKeyhole className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm your new password"
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
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
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