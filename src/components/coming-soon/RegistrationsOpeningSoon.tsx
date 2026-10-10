import ComingSoon from './ComingSoon';

/** /register while REGISTRATIONS_OPEN is false (src/config/launch.ts). */
export default function RegistrationsOpeningSoon() {
  return (
    <ComingSoon
      eyebrow="REGISTRATIONS · INNOVISION 2026"
      title={<>Registrations<br /><em>opening soon.</em></>}
      lede="The boarding gates for the Celestial Odyssey aren't open yet. Passes for every world go live shortly. Check back here to claim your seat on the voyage."
      status="PRE-LAUNCH"
      art="/assets/planet-ringed.webp"
      secondary={{ label: 'EXPLORE THE EVENTS', href: '/#/worlds/flagship-events' }}
      notes={['Four worlds of events', 'One pass for every world', 'Sign in with Google to register']}
    />
  );
}
