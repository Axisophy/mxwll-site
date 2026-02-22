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
      className="work-card block group"
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
        <h3
          className={`
            font-medium mb-2 group-hover:text-[var(--accent-hover)] transition-colors
            ${featured ? 'text-2xl' : 'text-xl'}
          `}
        >
          {title}
        </h3>
        <p className="text-base text-[var(--text-secondary)] mb-3 leading-relaxed">
          {description}
        </p>
        <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">
          {category} · {year}
        </p>
      </div>
    </Link>
  )
}
