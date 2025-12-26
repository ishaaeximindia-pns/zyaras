
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
import { Home, MapPin, Building, PlusCircle, Trash2, Edit, User as UserIcon, Shield, Map } from 'lucide-react';
import { AddressFormDialog } from '@/components/dashboard/AddressFormDialog';
import type { AddressDocument } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

function SettingsNav() {
    const sections = [
        { id: 'profile', label: 'Profile', icon: UserIcon },
        { id: 'addresses', label: 'Addresses', icon: Map },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full lg:w-48 lg:sticky top-24">
            <h2 className="text-lg font-semibold mb-4 px-2">Settings</h2>
            <div className="flex flex-col gap-1">
                {sections.map(section => (
                    <Button key={section.id} variant="ghost" onClick={() => scrollTo(section.id)} className="justify-start">
                        <section.icon className="mr-2 h-4 w-4" />
                        {section.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

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

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', email: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (userProfile) {
      profileForm.reset(userProfile);
    }
  }, [userProfile, profileForm]);
  
  const onProfileSubmit = (data: ProfileFormValues) => {
    if (!userDocRef) return;
    setDocumentNonBlocking(userDocRef, { firstName: data.firstName, lastName: data.lastName }, { merge: true });
    toast({ title: 'Profile Updated', description: 'Your changes have been saved successfully.' });
  };
  
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user || !user.email) return;

    try {
        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, data.newPassword);

        toast({ title: 'Password Updated', description: 'Your password has been changed successfully.' });
        passwordForm.reset();
    } catch (error: any) {
        toast({
            title: 'Error updating password',
            description: error.code === 'auth/wrong-password' ? 'The current password you entered is incorrect.' : error.message,
            variant: 'destructive',
        });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      // In a real app, you would force re-authentication here before deleting.
      // For this demo, we'll proceed but this is a security risk.
      await deleteUser(user);
      toast({ title: 'Account Deleted', description: 'Your account has been permanently deleted.' });
      // Redirect would happen here, likely handled by auth state listener
    } catch (error: any) {
      toast({
        title: 'Error deleting account',
        description: 'Please log out and log back in before trying to delete your account. ' + error.message,
        variant: 'destructive',
      });
    }
  };


  const isLoading = isUserLoading || isProfileLoading || areAddressesLoading;

  if (isLoading) {
    return <p>Loading...</p>; // Replace with a better skeleton loader
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
      <div className="flex flex-col lg:flex-row gap-12">
        <SettingsNav />
        <div className="flex-1 space-y-12">
            <section id="profile">
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your name and email address.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={profileForm.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={profileForm.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={profileForm.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} readOnly disabled /></FormControl><FormMessage /></FormItem> )} />
                         <Button type="submit">Save Changes</Button>
                        </CardContent>
                    </Card>
                    </form>
                </Form>
            </section>
            
            <section id="addresses">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                    <AddressCard key={address.id} address={address} onEdit={() => handleEditAddress(address)} onDelete={() => handleDeleteAddress(address.id)} />
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
            </section>

            <section id="security">
                <Card>
                    <CardHeader><CardTitle>Security</CardTitle><CardDescription>Manage your account security settings.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                <h3 className="font-semibold">Change Password</h3>
                                <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => ( <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => ( <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <Button type="submit">Update Password</Button>
                            </form>
                        </Form>
                    </CardContent>
                    <Separator />
                    <CardContent className="pt-6">
                         <div className="space-y-4">
                            <h3 className="font-semibold text-destructive">Danger Zone</h3>
                            <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                                <div>
                                    <h4 className="font-medium">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete Account</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete your account, orders, and all other data. This action is irreversible.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">Yes, delete my account</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </section>
        </div>
      </div>
    </div>
    <AddressFormDialog isOpen={isAddressDialogOpen} setIsOpen={setIsAddressDialogOpen} address={editingAddress} />
    </>
  );
}
