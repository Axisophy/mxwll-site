interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      id="mxwll-logo"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 566.93 226.77"
      className={className}
      aria-label="MXWLL"
    >
      <defs>
        <style>{`
          .logo-fill {
            fill: currentColor;
          }
        `}</style>
      </defs>
      <polygon className="logo-fill" points="113.39 226.77 0 226.77 56.69 0 113.39 226.77"/>
      <polygon className="logo-fill" points="226.77 226.77 113.39 226.77 170.08 0 226.77 226.77"/>
      <polygon className="logo-fill" points="226.77 0 340.16 0 283.46 113.39 226.77 0"/>
      <polygon className="logo-fill" points="340.16 226.54 226.77 226.54 283.46 113.15 340.16 226.54"/>
      <polygon className="logo-fill" points="453.54 0 566.93 0 510.24 226.77 453.54 0"/>
      <polygon className="logo-fill" points="340.16 0 453.54 0 396.85 226.77 340.16 0"/>
    </svg>
  )
}
