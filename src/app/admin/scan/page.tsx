import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyRegistrationStaff } from '@/lib/auth-server';
import EntryScanner from '@/components/entry/EntryScanner';
import SessionRestore from '@/components/entry/SessionRestore';

export const metadata: Metadata = {
  title: 'Check-in scanner',
  robots: { index: false, follow: false },
};

/**
 * /admin/scan: the venue check-in scanner, for the registration team and admins only.
 * The role is checked here from the database (never from anything the client sends); every scan and check-in is
 * authorized again by /api/admin/entry/* and by the database functions behind them.
 */
export default async function ScanPage() {
  const source = { headers: await headers(), cookies: await cookies() };
  const auth = await verifyRegistrationStaff(source);

  if ('error' in auth) {
    // Expired access token but a refresh token is present: refresh once in the browser instead of bouncing to login.
    if (auth.status === 401 && source.cookies.get('inn_refresh_token')?.value) return <SessionRestore />;
    redirect(auth.status === 401 ? '/?auth=login&required=scan' : '/');
  }

  const name = auth.user.user_metadata?.full_name || auth.user.user_metadata?.name;
  const staffLabel = `${typeof name === 'string' && name ? name : auth.user.email ?? 'staff'} (${auth.role})`;
  return <EntryScanner staffLabel={staffLabel} />;
}
