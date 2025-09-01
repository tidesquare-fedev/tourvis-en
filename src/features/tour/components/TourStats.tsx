"use client"

import { Clock, MessageCircle, BadgeCheck, Smartphone } from 'lucide-react'

type TourStatsProps = {
  duration?: string
  durationCode?: string
  language?: string
  languages?: string[]
  confirmHour?: string
  voucherType?: string
  productPolicies?: string[]
}

export function TourStats({ duration, durationCode, language, languages, confirmHour, voucherType, productPolicies }: TourStatsProps) {
  const hasInstantConfirmation = (productPolicies || []).includes('INSTANT_CONFIRMATION') || confirmHour === 'IN0H'
  const hasMobileVoucher = (voucherType || '') === 'M_VOUCHER'
  const languageList = Array.isArray(languages) ? languages.filter(Boolean) : []
  const languageText = languageList.length > 0 ? languageList.join(', ') : (language || '')
  const durationText = (() => {
    if (duration && duration.trim()) return duration
    if (typeof durationCode === 'string') {
      const number = durationCode.replace(/[^0-9]/g, '')
      if (durationCode.startsWith('IN')) {
        if (durationCode.endsWith('H') && number) return `${number} hours`
        if (durationCode.endsWith('D') && number) return `${number} days`
      }
      if (durationCode.startsWith('OV')) {
        if (durationCode.endsWith('H') && number) return `Over ${number} hours`
        if (durationCode.endsWith('D') && number) return `Over ${number} days`
      }
    }
    return ''
  })()

  const confirmLabel = (() => {
    if ((productPolicies || []).includes('INSTANT_CONFIRMATION') || confirmHour === 'IN0H') {
      return 'Instant confirmation'
    }
    if (typeof confirmHour === 'string' && confirmHour.startsWith('IN')) {
      const number = confirmHour.replace(/[^0-9]/g, '')
      if (confirmHour.endsWith('H') && number) return `Confirmation within ${number} hours`
      if (confirmHour.endsWith('D') && number) return `Confirmation within ${number} days`
    }
    return ''
  })()

  const voucherLabel = (() => {
    if (!voucherType) return ''
    if (voucherType === 'M_VOUCHER') return 'Mobile voucher'
    if (voucherType === 'P_VOUCHER') return 'Printed voucher'
    // Fallback: humanize code like OTHER_VOUCHER -> Other voucher
    const humanized = voucherType
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return humanized
  })()
  return (
    <div className="mb-6 min-w-0">
      <div className="mt-4 sm:mt-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {!!durationText && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-[16px] text-gray-900">Duration</div>
                <div className="text-[14px] text-gray-700">{durationText}</div>
              </div>
            </div>
          )}
          {!!languageText && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-[16px] text-gray-900">Language</div>
                <div className="text-[14px] text-gray-700">{languageText}</div>
              </div>
            </div>
          )}
          {!!confirmLabel && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <BadgeCheck className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-[16px] text-gray-900">Confirm</div>
                <div className="text-[14px] text-gray-700">{confirmLabel}</div>
              </div>
            </div>
          )}
          {!!voucherLabel && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-[16px] text-gray-900">Voucher</div>
                <div className="text-[14px] text-gray-700">{voucherLabel}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


