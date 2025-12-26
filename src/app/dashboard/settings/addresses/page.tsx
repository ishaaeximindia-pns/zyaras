
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { AddressDocument } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Building, MapPin, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AddressFormDialog } from '@/components/dashboard/AddressFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

function AddressCard({ address, onEdit, onDelete }: { address: AddressDocument; onEdit: () => void; onDelete: () => void; }) {
  const Icon = address.type === 'Home' ? Home : address.type === 'Office' ? Building : MapPin;
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {address.type}
          {address.isDefault && <span className="text-xs font-normal text-muted-foreground">(Default)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
      </CardContent>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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

export default function AddressesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDocument | null>(null);

  const addressesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'addresses');
  }, [firestore, user]);

  const { data: addresses, isLoading } = useCollection<AddressDocument>(addressesCollectionRef);

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: AddressDocument) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (addressId: string) => {
    if (!addressesCollectionRef) return;
    const addressDocRef = collection(addressesCollectionRef.firestore, addressesCollectionRef.path, addressId);
    deleteDocumentNonBlocking(addressDocRef);
    toast({
        title: "Address Deleted",
        description: "The address has been successfully removed.",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manage Addresses</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove your shipping addresses.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {!isLoading && addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
            />
          ))}
        </div>
      ) : !isLoading && (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
            <CardHeader>
                <CardTitle>Your Address Book is Empty</CardTitle>
                <CardDescription>
                    Add a new address to get started with faster checkouts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Address
                </Button>
            </CardContent>
        </Card>
      )}

      <AddressFormDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        address={editingAddress}
      />
    </div>
  );
}
