// ImageKit hosts event posters and gallery images only. Payment proofs live in the private Supabase Storage bucket
// (see src/lib/payment-proofs.ts).
import ImageKit from 'imagekit';

let instance: ImageKit | null = null;

/**
 * Created on first use, not at import: the SDK throws on a missing key, and `next build` evaluates route modules
 * while collecting page data, when runtime credentials may not be available.
 */
export function getImageKit(): ImageKit {
  if (instance) return instance;
  instance = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  });
  return instance;
}
