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
      className="block group border border-black/10 overflow-hidden transition-colors hover:border-black/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container */}
      <div className="relative w-full bg-[var(--bg-secondary)] overflow-hidden">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            style={{ aspectRatio: featured ? '16/9' : '16/10' }}
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
            height={featured ? 450 : 500}
            className="w-full h-full object-cover"
            style={{ aspectRatio: featured ? '16/9' : '16/10' }}
          />
        ) : (
          <div
            className="w-full bg-[var(--bg-tertiary)]"
            style={{ aspectRatio: featured ? '16/9' : '16/10' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:text-[var(--accent-hover)] transition-colors">
          {title}
        </h3>
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-3">
          {description}
        </p>
        <p className="font-mono text-xs text-[var(--text-tertiary)]">
          {category} · {year}
        </p>
      </div>
    </Link>
  )
}
