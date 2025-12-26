
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirestore, useUser, useDoc, useMemoFirebase, setDocumentNonBlocking, useCollection, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, MapPin, Building, PlusCircle, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { AddressFormDialog } from '@/components/dashboard/AddressFormDialog';
import type { AddressDocument } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function AddressCard({ address, onEdit, onDelete }: { address: AddressDocument; onEdit: () => void; onDelete: () => void; }) {
  const Icon = address.type === 'Home' ? Home : address.type === 'Office' ? Building : MapPin;
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {address.type}
          {address.isDefault && <span className="text-xs font-normal text-muted-foreground">(Default)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
      </CardContent>
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7">
                <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this address from your account.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}


export default function ProfileSettingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDocument | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<ProfileFormValues>(userDocRef);
  
  const addressesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'addresses');
  }, [firestore, user]);

  const { data: addresses, isLoading: areAddressesLoading } = useCollection<AddressDocument>(addressesCollectionRef);

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: AddressDocument) => {
    setEditingAddress(address);
    setIsAddressDialogOpen(true);
  };
  
  const handleDeleteAddress = (addressId: string) => {
    if (!addressesCollectionRef) return;
    const addressDocRef = doc(addressesCollectionRef.firestore, addressesCollectionRef.path, addressId);
    deleteDocumentNonBlocking(addressDocRef);
    toast({
        title: "Address Deleted",
        description: "The address has been successfully removed.",
    });
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset(userProfile);
    }
  }, [userProfile, form]);
  
  const onSubmit = (data: ProfileFormValues) => {
    if (!userDocRef) return;
    
    const dataToSave = {
        firstName: data.firstName,
        lastName: data.lastName,
    };
    
    setDocumentNonBlocking(userDocRef, dataToSave, { merge: true });
    
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  const isLoading = isUserLoading || isProfileLoading || areAddressesLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                     <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }


  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information, addresses, and account settings.
        </p>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your name and email address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input {...field} readOnly disabled /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <Button type="submit">Save Changes</Button>
                </CardContent>
            </Card>
            </form>
        </Form>
        <div className="space-y-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Address Book</CardTitle>
                  <CardDescription>Manage your saved shipping addresses.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddNewAddress}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                </Button>
              </CardHeader>
              <CardContent>
                 {addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {addresses.map((address) => (
                            <AddressCard 
                            key={address.id} 
                            address={address} 
                            onEdit={() => handleEditAddress(address)}
                            onDelete={() => handleDeleteAddress(address.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>You haven't saved any addresses yet.</p>
                    </div>
                 )}
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <AddressFormDialog 
        isOpen={isAddressDialogOpen} 
        setIsOpen={setIsAddressDialogOpen} 
        address={editingAddress}
      />
    </>
  );
}
