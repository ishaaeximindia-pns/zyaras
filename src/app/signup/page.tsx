
'use client';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/shared/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { useAuth, useFirestore, useUser, initiateEmailSignUp, initiateGoogleSignIn, initiatePhoneSignIn, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Chrome } from 'lucide-react';


const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;


export default function SignupPage() {
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

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
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
    // Initialize reCAPTCHA verifier only if auth is available
    if (!auth) return;
    
    if (typeof window !== 'undefined' && !recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container-signup', {
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
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, [auth, toast]);

  const onSubmit = async (data: SignupFormValues) => {
    if (!auth || !firestore) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      if (user) {
        const userProfile = {
          id: user.uid,
          email: user.email,
          firstName: data.firstName,
          lastName: data.lastName,
        };
        const userDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, userProfile, { merge: true });

        toast({
          title: 'Account Created!',
          description: 'You are now logged in.',
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
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
        description: 'Signed up with Google successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Google sign-up failed',
        description: error.message || 'An error occurred during Google sign-up.',
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
        title: 'Phone sign-up failed',
        description: error.message || 'An error occurred during phone sign-up.',
        variant: 'destructive',
      });
    }
  };

  const handleOTPVerification = async () => {
    if (!confirmationResult || !firestore) return;
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      if (user && firestore) {
        const userProfile = {
          id: user.uid,
          phoneNumber: user.phoneNumber,
          firstName: '',
          lastName: '',
        };
        const userDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
      }
      
      toast({
        title: 'Success',
        description: 'Phone number verified and account created successfully.',
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
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                            <Input placeholder="Max" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                            <Input placeholder="Robinson" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              <Button type="submit" className="w-full" disabled={isUserLoading || !auth || !firestore}>
                {isUserLoading ? 'Creating Account...' : 'Create an account'}
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
              disabled={isGoogleLoading || !auth || !firestore}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPhoneAuth(!showPhoneAuth)}
              disabled={!auth || !firestore}
              className="w-full"
            >
              📱 {showPhoneAuth ? 'Hide' : 'Sign up with'} Phone
            </Button>
          </div>

          {showPhoneAuth && (
            <div className="mt-4 space-y-3">
              {!confirmationResult ? (
                <>
                  <div>
                    <Label htmlFor="phone-signup">Phone Number</Label>
                    <Input
                      id="phone-signup"
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
                  <div id="recaptcha-container-signup"></div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="otp-signup">Enter OTP</Label>
                    <Input
                      id="otp-signup"
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
                      disabled={!otp || otp.length !== 6 || !firestore}
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
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
