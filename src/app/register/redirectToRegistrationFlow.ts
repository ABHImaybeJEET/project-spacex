import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * The live /register behaviour, used while REGISTRATIONS_OPEN is true (src/config/launch.ts).
 * Protected by the request proxy and this server-side cookie check.
 * If authenticated, redirects to the main experience with the registration overlay open.
 * If unauthenticated, redirects to login/signup.
 */
export async function redirectToRegistrationFlow(): Promise<never> {
  const cookieStore = await cookies();
  const hasAuth =
    cookieStore.has('inn_access_token') ||
    cookieStore.has('inn_refresh_token') ||
    cookieStore.getAll().some(
      (c) =>
        c.name.includes('-auth-token') ||
        c.name.includes('supabase-auth') ||
        c.name === 'sb-access-token'
    );

  if (!hasAuth) {
    redirect('/?auth=login&required=register');
  }

  redirect('/?open=register');
}
