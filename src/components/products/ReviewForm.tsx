
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long').max(500, 'Comment must be 500 characters or less'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  userId: string;
  userName: string;
}

export function ReviewForm({ productId, userId, userName }: ReviewFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });
  
  const onSubmit = (data: ReviewFormValues) => {
    if (!firestore) return;

    const reviewsCollection = collection(firestore, 'products', productId, 'reviews');
    const newReview = {
        id: doc(reviewsCollection).id,
        productId,
        userId,
        userName,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
    };
    
    addDocumentNonBlocking(reviewsCollection, newReview);

    toast({
        title: 'Review Submitted!',
        description: 'Thank you for your feedback.',
    });
    
    // Redirect to remove the ?review=true query param
    router.replace(`/products/${productId}`);
  };

  const currentRating = form.watch('rating');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your thoughts about this product.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div 
                        className="flex items-center gap-1"
                        onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer',
                            (hoverRating || currentRating) >= star
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground'
                          )}
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoverRating(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} placeholder="What did you like or dislike?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Review</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
