'use client';

import React, { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { httpErrorMessage } from '@/lib/api-errors';

/*
 * The participant's QR entry pass (profile overlay). The QR holds only an opaque random token, fetched from
 * POST /api/pass for the signed-in owner and kept in memory only (never in localStorage). Shown only while the
 * registration is confirmed and the pass active; otherwise the status is explained instead.
 */

interface PassInfo {
  registrationStatus: 'none' | 'pending' | 'confirmed' | 'rejected';
  passStatus: 'none' | 'active' | 'revoked';
  registrationId: string | null;
  name: string | null;
  checkedIn: boolean;
  token: string | null;
}

type Load =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; pass: PassInfo; qr: string | null };

const GOLD = 'oklch(0.8 0.12 85)';
const box: React.CSSProperties = {
  marginBottom: '18px',
  padding: '16px',
  background: 'rgba(236,232,223,0.06)',
  border: '1px solid rgba(236,232,223,0.12)',
};
const label: React.CSSProperties = { margin: 0, fontSize: '12px', fontWeight: 700, letterSpacing: '.18em', color: GOLD };
const text: React.CSSProperties = { margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'rgba(236,232,223,0.8)' };

async function fetchPass(): Promise<PassInfo> {
  let token: string | undefined;
  try {
    token = (await getSupabase().auth.getSession()).data.session?.access_token;
  } catch {}
  const res = await fetch('/api/pass', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.pass) throw new Error(httpErrorMessage(res) || body.error || 'Could not load your entry pass.');
  return body.pass as PassInfo;
}

async function downloadPdf(pass: PassInfo, qr: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a5' }); // 148 x 210
  const W = 148;

  doc.setFillColor(20, 19, 18);
  doc.rect(0, 0, W, 210, 'F');
  doc.setTextColor(220, 183, 106);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NIT ROURKELA  ·  TECHNO-MANAGEMENT FEST', W / 2, 16, { align: 'center' });
  doc.setTextColor(236, 232, 223);
  doc.setFont('times', 'normal');
  doc.setFontSize(30);
  doc.text('Innovision 2026', W / 2, 30, { align: 'center' });
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.text('The Celestial Odyssey', W / 2, 38, { align: 'center' });

  doc.setFillColor(236, 232, 223);
  doc.rect(29, 48, 90, 90, 'F');
  doc.addImage(qr, 'PNG', 32, 51, 84, 84);

  doc.setTextColor(220, 183, 106);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ENTRY PASS', W / 2, 150, { align: 'center' });
  doc.setTextColor(236, 232, 223);
  doc.setFontSize(18);
  doc.text(doc.splitTextToSize(pass.name || '', 120), W / 2, 160, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Registration ID  ${pass.registrationId ?? ''}`, W / 2, 174, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(200, 196, 188);
  doc.text(
    doc.splitTextToSize('Show this pass together with your college ID card at the registration desk. Valid for one check-in. Do not share this QR.', 118),
    W / 2,
    188,
    { align: 'center' }
  );
  doc.save(`Innovision-2026-entry-pass-${pass.registrationId ?? 'pass'}.pdf`);
}

export default function EntryPassCard() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pass = await fetchPass();
        let qr: string | null = null;
        if (pass.token) {
          const QRCode = (await import('qrcode')).default;
          qr = await QRCode.toDataURL(pass.token, { errorCorrectionLevel: 'M', margin: 2, width: 512 });
        }
        if (!cancelled) setLoad({ state: 'ready', pass, qr });
      } catch (err) {
        if (!cancelled) setLoad({ state: 'error', message: err instanceof Error ? err.message : 'Could not load your entry pass.' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (load.state === 'loading') {
    return (
      <div style={box} aria-live="polite">
        <p style={label}>ENTRY PASS</p>
        <p style={{ ...text, marginTop: '10px' }}>Loading your entry pass…</p>
      </div>
    );
  }

  if (load.state === 'error') {
    return (
      <div style={box} role="alert">
        <p style={label}>ENTRY PASS</p>
        <p style={{ ...text, margin: '10px 0 12px' }}>{load.message}</p>
        <button
          type="button"
          onClick={() => { setLoad({ state: 'loading' }); setAttempt((n) => n + 1); }}
          style={{ minHeight: '40px', padding: '0 16px', background: 'transparent', color: '#ECE8DF', border: '1px solid rgba(236,232,223,0.4)', fontWeight: 700, fontSize: '12px', letterSpacing: '.12em', cursor: 'pointer' }}
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  const { pass, qr } = load;
  if (pass.registrationStatus !== 'confirmed' || pass.passStatus !== 'active' || !qr) {
    const message =
      pass.registrationStatus === 'pending'
        ? 'Your entry QR appears here once the Registration Team confirms your registration.'
        : pass.registrationStatus === 'rejected'
        ? 'There is no entry pass for a declined registration. Please contact the help desk.'
        : pass.passStatus === 'revoked'
        ? 'This entry pass was cancelled. Please contact the help desk.'
        : 'Your entry pass is not available yet. Please check again later.';
    return (
      <div style={box}>
        <p style={label}>ENTRY PASS</p>
        <p style={{ ...text, marginTop: '10px' }}>{message}</p>
      </div>
    );
  }

  return (
    <div style={box}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
        <p style={label}>ENTRY PASS</p>
        {pass.checkedIn && (
          <span style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', border: '1px solid currentColor', color: 'oklch(0.75 0.16 145)' }}>
            CHECKED IN
          </span>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- a locally generated data: URL, nothing to optimise */}
      <img
        src={qr}
        alt={`Entry pass QR code for ${pass.registrationId ?? 'your registration'}`}
        width={240}
        height={240}
        style={{ display: 'block', width: 'min(240px, 100%)', height: 'auto', margin: '0 auto 12px', background: '#ECE8DF', imageRendering: 'pixelated' }}
      />
      <p style={{ ...text, textAlign: 'center', marginBottom: '14px' }}>
        Show this QR <strong>together with your college ID card</strong> at the registration desk. Do not share it.
      </p>
      <button
        type="button"
        disabled={downloading}
        onClick={async () => {
          setDownloading(true);
          setDownloadError('');
          try {
            await downloadPdf(pass, qr);
          } catch {
            setDownloadError('Could not create the PDF. Take a screenshot of the QR instead.');
          } finally {
            setDownloading(false);
          }
        }}
        style={{
          width: '100%',
          minHeight: '44px',
          padding: '0 18px',
          background: 'transparent',
          color: '#ECE8DF',
          border: '1px solid rgba(236,232,223,0.45)',
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '.12em',
          cursor: downloading ? 'default' : 'pointer',
          opacity: downloading ? 0.6 : 1,
        }}
      >
        {downloading ? 'PREPARING PDF…' : 'DOWNLOAD PASS (PDF)'}
      </button>
      {downloadError && <p role="alert" style={{ ...text, marginTop: '8px', color: 'oklch(0.74 0.15 35)' }}>{downloadError}</p>}
    </div>
  );
}
