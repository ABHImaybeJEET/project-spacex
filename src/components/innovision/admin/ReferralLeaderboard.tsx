'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { httpErrorMessage } from '@/lib/api-errors';

/*
 * Admin "Leaderboard" tab (admins and the registration team): who brought in the most registrations with their
 * referral code. Read from GET /api/admin/referrals, which pages on the server (30 per page). Only referrers with at
 * least one confirmed or pending referral are listed; rank counts confirmed (approved) referrals only.
 */

interface ReferralLeaderboardProps {
  getAuthToken: () => Promise<string | null>;
}

interface Referrer {
  rank: number;
  id: string;
  registration_id: string;
  name: string;
  email: string;
  college: string;
  referral_code: string;
  status: 'pending' | 'confirmed';
  confirmed_referrals: number;
  pending_referrals: number;
}

const GOLD = 'oklch(0.8 0.12 85)';
const th: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', color: 'rgba(236,232,223,0.6)', borderBottom: '1px solid rgba(236,232,223,0.14)', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '10px 12px', fontSize: '13px', borderBottom: '1px solid rgba(236,232,223,0.08)', verticalAlign: 'top' };
const num: React.CSSProperties = { ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700 };
const smallBtn: React.CSSProperties = { padding: '6px 12px', border: '1px solid rgba(236,232,223,0.35)', background: 'transparent', color: '#ECE8DF', fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', cursor: 'pointer', whiteSpace: 'nowrap' };
const input: React.CSSProperties = { minHeight: '40px', padding: '0 12px', background: 'rgba(236,232,223,0.06)', border: '1px solid rgba(236,232,223,0.2)', color: '#ECE8DF', fontSize: '14px' };

export default function ReferralLeaderboard({ getAuthToken }: ReferralLeaderboardProps) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Referrer[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestSeq = useRef(0);
  // AdminDashboard recreates getAuthToken on every render; read it through a ref so loading isn't restarted each time.
  const tokenRef = useRef(getAuthToken);
  useEffect(() => {
    tokenRef.current = getAuthToken;
  }, [getAuthToken]);

  // Debounced search.
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      const token = await tokenRef.current();
      const params = new URLSearchParams({ page: String(page) });
      if (query) params.set('q', query);
      const res = await fetch(`/api/admin/referrals?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        cache: 'no-store',
      });
      const body = await res.json().catch(() => ({}));
      if (seq !== requestSeq.current) return; // a newer request superseded this one
      if (!res.ok) throw new Error(httpErrorMessage(res) || body.error || 'Failed to load the leaderboard.');
      const list: Referrer[] = Array.isArray(body.referrers) ? body.referrers : [];
      // The board shrank under a later page (e.g. a search): start again from the first page.
      if (!list.length && page > 1) { setPage(1); return; }
      setRows(list);
      setTotal(Number(body.total) || 0);
      if (Number(body.pageSize) > 0) setPageSize(Number(body.pageSize));
      setError('');
    } catch (err) {
      if (seq === requestSeq.current) setError(err instanceof Error ? err.message : 'Failed to load the leaderboard.');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    return () => clearTimeout(first);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <p style={{ margin: 0, maxWidth: '720px', fontSize: '13px', lineHeight: 1.5, color: 'rgba(236,232,223,0.6)' }}>
          Registrants whose referral code was used. <strong style={{ color: '#ECE8DF' }}>Accepted</strong> counts referred
          registrations that were approved and decides the rank; <strong style={{ color: '#ECE8DF' }}>Pending</strong> are
          still awaiting payment review. Rejected ones never count.
        </p>
        <button type="button" style={smallBtn} onClick={() => void load()} disabled={loading}>
          {loading ? 'LOADING…' : 'REFRESH'}
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, email, college, referral code or registration ID"
        aria-label="Search the leaderboard"
        style={{ ...input, width: '100%', boxSizing: 'border-box' }}
      />

      {error && (
        <div role="alert" style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid oklch(0.74 0.15 35)', color: 'oklch(0.85 0.12 35)', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', border: '1px solid rgba(236,232,223,0.12)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
          <thead>
            <tr>
              <th style={th}>RANK</th>
              <th style={th}>NAME</th>
              <th style={th}>EMAIL</th>
              <th style={th}>COLLEGE</th>
              <th style={th}>REFERRAL CODE</th>
              <th style={{ ...th, textAlign: 'right' }}>ACCEPTED</th>
              <th style={{ ...th, textAlign: 'right' }}>PENDING</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ ...num, textAlign: 'left', color: r.confirmed_referrals > 0 && r.rank <= 3 ? GOLD : '#ECE8DF' }}>
                  {r.confirmed_referrals > 0 ? `#${r.rank}` : '—'}
                </td>
                <td style={td}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(236,232,223,0.5)' }}>
                    {r.registration_id}{r.status === 'pending' ? ' · payment under review' : ''}
                  </div>
                </td>
                <td style={{ ...td, wordBreak: 'break-all' }}>{r.email}</td>
                <td style={td}>{r.college}</td>
                <td style={{ ...td, fontFamily: 'monospace', letterSpacing: '.12em' }}>{r.referral_code}</td>
                <td style={{ ...num, color: GOLD, fontSize: '15px' }}>{r.confirmed_referrals}</td>
                <td style={{ ...num, color: 'rgba(236,232,223,0.7)' }}>{r.pending_referrals}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td style={{ ...td, textAlign: 'center', color: 'rgba(236,232,223,0.6)' }} colSpan={7}>
                  {loading ? 'Loading…' : query ? 'No referrers match this search.' : 'No referral code has been used yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(236,232,223,0.65)' }}>
          {total > 0 ? `SHOWING ${start}–${end} OF ${total} REFERRERS` : ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" style={smallBtn} disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>PREV</button>
          <span style={{ fontSize: '13px', color: 'rgba(236,232,223,0.7)' }}>Page {page} of {totalPages}</span>
          <button type="button" style={smallBtn} disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>NEXT</button>
        </div>
      </div>
    </div>
  );
}
