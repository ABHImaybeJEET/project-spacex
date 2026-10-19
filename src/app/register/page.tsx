import { REGISTRATIONS_LIVE } from '@/config/launch';
import RegistrationsOpeningSoon from '@/components/coming-soon/RegistrationsOpeningSoon';
import { pageMetadata } from '@/lib/seo';
import { redirectToRegistrationFlow } from './redirectToRegistrationFlow';

export const metadata = pageMetadata(
  REGISTRATIONS_LIVE
    ? {
        title: 'Register',
        description: "Register for Innovision 2026: The Celestial Odyssey, Eastern India's largest techno-management fest, hosted by NIT Rourkela, Odisha.",
        path: '/register',
      }
    : {
        title: 'Registrations Opening Soon',
        description: "Registrations open soon for Innovision 2026: The Celestial Odyssey, Eastern India's largest techno-management fest, hosted by NIT Rourkela, Odisha.",
        path: '/register',
      }
);

/**
 * /register page route.
 * While registrations are closed (src/config/launch.ts) it shows the "opening soon" teaser to everyone.
 * Once open, it hands off to the registration flow (see redirectToRegistrationFlow).
 */
export default async function RegisterPage() {
  if (!REGISTRATIONS_LIVE) return <RegistrationsOpeningSoon />;
  return redirectToRegistrationFlow();
}
