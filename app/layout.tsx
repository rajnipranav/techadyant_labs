import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthProvider } from './components/AuthProvider';
import { AuthControls } from './components/AuthControls';
import { AuthModal } from './components/AuthModal';
import { MobileNav } from './components/MobileNav';

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
  icons: {
    // Unified brand favicon shared with the main Techadyant site
    icon: [
      { url: 'https://i.ibb.co/rfwZ4YPq/white-monogram-01.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: 'https://i.ibb.co/rfwZ4YPq/white-monogram-01.png',
    shortcut: 'https://i.ibb.co/rfwZ4YPq/white-monogram-01.png',
  },
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
  { href: '/research', label: 'Atlas' },
  { href: '/newsletter', label: 'Sanket' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-916MZ965VB"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-916MZ965VB');`,
          }}
        />
        {/* Site-level entity graph: makes "Techadyant Labs" a recognised entity for
            search + AI engines (E-E-A-T / GEO). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://labs.techadyant.com/#org',
                  name: 'Techadyant Labs',
                  url: 'https://labs.techadyant.com',
                  logo: 'https://labs.techadyant.com/logo.png',
                  description:
                    'Independent, India-first strategic-intelligence research on the industrial systems of India — semiconductors, AI infrastructure, critical minerals, defence, and enterprise/technology sovereignty.',
                  knowsAbout: [
                    'India semiconductor industry',
                    'enterprise software sovereignty',
                    'AI infrastructure',
                    'critical minerals',
                    'India technology policy',
                    'industrial strategy',
                  ],
                  sameAs: ['https://techadyant.com'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://labs.techadyant.com/#website',
                  url: 'https://labs.techadyant.com',
                  name: 'Techadyant Labs',
                  inLanguage: 'en-IN',
                  publisher: { '@id': 'https://labs.techadyant.com/#org' },
                },
              ],
            }),
          }}
        />
      </head>
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
                  <MobileNav links={NAV_LINKS} />
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
                  <p className="pf-tagline">
                    The research division of{' '}
                    <a href="https://techadyant.com">Techadyant</a> — engineering high-reliability
                    systems for India’s defence, national security and critical infrastructure.
                  </p>
                </div>

                <div>
                  <h4>Publication</h4>
                  <ul role="list">
                    <li><Link href="/reports">Reports</Link></li>
                    <li><Link href="/signals">Signals</Link></li>
                    <li><Link href="/newsletter">Sanket</Link></li>
                    <li><Link href="/research">The Atlas</Link></li>
                  </ul>
                </div>

                <div>
                  <h4>Ecosystems</h4>
                  <ul role="list">
                    <li><Link href="/research/dependencies#semiconductors">Semiconductors</Link></li>
                    <li><Link href="/research/dependencies#critical-minerals">Critical minerals</Link></li>
                    <li><Link href="/research/dependencies#ai-infrastructure">AI infrastructure</Link></li>
                    <li><Link href="/research/dependencies#enterprise-software">Enterprise software</Link></li>
                  </ul>
                </div>

                <div>
                  <h4>Platform</h4>
                  <ul role="list">
                    <li><Link href="/about">About the platform</Link></li>
                    <li><Link href="/services">Commission research</Link></li>
                    <li><Link href="/account">Account</Link></li>
                    <li><Link href="/#subscribe">Subscribe</Link></li>
                    <li><a href="https://techadyant.com">Techadyant — main site</a></li>
                    <li><a href="mailto:labs@techadyant.com">labs@techadyant.com</a></li>
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
