import type { Metadata } from 'next';
import { REGISTRATIONS_OPEN } from '@/config/launch';
import RegistrationsOpeningSoon from '@/components/coming-soon/RegistrationsOpeningSoon';
import { redirectToRegistrationFlow } from './redirectToRegistrationFlow';

export const metadata: Metadata = {
  title: 'Registrations Opening Soon · INNOVISION 2026',
  description: 'Registrations for Innovision 2026, the techno-management fest of NIT Rourkela, open soon.',
};

/**
 * /register page route.
 * While registrations are closed (src/config/launch.ts) it shows the "opening soon" teaser to everyone.
 * Once open, it hands off to the registration flow (see redirectToRegistrationFlow).
 */
export default async function RegisterPage() {
  if (!REGISTRATIONS_OPEN) return <RegistrationsOpeningSoon />;
  return redirectToRegistrationFlow();
}
