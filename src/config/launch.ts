/**
 * Launch switches for flows that are built but not yet live.
 *
 * While a switch is `false`, its page shows a teaser instead of the real flow:
 *   REGISTRATIONS_OPEN = false → /register renders <RegistrationsOpeningSoon />, and the REGISTER buttons lead there
 *   MERCH_STORE_OPEN   = false → /merch renders <MerchDroppingSoon />
 *
 * The real flows are untouched and come back by flipping the switch to `true`:
 *   registration: src/app/register/redirectToRegistrationFlow.ts → the auth / registration overlay in Innovision.tsx
 *   merch:        /merch renders <MerchStore /> (src/components/merch), with the pieces and form in src/config/merch.ts
 * The MERCH links and #/merch lead to /merch either way.
 */
export const REGISTRATIONS_OPEN = false;
export const MERCH_STORE_OPEN = true;

/** Where the REGISTER buttons point while registrations are closed. */
export const REGISTRATIONS_SOON_PATH = '/register';
/** The merch page, where every MERCH link points. */
export const MERCH_PATH = '/merch';
