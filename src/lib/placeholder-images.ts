import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

/** Resolved image for product.heroImage: built-in id, or a direct https URL you paste in admin. */
export type ResolvedHeroImage = {
  imageUrl: string;
  imageHint: string;
  /** True when heroImage is a full URL — use a plain <img> so any host works without Next.js config. */
  isDirectUrl: boolean;
};

/**
 * Resolve `product.heroImage` to a displayable URL.
 * - If value looks like `https://...`, use it as-is (host images anywhere, then paste the URL in admin).
 * - Otherwise treat it as an id from `placeholder-images.json` (e.g. `product-nexus-flow`).
 */
export function resolveHeroImage(heroImage: string | undefined | null): ResolvedHeroImage | null {
  if (!heroImage?.trim()) return null;
  const t = heroImage.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) {
    return { imageUrl: t, imageHint: 'product', isDirectUrl: true };
  }
  const found = PlaceHolderImages.find((p) => p.id === t);
  if (!found) return null;
  return {
    imageUrl: found.imageUrl,
    imageHint: found.imageHint,
    isDirectUrl: false,
  };
}
