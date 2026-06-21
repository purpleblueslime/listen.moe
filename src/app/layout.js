import localFont from 'next/font/local';
import '../styles/all.scss';

const leagueSpartan = localFont({
  src: '../fonts/league_spartan.ttf',
});

export default function html({ children }) {
  return (
    <html>
      <head>
        <link rel='icon' type='image/png' href='/listenmoe.png' />
        <title>listen.moe</title>
      </head>
      <body className={leagueSpartan.className}>{children}</body>
    </html>
  );
}
