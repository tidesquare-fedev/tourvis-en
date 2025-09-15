"use client"

import { Button } from '@/components/ui/button'
import { Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { TourOption } from '@/types/tour'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type TourOptionsProps = {
  selectedDate?: Date
  options: TourOption[]
  quantity: number
  onQuantityChange: (qty: number) => void
  inventoryScope?: string
  onSelectOption?: (optionCode: string) => void
  onSelectTimeslot?: (optionCode: string, timeslotId: string, labelId?: string) => void
  onChangeLabelQuantities?: (optionCode: string, qtyByLabel: Record<string, number>) => void
  getLabelPrice?: (optionCode: string, labelCode: string) => number
}

export function TourOptions({ selectedDate, options, quantity, onQuantityChange, inventoryScope, onSelectOption, onSelectTimeslot, onChangeLabelQuantities, getLabelPrice }: TourOptionsProps) {
  const formatNumberWithCommas = (value: unknown): string => {
    const numeric = typeof value === 'number' ? value : Number(String(value ?? '').replace(/,/g, ''))
    if (!Number.isFinite(numeric)) return ''
    return numeric.toLocaleString('ko-KR')
  }

  const [selectedOption, setSelectedOption] = useState<TourOption | undefined>(undefined)
  const [descExpanded, setDescExpanded] = useState<Record<string, boolean>>({})
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>({})
  const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({})
  const [cardExpanded, setCardExpanded] = useState<Record<string, boolean>>({})
  const [selectedTimeslot, setSelectedTimeslot] = useState<Record<string, string>>({})
  const [labelQuantities, setLabelQuantities] = useState<Record<string, Record<string, number>>>({})
  const descRefs = useRef<Record<string, HTMLParagraphElement | null>>({})
  const formatUSD = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.max(0, Number(v) || 0))
  const formatUSD0 = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, Number(v) || 0))

  const getStockText = (stock: number | null | undefined): string => {
    const q = typeof stock === 'number' ? stock : 0
    const qty = formatNumberWithCommas(q)
    return `재고: ${qty}`
  }

  const deriveTimeslotOptions = (option: TourOption): Array<{ id: string; title: string; quantity: number; labelId?: string }> => {
    const invList: any[] = Array.isArray((option as any).inventory_timeslots) ? (option as any).inventory_timeslots : []
    const listFromInventory = invList
      .map((t: any) => ({ id: String(t.id), title: String(t.title || t.id), quantity: Number(t.quantity ?? 0) || 0, labelId: t.label_id ? String(t.label_id) : undefined }))
      .filter((t) => t.quantity > 0)
    if (listFromInventory.length > 0) {
      return listFromInventory
    }
    const tsList: any[] = Array.isArray((option as any).timeslots) ? (option as any).timeslots : []
    return tsList.map((t: any) => ({ id: String(t.code || t.id || ''), title: String(t.title || t.name || t.code || ''), quantity: 0, labelId: undefined }))
  }

  // 실제 DOM 요소의 높이를 측정하여 3줄 초과 여부 확인
  const checkActualOverflow = (optionId: string) => {
    const element = descRefs.current[optionId]
    if (element) {
      return element.scrollHeight > element.clientHeight
    }
    return false
  }

  useEffect(() => {
    const updateShowMoreStates = () => {
      const newShowMoreStates: Record<string, boolean> = {}
      options.forEach((option) => {
        if (option.description) {
          newShowMoreStates[option.code] = checkActualOverflow(option.code)
        }
      })
      setShowMoreStates(newShowMoreStates)
    }

    const timer = setTimeout(updateShowMoreStates, 100)
    window.addEventListener('resize', updateShowMoreStates)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateShowMoreStates)
    }
  }, [options])

  // Derive a human-readable summary for a given option when collapsed
  const getOptionSummary = (option: TourOption): { time?: string; participants?: string } => {
    const code = option.code || ''
    let time: string | undefined
    const selId = selectedTimeslot[code]
    if (selId) {
      const list = deriveTimeslotOptions(option)
      const target = list.find((t) => t.id === selId)
      if (target) time = String(target.title)
    }
    const labels: any[] = Array.isArray((option as any).labels) ? (option as any).labels : []
    const map = labelQuantities[code] || {}
    const parts: string[] = []
    labels.forEach((lb: any, idx: number) => {
      const lCode = String(lb?.code || lb?.id || `L${idx}`).toUpperCase()
      const qty = Number(map[lCode] ?? 0)
      if (qty > 0) parts.push(`${String(lb?.title || lb?.name || 'Participant')} ${qty}`)
    })
    const participants = parts.length > 0 ? parts.join(', ') : undefined
    return { time, participants }
  }

  return (
    <div className="space-y-5 min-w-0">
      <h4 className="font-medium text-[18px]">Tour Options</h4>
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="text-black text-base font-semibold">{format(selectedDate, 'PPP')}</div>
        </div>
      )}

      {selectedDate && options.length > 0 ? (
        <div className="space-y-5">
          <h5 className="text-lg font-semibold text-gray-900">Available options</h5>
          {options.map((option) => (
            <div 
              key={option.code}
              className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#01c5fd] ${!cardExpanded[option.code] ? 'min-h-[64px] flex items-center' : ''} ${
                selectedOption?.code === option.code 
                  ? 'border-[#01c5fd] shadow-md' 
                  : 'border-gray-200 hover:border-[#01c5fd] bg-white hover:shadow-sm'
            }`}
            onClick={() => {
              if (selectedOption?.code !== option.code) {
                setSelectedTimeslot({})
              }
              setSelectedOption(option)
              setCardExpanded(prev => ({ ...prev, [option.code]: !prev[option.code] }))
              if (!optionQuantities[option.code]) {
                setOptionQuantities(prev => ({ ...prev, [option.code]: 0 }))
              }
              if (onSelectOption) {
                const code = option.code || ''
                onSelectOption(code)
              }
            }}
          >
            <div className="flex justify-between items-start gap-4 mb-0 w-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h5 className="font-semibold text-gray-900 text-[16px] leading-snug truncate">{option.title}</h5>
                  {!cardExpanded[option.code] && (
                    <div className="text-sm text-gray-600 text-right">
                      {(() => { const s = getOptionSummary(option); return (<>
                        {s.time && <div className="font-medium">{s.time}</div>}
                        {s.participants && <div className="truncate max-w-[220px]">{s.participants}</div>}
                      </>) })()}
                    </div>
                  )}
                </div>
                {/* per-option reset */}
                {cardExpanded[option.code] && (
                  <div className="mt-2 text-right">
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTimeslot(prev => ({ ...prev, [option.code]: '' }))
                      setLabelQuantities(prev => ({ ...prev, [option.code]: {} }))
                      setOptionQuantities(prev => ({ ...prev, [option.code]: 0 }))
                      if (onChangeLabelQuantities) onChangeLabelQuantities(option.code || '', {})
                    }}>Reset</Button>
                  </div>
                )}
                {cardExpanded[option.code] && (
                  <>
                    {option.description && (
                      <>
                        <p 
                          ref={(el) => {
                            if (el) descRefs.current[option.code] = el
                          }}
                          className={`text-base text-gray-600 mt-2 leading-relaxed break-words ${descExpanded[option.code || option.title] ? '' : 'line-clamp-3'}`}
                        >
                          {option.description}
                        </p>
                        {showMoreStates[option.code] && (
                          <button
                            className="mt-2 text-base text-gray-900 hover:underline inline-flex items-center font-medium"
                            onClick={(e) => {
                              e.stopPropagation()
                              const key = option.code || option.title
                              setDescExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
                            }}
                          >
                            {descExpanded[option.code || option.title] ? (
                              <>
                                Show Less <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Show More <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {/* Time selection */}
                    <div className="mt-4">
                      <div className="text-sm text-gray-700 mb-2">Select a starting time</div>
                      <div className="flex flex-wrap gap-3">
                        {Array.from(new Map(deriveTimeslotOptions(option).map(ts => [ts.title, ts])).values()).map((ts) => {
                          const active = selectedTimeslot[option.code || ''] === ts.id
                          return (
                            <button
                              key={ts.id}
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedTimeslot(prev => ({ ...prev, [option.code || '']: ts.id })); 
                                if (!optionQuantities[option.code]) {
                                  setOptionQuantities(prev => ({ ...prev, [option.code]: 1 }));
                                  onQuantityChange(1)
                                }
                                // initialize label quantities: default first label to 1 if not set
                                const labels: any[] = Array.isArray((option as any).labels) ? (option as any).labels : []
                                if (labels.length > 0 && !labelQuantities[option.code]) {
                                  const init: Record<string, number> = {}
                                  // default 0 for all labels
                                  labels.forEach((lb: any, i: number) => { init[String(lb?.code || lb?.id || `L${i}`)] = 0 })
                                  setLabelQuantities(prev => ({ ...prev, [option.code]: init }))
                                  if (onChangeLabelQuantities) onChangeLabelQuantities(option.code || '', init)
                                }
                                if (onSelectTimeslot) { onSelectTimeslot(option.code || '', ts.id, ts.labelId) }
                              }}
                              className={`px-5 py-3 rounded-xl border text-base ${active ? 'border-[#01c5fd] bg-[#e6faff] text-[#01a6db] shadow-sm' : 'border-gray-300 hover:border-[#01c5fd]'}`}
                            >
                              {ts.title}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Participants per labels (after time selection) */}
                    {selectedTimeslot[option.code || ''] && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-700 mb-2">Participants</div>
                        <div className="space-y-3">
                          {(Array.isArray((option as any).labels) ? (option as any).labels : []).map((lab: any, idx: number) => {
                            const lCode = String(lab?.code || lab?.id || `L${idx}`).toUpperCase()
                            const current = (labelQuantities[option.code]?.[lCode] ?? 0) as number
                            const setValue = (next: number) => {
                              setLabelQuantities(prev => {
                                const cur = { ...(prev[option.code] || {}) }
                                cur[lCode] = Math.max(0, next)
                                const merged = { ...prev, [option.code]: cur }
                                // propagate total to parent
                                const total = Object.values(cur).reduce((s, n) => s + (n as number), 0)
                                setOptionQuantities(p => ({ ...p, [option.code]: total }))
                                onQuantityChange(total)
                                if (onChangeLabelQuantities) onChangeLabelQuantities(option.code || '', cur)
                                return merged
                              })
                            }
                            let unit = getLabelPrice ? getLabelPrice(option.code || '', lCode) : 0
                            if (!unit && typeof (lab as any)?.price === 'number') unit = Number((lab as any).price)
                            if (!unit && typeof (lab as any)?.net_price_currency === 'number') unit = Number((lab as any).net_price_currency)
                            const isLoading = (lab as any)?.isLoading === true
                            const maxText = typeof lab?.per_max === 'number' && lab.per_max > 100 ? '100+' : String(lab?.per_max ?? 0)
                            const minNum = typeof lab?.per_min === 'number' ? lab.per_min : 0
                            return (
                              <div key={lCode} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-base font-medium text-gray-900">{String(lab?.title || lab?.name || 'Participant')}</span>
                                  {/* Unit price hidden per requirement */}
                                  <span className="text-xs text-gray-500">
                                    {minNum > 0 ? `min ${minNum} · ` : ''}max {maxText}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                                    onClick={(e) => { e.stopPropagation(); setValue(current - 1) }}
                                    disabled={current <= 0}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-10 text-center text-base font-semibold text-gray-900">{current}</span>
                                  <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                                    onClick={(e) => { e.stopPropagation(); setValue(current + 1) }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {selectedDate && (() => {
                      const curMap = labelQuantities[option.code] || {}
                      const totalSel = Object.values(curMap).reduce((s, n) => s + Number(n || 0), 0)
                      return totalSel > 0
                    })() && (
                      <div className="mt-4">
                        {/* price shows only after participants selected */}
                        <div className="font-semibold text-gray-900 text-[16px]">
                          {(() => {
                            const curMap = labelQuantities[option.code] || {}
                            const hasLoadingLabel = Object.entries(curMap).some(([lCode, qty]) => {
                              const code = String(lCode).toUpperCase()
                              const lab = (Array.isArray((option as any).labels) ? (option as any).labels : []).find((lb: any) => String(lb?.code || lb?.id || '').toUpperCase() === code)
                              return (lab as any)?.isLoading === true
                            })
                            
                            if (hasLoadingLabel) {
                              return (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                  <span className="text-sm text-gray-500">가격 조회 중...</span>
                                </div>
                              )
                            }
                            
                            let sum = 0
                            Object.entries(curMap).forEach(([lCode, qty]) => {
                              const code = String(lCode).toUpperCase()
                              let u = getLabelPrice ? getLabelPrice(option.code || '', code) : 0
                              if (!u) {
                                const lab = (Array.isArray((option as any).labels) ? (option as any).labels : []).find((lb: any) => String(lb?.code || lb?.id || '').toUpperCase() === code)
                                if (lab) {
                                  if (typeof lab?.price === 'number') u = Number(lab.price)
                                  else if (typeof lab?.net_price_currency === 'number') u = Number(lab.net_price_currency)
                                }
                              }
                              sum += (Number(qty || 0) * (u || 0))
                            })
                            
                            return formatUSD0(sum)
                          })()}
                        </div>
                        {selectedTimeslot[option.code || ''] && (
                          <div className="text-sm text-gray-600 mt-1">
                            {(() => {
                              const list = deriveTimeslotOptions(option)
                              const selId = selectedTimeslot[option.code || '']
                              const target = list.find((t) => t.id === selId)
                              const qty = target ? target.quantity : 0
                              return getStockText(qty as any)
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* extra placeholder removed */}
          </div>
        ))}
      </div>
      ) : selectedDate ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-base">No available options for the selected date.</p>
          <p className="text-sm mt-2">Try changing the participants.</p>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-base">Please select a date first.</p>
        </div>
      )}

      {/* Modals removed: participants/language selections now inline */}
    </div>
  )
}