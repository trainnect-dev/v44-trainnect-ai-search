import Link from 'next/link';

export function Footnote() {
  return (
    <div className="text-xs text-zinc-400 leading-5 hidden sm:block">
      This app utilizes{' '}
      <Link
        className="underline underline-offset-2"
        href="https://nextjs.org/"
        target="_blank"
      >
        Next.js
      </Link>{' '}
      15{' '}
      <Link
        className="underline underline-offset-2"
        href="https://sdk.vercel.ai/"
        target="_blank"
      >
        React 19
      </Link>
      . built with love by Gregory Kennedy{' '}
      <Link
        className="underline underline-offset-2"
        href="linkedin.com/in/gregorykennedymindfuldude/"
        target="_blank"
      >
        LinkedIn
      </Link>
      .
    </div>
  );
}