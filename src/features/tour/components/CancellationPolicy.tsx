"use client"

import type { TourRefund } from '@/types/tour'
import { AlertTriangle, Info, BadgePercent } from 'lucide-react'

type Props = {
  refund: TourRefund
  description?: string | null
  cancellationHours?: number | null
  pivotHoursOverride?: number | null
  labels?: {
    title?: string
    freeTitle?: string
    left?: string
    right?: string
  }
  colors?: {
    leftBg?: string
    rightBg?: string
    divider?: string
  }
}

const dayMap: Record<string, string> = { '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu', '5': 'Fri', '6': 'Sat' }

function formatWorkingDays(days: string | null | undefined, includeHoliday?: boolean | null): string | null {
  const s = typeof days === 'string' ? days.trim() : ''
  if (!s) return includeHoliday ? '공휴일' : null
  const list = s.split(',').map((d) => dayMap[d] || '').filter(Boolean)
  if (includeHoliday) list.push('공휴일')
  return list.length > 0 ? list.join(',') : null
}

function compressWorkingDays(days: string | null | undefined): string | null {
  const s = typeof days === 'string' ? days.trim() : ''
  if (!s) return null
  const nums = s.split(',').map((d) => Number(d)).filter((n) => Number.isFinite(n)).sort((a, b) => a - b)
  if (nums.length === 0) return null
  // special common patterns
  if (nums.join(',') === '1,2,3,4,5') return 'Mon–Fri'
  if (nums.join(',') === '0,1,2,3,4,5,6') return 'Mon–Sun'
  // generic compression
  const parts: string[] = []
  let start = nums[0]
  let prev = nums[0]
  const flush = () => {
    if (start === prev) parts.push(dayMap[String(start)])
    else parts.push(`${dayMap[String(start)]}–${dayMap[String(prev)]}`)
  }
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === prev + 1) {
      prev = nums[i]
      continue
    }
    flush()
    start = nums[i]
    prev = nums[i]
  }
  flush()
  return parts.join(', ')
}

function formatFeeRates(feeRates?: Array<{ start?: number | null; end?: number | null; rate: number }>): string[] {
  const rows: string[] = []
  const arr = Array.isArray(feeRates) ? feeRates : []
  for (const r of arr) {
    const start = r?.start == null ? 'N-∞' : `N-${Number(r.start)}`
    const end = r?.end == null ? 'N-0' : `N-${Number(r.end)}`
    rows.push(`${start} ~ ${end}: ${Number(r?.rate ?? 0)}%`)
  }
  return rows
}

function formatFeeRatesFriendly(feeRates?: Array<{ start?: number | null; end?: number | null; rate: number }>): string[] {
  const rows: string[] = []
  const arr = Array.isArray(feeRates) ? feeRates : []
  for (const r of arr) {
    const rate = Number(r?.rate ?? 0)
    const suffix = rate === 0 ? ' (full refund)' : rate >= 100 ? ' (no refund)' : ` (refund: ${Math.max(0, 100 - rate)}%)`
    if (r?.start == null && r?.end != null) {
      rows.push(`≥ ${Number(r.end)} days before: ${rate}% fee${suffix}`)
    } else if (r?.start != null && r?.end == null) {
      rows.push(`≤ ${Number(r.start)} days before: ${rate}% fee${suffix}`)
    } else if (r?.start != null && r?.end != null) {
      rows.push(`${Number(r.start)}–${Number(r.end)} days before: ${rate}% fee${suffix}`)
    }
  }
  return rows
}

function tzAbbrev(offset?: string | null): string | null {
  const m: Record<string, string> = {
    '+00:00': 'UTC',
    '+01:00': 'CET',
    '+02:00': 'EET',
    '+03:00': 'MSK',
    '+05:30': 'IST',
    '+08:00': 'CST',
    '+09:00': 'KST',
    '+09:30': 'ACST',
    '+10:00': 'AEST',
    '-05:00': 'EST',
    '-06:00': 'CST',
    '-07:00': 'MST',
    '-08:00': 'PST',
  }
  const s = typeof offset === 'string' ? offset : ''
  if (!s) return null
  return m[s] || `UTC${s}`
}

function computePivotHoursFromFees(feeRates?: Array<{ start?: number | null; end?: number | null; rate: number }>): number | null {
  const arr = Array.isArray(feeRates) ? feeRates : []
  // Prefer the largest 'end' of zero-fee periods (free cancellation until N days)
  let pivotDay: number | null = null
  for (const r of arr) {
    const rateNum = Number(r?.rate ?? -1)
    if (rateNum === 0 && typeof r?.end === 'number') {
      const e = Number(r.end)
      if (!Number.isNaN(e)) pivotDay = Math.max(pivotDay ?? -Infinity, e)
    }
  }
  if (pivotDay != null && Number.isFinite(pivotDay)) return Math.max(0, pivotDay) * 24
  // Fallback: use largest end among partial-fee (<100%) windows
  let alt: number | null = null
  for (const r of arr) {
    const rateNum = Number(r?.rate ?? 0)
    if (rateNum < 100 && typeof r?.end === 'number') {
      const e = Number(r.end)
      if (!Number.isNaN(e)) alt = Math.max(alt ?? -Infinity, e)
    }
  }
  if (alt != null && Number.isFinite(alt)) return Math.max(0, alt) * 24
  return null
}

export function CancellationPolicy({ refund, description, cancellationHours, pivotHoursOverride, labels, colors }: Props) {
  const refundType = String(refund?.refund_type || '')
  const feeRows = formatFeeRates(refund?.fee_rates)
  const workingDaysRaw = refund?.working_days ?? refund?.provider_cancel_days?.toString?.() ?? null
  const workingDays = formatWorkingDays(workingDaysRaw, refund?.work_on_korean_holiday)
  const workingDaysCompressed = compressWorkingDays(workingDaysRaw)
  const workingHour = refund?.working_hour || null
  const workingTz = refund?.working_timezone || null
  const freeDue = refund?.free_cancel_due_date || null
  const partial = refund?.partial_cancel_is
  const cancelType = refund?.cancel_type
  const cancelTime = refund?.cancel_time
  const pivotFromFees = computePivotHoursFromFees(refund?.fee_rates)
  const pivotHours = pivotFromFees ?? (typeof pivotHoursOverride === 'number' && pivotHoursOverride > 0
    ? pivotHoursOverride
    : (typeof cancellationHours === 'number' && cancellationHours > 0 ? cancellationHours : 24))

  const ui = {
    title: labels?.title ?? 'Cancellation Policy',
    freeTitle: labels?.freeTitle ?? 'Free cancellation',
    left: labels?.left ?? '100% refund',
    right: labels?.right ?? 'No refund',
  }
  const theme = {
    leftBg: colors?.leftBg ?? 'bg-emerald-400/80',
    rightBg: colors?.rightBg ?? 'bg-rose-400/80',
    divider: colors?.divider ?? 'bg-emerald-200',
  }

  // Always render (show placeholders if missing)

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{ui.title}</h3>
      {/* Refund type block (moved above the visual bar) */}
      <div className="mb-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Refund type</div>
          <div className="text-sm font-medium text-gray-900 uppercase tracking-wide">{refundType || 'Not specified'}</div>
        </div>
      </div>
      {/* Visual bar (free until pivot, then no refund) */}
      {refundType && (refundType === 'CONDITIONAL' || refundType === 'AVAILABLE' || refundType === 'UNAVAILABLE') && (
        <div className="mb-6">
          {refundType === 'CONDITIONAL' && (
            <>
              <div className="text-lg font-semibold text-gray-900 mb-2">{ui.freeTitle}</div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>{pivotHours} hours prior</span>
                <span>Within {pivotHours} hours</span>
              </div>
              <div className="relative w-full h-12 rounded-xl overflow-visible">
                <div className={`absolute inset-y-0 left-0 w-1/2 ${theme.leftBg} flex items-center justify-center font-semibold`}>{ui.left}</div>
                <div className={`absolute inset-y-0 right-0 w-1/2 ${theme.rightBg} flex items-center justify-center font-semibold`}>{ui.right}</div>
                <div className={`absolute inset-y-0 left-1/2 w-0.5 ${theme.divider}`} />
              </div>
            </>
          )}
          {refundType === 'AVAILABLE' && (
            <>
              <div className="text-lg font-semibold text-gray-900 mb-2">{ui.freeTitle}</div>
              <div className="relative w-full h-12 rounded-xl overflow-visible">
                <div className={`absolute inset-0 ${theme.leftBg} flex items-center justify-center font-semibold`}>{ui.left} (anytime)</div>
              </div>
            </>
          )}
          {refundType === 'UNAVAILABLE' && (
            <>
              <div className="text-lg font-semibold text-gray-900 mb-2">No cancellation</div>
              <div className="relative w-full h-12 rounded-xl overflow-visible">
                <div className={`absolute inset-0 ${theme.rightBg} flex items-center justify-center font-semibold`}>{ui.right}</div>
              </div>
            </>
          )}
        </div>
      )}
      <div className="space-y-5">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <BadgePercent className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Fee schedule</h4>
          </div>
          {feeRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-md">
                <thead className="bg-gray-50 text-gray-900">
                  <tr>
                    <th className="text-left px-3 py-2">When to cancel</th>
                    <th className="text-left px-3 py-2">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {formatFeeRatesFriendly(refund?.fee_rates).map((row, i) => {
                    const [when, tail] = row.split(':')
                    const fee = tail?.trim() || ''
                    return (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{when}</td>
                        <td className="px-3 py-2">{fee}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-700">{description || 'Not specified'}</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Business Hours</h4>
          </div>
          <p className="text-sm text-gray-700">
            {workingDaysCompressed || workingDays || 'Not specified'}
            {workingHour ? `, ${workingHour}` : ''}
            {(() => {
              const abbr = tzAbbrev(workingTz)
              return abbr ? ` (${abbr})` : ''
            })()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Cancellation and refund times are based on local time.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <p>Partial cancellation: <span className="font-medium text-gray-900">{typeof partial === 'boolean' ? (partial ? 'Allowed' : 'Not allowed') : 'Not specified'}</span></p>
          <p>Cancellation type: <span className="font-medium text-gray-900">{cancelType === 'CONFIRM' ? 'By approval' : cancelType === 'AUTO' ? 'Auto' : (cancelType || 'Not specified')}</span></p>
          <p>Time basis: <span className="font-medium text-gray-900">{cancelTime === 'PROVIDER' ? "Provider's local time" : cancelTime === 'KOREA' ? 'Korea time' : (cancelTime || 'Not set')}</span></p>
          <p>Free cancel until: <span className="font-medium text-gray-900">{freeDue ? (freeDue === 'INFINITE' ? 'No limit' : freeDue) : 'Not specified'}</span></p>
        </div>

        {refund?.cancel_info && (
          <p className="text-sm text-gray-700 whitespace-pre-line">{refund.cancel_info}</p>
        )}

        {/* Default notes */}
        <div className="pt-2">
          <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>No cancellation fee is charged for cancellations made during the reservation request stage.</li>
            <li>Cancellation fees are calculated based on the product price.</li>
            <li>Cancellation deadlines may change due to local conditions; in such cases, separate notice will be provided.</li>
            <li>No refund for no-shows or unused bookings on the date of use.</li>
            <li>Cancellations/refunds are processed only during supplier business hours.</li>
            <li>Cancellations made after business hours, holidays, or weekends will have fees applied based on the next business day.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


