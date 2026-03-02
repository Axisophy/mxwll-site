'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface WorkCardProps {
  title: string
  description: string
  category: string
  year: string
  slug: string
  thumbnail?: string
  videoUrl?: string
  featured?: boolean
}

export default function WorkCard({
  title,
  description,
  category,
  year,
  slug,
  thumbnail,
  videoUrl,
  featured = false,
}: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/work/${slug}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container with Overlay */}
      <div className="relative w-full bg-[#050508] overflow-hidden border border-[var(--border-light)]">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
            autoPlay={isHovered}
            loop
            muted
            playsInline
          />
        ) : thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={800}
            height={450}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div
            className="w-full bg-[#050508]"
            style={{ aspectRatio: '16/9' }}
          />
        )}

        {/* Overlay Content */}
        <div className="absolute top-6 left-6 right-6">
          <h3 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-white/80 transition-colors">
            {title}
          </h3>
          <p className="font-nhg text-sm md:text-base text-white/70 mb-2">
            {description}
          </p>
          <p className="font-mono text-xs text-white/50 uppercase tracking-wider">
            {category} · {year}
          </p>
        </div>
      </div>
    </Link>
  )
}
