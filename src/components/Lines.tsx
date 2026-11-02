import type { ElementType } from 'react'

type Props = {
  lines: string[]
  as?: ElementType
  className?: string
  /** indices of lines rendered in the accent colour */
  accent?: number[]
  /** indices of lines nudged right, editorial-style */
  indent?: number[]
}

export function Lines({ lines, as: Tag = 'h2', className = '', accent = [], indent = [] }: Props) {
  return (
    <Tag className={`display ${className}`} data-reveal aria-label={lines.join(' ')}>
      {lines.map((l, i) => (
        <span
          key={i}
          aria-hidden
          className={`line${accent.includes(i) ? ' is-accent' : ''}${indent.includes(i) ? ' is-indent' : ''}`}
        >
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  )
}
