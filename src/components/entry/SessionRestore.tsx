'use client';

import { useEffect } from 'react';
import { fetchSessionFromDatabase, getCookie } from '@/lib/supabase';
import styles from './EntryScanner.module.css';

const LOGIN_URL = '/?auth=login&required=scan'; // the home page returns to /admin/scan after login
const FLAG = 'inv_scan_restore';

/**
 * Shown by /admin/scan when the access-token cookie has expired but a refresh token is still there (a phone left
 * idle for over an hour). Refreshes the session once through /api/auth/session, which re-issues the cookies, then
 * reloads; if that doesn't work, goes to the login screen. The flag stops a reload loop.
 */
export default function SessionRestore() {
  useEffect(() => {
    let alreadyTried = false;
    try {
      alreadyTried = sessionStorage.getItem(FLAG) === '1';
      sessionStorage.setItem(FLAG, '1');
    } catch {}
    if (alreadyTried) {
      window.location.replace(LOGIN_URL);
      return;
    }
    fetchSessionFromDatabase()
      .then((s) => {
        if (s.user || getCookie('inn_access_token')) window.location.reload();
        else window.location.replace(LOGIN_URL);
      })
      .catch(() => window.location.replace(LOGIN_URL));
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.center}>
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.sub}>Restoring your session…</p>
      </div>
    </div>
  );
}
