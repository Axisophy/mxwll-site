'use client';

import { useEffect, useState } from 'react';
import StellarDemoDesktop from './StellarDemo.desktop';
import StellarDemoMobile from './StellarDemo.mobile';

interface StellarDemoProps {
  className?: string;
}

export default function StellarDemo({ className }: StellarDemoProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);

    return () => {
      window.removeEventListener('resize', updateDevice);
    };
  }, []);

  if (isMobile) {
    return <StellarDemoMobile className={className} />;
  }

  return <StellarDemoDesktop className={className} />;
}
