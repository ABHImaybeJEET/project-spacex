/**
 * The official merch shown on /merch (src/app/merch/page.tsx). Orders go through the organisers' external order form:
 * every piece has its own BOOK NOW button, which opens that form in a new tab. The site keeps no cart and stores no orders.
 *
 * Still to come from the organisers: the form link, the colourways, the prices and the product photos.
 *   - MERCH_FORM_URL: until it is set, BOOK NOW shows "BOOKING OPENS SOON" and links nowhere.
 *   - colours: the names and swatches below are placeholders. A colour's `image` (a path under public/ or an ImageKit
 *     URL, ideally a 4:5 photo) replaces the drawn silhouette for that colour.
 *   - price: shown on the card once set (GST included); left out, the card shows no price.
 */

/** The order form (e.g. a Google Form) every BOOK NOW button opens, unless a piece has a `formUrl` of its own. */
export const MERCH_FORM_URL = '';

/**
 * Optional Google Form pre-fill: the `entry.<id>` names of the form's "item" and "colour" questions (from the form's
 * "Get pre-filled link"). When set, BOOK NOW opens the form with the piece and the colour picked on the card filled in.
 */
export const MERCH_FORM_PREFILL: { item?: string; colour?: string } = {};

export type GarmentKind = 'tee' | 'zipper' | 'hoodie';

export interface MerchColour {
  name: string;
  /** Swatch and silhouette colour. */
  swatch: string;
  /** Product photo for this colourway. */
  image?: string;
}

export interface MerchItem {
  id: string;
  kind: GarmentKind;
  name: string;
  desc: string;
  /** In rupees, GST included. */
  price?: number;
  sizes: string[];
  colours: MerchColour[];
  /** A form of its own for this piece, instead of MERCH_FORM_URL. */
  formUrl?: string;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Placeholder colourways until the official ones are shared; give each piece its own list if they differ.
const COLOURS: MerchColour[] = [
  { name: 'Black', swatch: '#1b1a19' },
  { name: 'White', swatch: '#efede8' },
  { name: 'Navy', swatch: '#1f2c4a' },
  { name: 'Maroon', swatch: '#64212a' },
];

export const MERCH: MerchItem[] = [
  { id: 'tee', kind: 'tee', name: 'Official T-Shirt', desc: 'Heavyweight cotton tee with the Innovision 2026 Celestial Odyssey print.', sizes: SIZES, colours: COLOURS },
  { id: 'zipper', kind: 'zipper', name: 'Official Zipper', desc: 'Full-zip fleece jacket with a hood and the Innovision wordmark on the chest.', sizes: SIZES, colours: COLOURS },
  { id: 'hoodie', kind: 'hoodie', name: 'Official Hoodie', desc: 'Brushed fleece pullover hoodie with a kangaroo pocket and the Celestial Odyssey print.', sizes: SIZES, colours: COLOURS },
];

/** The address BOOK NOW opens for a piece in a colour, or null while there is no form yet. */
export function bookingUrl(item: MerchItem, colour: MerchColour): string | null {
  const base = item.formUrl || MERCH_FORM_URL;
  if (!base) return null;
  const { item: itemField, colour: colourField } = MERCH_FORM_PREFILL;
  if (!itemField && !colourField) return base;
  const url = new URL(base);
  url.searchParams.set('usp', 'pp_url');
  if (itemField) url.searchParams.set(itemField, item.name);
  if (colourField) url.searchParams.set(colourField, colour.name);
  return url.toString();
}
