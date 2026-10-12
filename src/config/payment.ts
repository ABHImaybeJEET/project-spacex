/**
 * Registration payment details shown on the "Pay the fee" step of the registration form.
 *
 * The server never reads these: POST /api/register always records REGISTRATION_FEE_INR from src/lib/security.ts.
 * Keep REGISTRATION_FEE in step with it (a unit test checks they match).
 *
 * public/assets/upi-qr.svg encodes UPI_PAY_LINK. If the UPI ID, payee name or fee changes, regenerate it from the new
 * link (any QR encoder, error correction M) and check it scans to the new link.
 */
export const REGISTRATION_FEE = 499;
export const UPI_ID = 'innovision@sbi';
export const UPI_PAYEE_NAME = 'Innovision NIT Rourkela';
export const UPI_NOTE = 'Innovision 2026 registration';

/**
 * `upi://pay` deep link: opens the student's UPI app with the payee, amount and note filled in. The VPA stays
 * unencoded (its characters are URL-safe, and some UPI apps reject `%40` in place of `@`).
 */
export const UPI_PAY_LINK =
  'upi://pay?pa=' + UPI_ID +
  '&pn=' + encodeURIComponent(UPI_PAYEE_NAME) +
  '&am=' + REGISTRATION_FEE +
  '&cu=INR&tn=' + encodeURIComponent(UPI_NOTE);

/** Static QR code for UPI_PAY_LINK. */
export const UPI_QR_SRC = '/assets/upi-qr.svg';
