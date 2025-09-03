// Common masking utilities for consistent PII handling across the app
// - Names: show first character only; mask the rest with '*'
// - Resident ID: show first 6 digits; mask the remaining 7 as '*', format as XXXXXX-*******
// - Phone number: mask the last 4 digits as '*', keep formatting with hyphens
// - Card number: show first 4 and last 4 digits; mask middle groups with '****'

const STAR = '*'

const repeatStar = (count: number): string => (count > 0 ? STAR.repeat(count) : '')

export function maskName(fullName: string | undefined): string {
  if (!fullName || typeof fullName !== 'string') return ''
  const normalize = fullName.trim()
  if (!normalize) return ''
  // Split by whitespace, and hyphen inside token; keep delimiters
  const maskPart = (part: string): string => {
    if (!part) return ''
    const first = part.charAt(0)
    const rest = part.slice(1)
    return `${first || ''}${repeatStar(rest.length)}`
  }
  return normalize
    .split(' ')
    .map((segment) => segment.split('-').map(maskPart).join('-'))
    .join(' ')
}

export function maskResidentId(input: string): string {
  if (!input) return ''
  const digits = (input.match(/\d/g) || []).join('')
  if (digits.length < 7) return repeatStar(digits.length)
  const front = digits.slice(0, 6)
  const masked = repeatStar(Math.min(7, Math.max(0, digits.length - 6)))
  return `${front}-${masked}`
}

export function maskPhone(input: string): string {
  if (!input) return ''
  const digits = (input.match(/\d/g) || []).join('')
  if (!digits) return ''
  // Keep last 4 masked
  const last = Math.min(4, digits.length)
  const head = digits.slice(0, digits.length - last)
  const tail = repeatStar(last)
  // Format common groups (3-4-4 for 11, 3-3-4 for 10)
  const concat = `${head}${tail}`
  if (concat.length === 11) return `${concat.slice(0,3)}-${concat.slice(3,7)}-${concat.slice(7)}`
  if (concat.length === 10) return `${concat.slice(0,3)}-${concat.slice(3,6)}-${concat.slice(6)}`
  // Fallback to generic grouping by 3-4-? if possible
  if (concat.length > 7) return `${concat.slice(0,3)}-${concat.slice(3,concat.length-4)}-${concat.slice(concat.length-4)}`
  return concat
}

export function maskCardNumber(input: string): string {
  if (!input) return ''
  const digits = (input.match(/\d/g) || []).join('')
  if (digits.length < 8) return repeatStar(digits.length)
  const groups: string[] = []
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4))
  }
  if (groups.length <= 2) {
    // Not enough groups to have a middle; mask second half
    const first = groups[0] || ''
    const restDigits = digits.slice(first.length)
    return `${first} ${repeatStar(restDigits.length)}`.trim()
  }
  const first = groups[0]
  const last = groups[groups.length - 1]
  const middleMasked = groups.slice(1, -1).map(() => '****')
  return [first, ...middleMasked, last].join(' ')
}

// Generic trailing mask helper (keep first visiblePrefix characters, mask the rest)
export function maskTrailing(input: string, visiblePrefix: number): string {
  if (!input) return ''
  const str = String(input)
  const keep = Math.max(0, Math.min(visiblePrefix, str.length))
  return str.slice(0, keep) + repeatStar(str.length - keep)
}


