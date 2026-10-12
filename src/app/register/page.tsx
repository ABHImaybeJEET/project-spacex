import { REGISTRATIONS_OPEN } from '@/config/launch';
import RegistrationsOpeningSoon from '@/components/coming-soon/RegistrationsOpeningSoon';
import { pageMetadata } from '@/lib/seo';
import { redirectToRegistrationFlow } from './redirectToRegistrationFlow';

export const metadata = pageMetadata(
  REGISTRATIONS_OPEN
    ? {
        title: 'Register',
        description: 'Register for Innovision 2026: The Celestial Odyssey, the techno-management fest of NIT Rourkela, Odisha.',
        path: '/register',
      }
    : {
        title: 'Registrations Opening Soon',
        description: 'Registrations for Innovision 2026: The Celestial Odyssey, the techno-management fest of NIT Rourkela, Odisha, open soon.',
        path: '/register',
      }
);

/**
 * /register page route.
 * While registrations are closed (src/config/launch.ts) it shows the "opening soon" teaser to everyone.
 * Once open, it hands off to the registration flow (see redirectToRegistrationFlow).
 */
export default async function RegisterPage() {
  if (!REGISTRATIONS_OPEN) return <RegistrationsOpeningSoon />;
  return redirectToRegistrationFlow();
}
