
'use client';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/shared/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuth, useUser, useFirestore, initiateEmailSignIn, initiateGoogleSignIn, initiatePhoneSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Chrome } from 'lucide-react';


const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState('');
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    if (auth && typeof window !== 'undefined' && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          toast({
            title: 'reCAPTCHA expired',
            description: 'Please try again.',
            variant: 'destructive',
          });
        },
      });
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, [auth, toast]);

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await initiateEmailSignIn(auth, data.email, data.password);
      toast({
        title: 'Logging in...',
        description: 'You will be redirected shortly.',
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }
    setIsGoogleLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      // Create user profile if it doesn't exist
      if (user && firestore) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userProfile = {
          id: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        };
        setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
      }
      toast({
        title: 'Success',
        description: 'Signed in with Google successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Google sign-in failed',
        description: error.message || 'An error occurred during Google sign-in.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!auth || !recaptchaVerifierRef.current) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const result = await initiatePhoneSignIn(auth, formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      toast({
        title: 'OTP Sent',
        description: 'Please check your phone for the verification code.',
      });
    } catch (error: any) {
      toast({
        title: 'Phone sign-in failed',
        description: error.message || 'An error occurred during phone sign-in.',
        variant: 'destructive',
      });
    }
  };

  const handleOTPVerification = async () => {
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Success',
        description: 'Phone number verified successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'OTP verification failed',
        description: error.message || 'Invalid verification code.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your email below to log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                        </Link>
                    </div>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isUserLoading || !auth}>
                {isUserLoading ? 'Loading...' : 'Log in'}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || !auth}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPhoneAuth(!showPhoneAuth)}
              disabled={!auth}
              className="w-full"
            >
              📱 {showPhoneAuth ? 'Hide' : 'Sign in with'} Phone
            </Button>
          </div>

          {showPhoneAuth && (
            <div className="mt-4 space-y-3">
              {!confirmationResult ? (
                <>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handlePhoneSignIn}
                    disabled={!phoneNumber || !auth}
                    className="w-full"
                  >
                    Send OTP
                  </Button>
                  <div id="recaptcha-container"></div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="mt-1"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleOTPVerification}
                      disabled={!otp || otp.length !== 6}
                      className="flex-1"
                    >
                      Verify OTP
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setConfirmationResult(null);
                        setOtp('');
                      }}
                    >
                      Change Number
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
