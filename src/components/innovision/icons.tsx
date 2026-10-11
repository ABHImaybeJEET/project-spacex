import type { HTMLAttributes, SVGProps } from 'react';

const LOGO_SRC = '/assets/INNOVISION%20LOGO.png';

/** Four-point star used throughout the design. */
export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 0C12.8 7.5 16.5 11.2 24 12C16.5 12.8 12.8 16.5 12 24C11.2 16.5 7.5 12.8 0 12C7.5 11.2 11.2 7.5 12 0Z" fill="currentColor"></path>
    </svg>
  );
}

/**
 * The INNOVISION mark. The art is white on transparent, so it is drawn as a mask over currentColor and
 * follows the surrounding text colour, like an inline SVG would. Size it with width (it stays square).
 */
export function Logo({ style, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      style={{
        display: 'inline-block',
        flex: 'none',
        aspectRatio: '1',
        backgroundColor: 'currentColor',
        WebkitMask: `url("${LOGO_SRC}") center / contain no-repeat`,
        mask: `url("${LOGO_SRC}") center / contain no-repeat`,
        ...style,
      }}
    />
  );
}
