import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthProvider } from './components/AuthProvider';
import { AuthControls } from './components/AuthControls';
import { AuthModal } from './components/AuthModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://labs.techadyant.com'),
  title: {
    default: 'Techadyant Labs — Strategic intelligence on India’s industrial systems',
    template: '%s — Techadyant Labs',
  },
  description:
    'Independent strategic intelligence on India’s industrial transformation, infrastructure systems, semiconductors, AI infrastructure and second-order economic change.',
  openGraph: {
    type: 'website',
    siteName: 'Techadyant Labs',
    title: 'Techadyant Labs — Strategic intelligence on India’s industrial systems',
    description:
      'Independent strategic intelligence on India’s industrial transformation, infrastructure systems and emerging technologies.',
  },
};

const NAV_LINKS = [
  { href: '/reports', label: 'Reports' },
  { href: '/signals', label: 'Signals' },
  { href: '/research', label: 'Research' },
  { href: '/briefings', label: 'Briefings' },
  { href: '/about', label: 'About' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            {/* Masthead */}
            <header className="masthead" role="banner">
              <div className="masthead-inner">
                <Link href="/" className="masthead-brand" aria-label="Techadyant Labs — home">
                  <img className="mark-img" src="https://i.ibb.co/rfwZ4YPq/white-monogram-01.png" alt="Techadyant Labs" width={26} height={26} />
                  <span className="wordmark">
                    <b>Techadyant</b> <span className="dim">Labs</span>
                  </span>
                </Link>

                <ul className="masthead-nav" role="list">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href}>{label}</Link>
                    </li>
                  ))}
                </ul>

                <div className="masthead-actions">
                  <ThemeToggle />
                  <Link href="/#subscribe" className="btn-subscribe">Subscribe</Link>
                  <AuthControls />
                </div>
              </div>
            </header>

            {/* Content */}
            <main id="main-content">{children}</main>

            {/* Publication footer */}
            <footer className="pub-footer">
              <div className="pub-footer-inner">
                <div className="pf-brand">
                  <Link href="/" aria-label="Techadyant Labs — home">
                    <img className="mark-img" src="https://i.ibb.co/rfwZ4YPq/white-monogram-01.png" alt="Techadyant Labs" width={26} height={26} />
                    <span className="wordmark">Techadyant Labs</span>
                  </Link>
                  <p className="pf-tagline">
                    Independent strategic intelligence on India’s industrial transformation,
                    infrastructure systems and emerging technologies.
                  </p>
                </div>

                <div>
                  <h4>Publication</h4>
                  <ul role="list">
                    <li><Link href="/reports">Reports</Link></li>
                    <li><Link href="/signals">Signals</Link></li>
                    <li><Link href="/briefings">Briefings</Link></li>
                    <li><Link href="/research">Research themes</Link></li>
                  </ul>
                </div>

                <div>
                  <h4>Themes</h4>
                  <ul role="list">
                    <li><Link href="/research#semiconductors">Semiconductor ecosystems</Link></li>
                    <li><Link href="/research#infrastructure">Industrial infrastructure</Link></li>
                    <li><Link href="/research#strategic-tech">Strategic technology</Link></li>
                    <li><Link href="/research#economic-geography">Economic geography</Link></li>
                  </ul>
                </div>

                <div>
                  <h4>Platform</h4>
                  <ul role="list">
                    <li><Link href="/about">About the platform</Link></li>
                    <li><Link href="/account">Account</Link></li>
                    <li><Link href="/#subscribe">Subscribe</Link></li>
                    <li><a href="mailto:research@techadyant.com">research@techadyant.com</a></li>
                  </ul>
                </div>
              </div>

              <div className="pub-footer-bottom">
                <p>
                  <span className="tricolor" aria-hidden="true" />
                  © {new Date().getFullYear()} Techadyant Labs. India-first strategic research.
                </p>
                <p>Independent · Reader-supported · No sponsored coverage</p>
              </div>
            </footer>

            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
