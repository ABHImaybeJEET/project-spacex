import { NextResponse } from 'next/server';
import { REGISTRATIONS_OPEN } from '@/config/launch';

/**
 * Server-side gate for the registration write endpoints (POST /api/register, POST /api/upload). Hiding the REGISTER
 * buttons is not enough: these routes are reachable with curl and a session token, so they check the switch too.
 * Server-only: imported by route handlers, never by client components.
 */

export const REGISTRATIONS_CLOSED_MESSAGE = 'Registrations are not open yet.';

/**
 * REGISTRATIONS_OPEN (src/config/launch.ts) is the only production switch. The integration tests drive the real route
 * handlers and need registration open; INNOVISION_TEST_REGISTRATIONS_OPEN does that, but only when NODE_ENV is 'test'.
 * `next build` / `next start` always run with NODE_ENV=production, so the override can't open a deployment, and nothing
 * from the request (body, query, headers) is ever consulted.
 */
export function registrationsOpen(): boolean {
  if (REGISTRATIONS_OPEN) return true;
  return process.env.NODE_ENV === 'test' && process.env.INNOVISION_TEST_REGISTRATIONS_OPEN === 'true';
}

export function registrationsClosedResponse() {
  return NextResponse.json({ error: REGISTRATIONS_CLOSED_MESSAGE }, { status: 403 });
}
