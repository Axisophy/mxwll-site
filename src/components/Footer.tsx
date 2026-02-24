import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-black mt-24">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col gap-8">
          {/* Large MXWLL Logo */}
          <div className="w-full">
            <Link href="/" aria-label="MXWLL Home">
              <Logo className="h-20 md:h-24 lg:h-32 w-auto text-white transition-opacity hover:opacity-70" />
            </Link>
          </div>

          {/* Instagram Link */}
          <div className="flex flex-col gap-4">
            <a
              href="https://instagram.com/mxwll.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-white transition-colors w-fit"
            >
              Instagram
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/50 mt-4">
            © {currentYear} MXWLL
          </p>
        </div>
      </div>
    </footer>
  )
}
