'use client';

import { useRef, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '@/firebase/client';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, ImagePlus, Link2, Loader2 } from 'lucide-react';
import { resolveHeroImage } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ProductHeroImageFieldProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp';

export function ProductHeroImageField({ value, onChange, disabled }: ProductHeroImageFieldProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resolved = resolveHeroImage(value || '');

  const uploadFile = async (file: File | undefined) => {
    if (!file) return;
    if (!firebaseApp) {
      toast({
        title: 'Firebase not configured',
        description: 'Set NEXT_PUBLIC_FIREBASE_* environment variables.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Sign in to upload product images.',
        variant: 'destructive',
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please choose an image (JPG, PNG, GIF, or WebP).',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage(firebaseApp);
      const rawExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(rawExt) ? rawExt : 'jpg';
      const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const path = `products/images/${user.uid}/${safeName}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      onChange(url);
      toast({
        title: 'Image uploaded',
        description: 'The image URL has been saved. Submit the form to store it on the product.',
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      toast({
        title: 'Upload failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onPickGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void uploadFile(file);
    e.target.value = '';
  };

  const onPickCamera = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void uploadFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <input
        ref={galleryInputRef}
        type="file"
        className="sr-only"
        accept={ACCEPT}
        disabled={disabled || uploading}
        onChange={onPickGallery}
        aria-hidden
      />
      <input
        ref={cameraInputRef}
        type="file"
        className="sr-only"
        accept="image/*"
        capture="environment"
        disabled={disabled || uploading}
        onChange={onPickCamera}
        aria-hidden
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => galleryInputRef.current?.click()}
          className="touch-manipulation"
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 h-4 w-4" />
          )}
          {uploading ? 'Uploading…' : 'Choose image'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => cameraInputRef.current?.click()}
          className="touch-manipulation"
        >
          <Camera className="mr-2 h-4 w-4" />
          Take photo
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        On phones, <strong>Take photo</strong> opens the camera; <strong>Choose image</strong> opens gallery or files.
        Images are stored in your Firebase Storage bucket under <code className="rounded bg-muted px-1">products/images/&lt;your-user-id&gt;/</code>.
      </p>

      {resolved && (
        <div className="rounded-md border bg-muted/30 p-2">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview; arbitrary URLs */}
          <img
            src={resolved.imageUrl}
            alt="Product preview"
            className={cn('max-h-48 w-full max-w-xs rounded object-contain')}
          />
        </div>
      )}

      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-0 text-muted-foreground"
          onClick={() => setShowUrlField((v) => !v)}
        >
          <Link2 className="mr-2 h-3.5 w-3.5" />
          {showUrlField ? 'Hide URL field' : 'Or paste image URL / preset ID instead'}
        </Button>
        {showUrlField && (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or product-nexus-flow"
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
