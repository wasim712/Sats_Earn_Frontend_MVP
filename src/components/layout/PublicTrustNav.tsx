import Link from 'next/link';

const TRUST_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy-policy' },
  { name: 'Terms', href: 'legal/terms' },
];

export function PublicTrustNav() {
  return (
    <nav aria-label="Trust pages" className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 md:justify-start">
      {TRUST_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="transition-colors duration-200 hover:text-sats-orange-400"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
