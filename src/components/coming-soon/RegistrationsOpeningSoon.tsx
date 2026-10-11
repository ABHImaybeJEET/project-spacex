import ComingSoon from './ComingSoon';

/** /register while REGISTRATIONS_OPEN is false (src/config/launch.ts). */
export default function RegistrationsOpeningSoon() {
  return (
    <ComingSoon
      title={<>Registrations<br /><em>opening soon.</em></>}
      secondary={{ label: 'EXPLORE THE EVENTS', href: '/#/worlds/flagship-events' }}
    />
  );
}
