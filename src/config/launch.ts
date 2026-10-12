/**
 * Launch switches for flows that are built but not yet live.
 *
 * While a switch is `false`, its entry points (HUD / hero / closing REGISTER buttons, MERCH nav and teaser links)
 * send visitors to a teaser page instead of the real flow:
 *   REGISTRATIONS_OPEN = false → /register renders <RegistrationsOpeningSoon />
 *   MERCH_STORE_OPEN   = false → /merch renders <MerchDroppingSoon />, and #/merch redirects there
 *
 * The real flows are untouched and come back by flipping the switch to `true`:
 *   registration: src/app/register/redirectToRegistrationFlow.ts → the auth / registration overlay in Innovision.tsx
 *   merch:        the #/merch store view, src/components/innovision/MerchView.tsx
 */
export const REGISTRATIONS_OPEN = true;
export const MERCH_STORE_OPEN = false;

/** Where the REGISTER buttons point while registrations are closed. */
export const REGISTRATIONS_SOON_PATH = '/register';
/** Where MERCH links point while the store is closed. */
export const MERCH_SOON_PATH = '/merch';
