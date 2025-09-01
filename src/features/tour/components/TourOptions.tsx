"use client"

import { Button } from '@/components/ui/button'
import { Plus, Minus, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import { TourOption } from '@/types/tour'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type TourOptionsProps = {
  selectedDate?: Date
  options: TourOption[]
  quantity: number
  onQuantityChange: (qty: number) => void
}

export function TourOptions({ selectedDate, options, quantity, onQuantityChange }: TourOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<TourOption>(options[0])
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>(options[0]?.timeslots[0]?.title || '')
  const [selectedLabel, setSelectedLabel] = useState(options[0]?.labels[0])
  const [descExpanded, setDescExpanded] = useState<Record<string, boolean>>({})
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>({})
  const descRefs = useRef<Record<string, HTMLParagraphElement | null>>({})

  const totalPrice = selectedLabel ? quantity * selectedLabel.net_price_currency : 0

  // 3줄 이상인지 확인하는 함수
  const checkIfOverflowing = (text: string) => {
    // 모바일과 데스크톱 모두 고려하여 더 보수적인 기준 설정
    // 모바일에서는 한 줄에 30-40자, 데스크톱에서는 50-60자 정도
    const estimatedCharsPerLine = 35 // 모바일 기준으로 낮춤
    const maxCharsFor3Lines = estimatedCharsPerLine * 3
    return text.length > maxCharsFor3Lines
  }

  // 실제 DOM 요소의 높이를 측정하여 3줄 초과 여부 확인
  const checkActualOverflow = (optionId: string) => {
    const element = descRefs.current[optionId]
    if (element) {
      // line-clamp-3가 적용된 상태에서 scrollHeight가 clientHeight보다 크면 3줄 초과
      return element.scrollHeight > element.clientHeight
    }
    return false
  }

  // 화면 크기에 따라 동적으로 3줄 초과 여부 판단
  const checkResponsiveOverflow = (optionId: string) => {
    const element = descRefs.current[optionId]
    if (element) {
      // 현재 화면 너비 확인
      const isMobile = window.innerWidth < 768 // md 브레이크포인트
      
      if (isMobile) {
        // 모바일에서는 3줄 초과 여부 확인
        return element.scrollHeight > element.clientHeight
      } else {
        // PC에서는 2줄 초과 여부 확인 (line-clamp-2 기준)
        // 임시로 line-clamp-2를 적용하여 높이 측정
        const originalClass = element.className
        element.className = element.className.replace('line-clamp-3', 'line-clamp-2')
        const twoLineHeight = element.scrollHeight
        element.className = originalClass // 원래 클래스로 복원
        
        return twoLineHeight > element.clientHeight
      }
    }
    return false
  }

  useEffect(() => {
    // DOM이 렌더링된 후 실제 높이를 측정
    const updateShowMoreStates = () => {
      const newShowMoreStates: Record<string, boolean> = {}
      options.forEach((option) => {
        if (option.description) {
          newShowMoreStates[option.outer_id] = checkResponsiveOverflow(option.outer_id) || checkIfOverflowing(option.description)
        }
      })
      setShowMoreStates(newShowMoreStates)
    }

    const timer = setTimeout(updateShowMoreStates, 100) // DOM 렌더링 완료 후 측정

    // 화면 크기 변경 시에도 재측정
    window.addEventListener('resize', updateShowMoreStates)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateShowMoreStates)
    }
  }, [options])

  return (
    <div className="space-y-5 min-w-0">
      <h4 className="font-medium text-[18px]">Tour Options</h4>
      
      {/* Option Selection */}
      <div className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.outer_id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              selectedOption.outer_id === option.outer_id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              setSelectedOption(option)
              setSelectedTimeslot(option.timeslots[0]?.title || '')
              setSelectedLabel(option.labels[0])
            }}
          >
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-base md:text-lg leading-snug break-words">{option.title}</h5>
                {option.description && (
                  <>
                    <p 
                      ref={(el) => {
                        if (el) descRefs.current[option.outer_id] = el
                      }}
                      className={`text-sm md:text-base text-gray-600 mt-1 leading-relaxed break-words ${descExpanded[option.outer_id || option.title] ? '' : 'line-clamp-3'}`}
                    >
                      {option.description}
                    </p>
                    {showMoreStates[option.outer_id] && (
                      <button
                        className="mt-1 text-sm text-blue-600 hover:underline inline-flex items-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          const key = option.outer_id || option.title
                          setDescExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
                        }}
                      >
                        {descExpanded[option.outer_id || option.title] ? (
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
              </div>
              <span className="text-base md:text-lg font-bold text-blue-600 whitespace-nowrap">
                €{option.labels[0]?.net_price_currency || 0}
              </span>
            </div>
            
            {selectedDate && (
              <p className="text-sm text-gray-500 mb-3">
                선택된 날짜: {format(selectedDate, 'PPP')}
              </p>
            )}

            {selectedOption.outer_id === option.outer_id && (
              <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                {/* Timeslot Selection */}
                {option.timeslots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      시간 선택
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
                      {option.timeslots.map((timeslot) => (
                        <button
                          key={timeslot.outer_id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTimeslot(timeslot.title)
                          }}
                          className={`px-3 py-2 text-sm md:text-base border rounded-md transition-colors touch-manipulation min-w-0 ${
                            selectedTimeslot === timeslot.title
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {timeslot.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Label/Age Group Selection */}
                {option.labels.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      참가자 유형
                    </label>
                    <div className="space-y-2">
                      {option.labels.map((label) => (
                        <button
                          key={label.outer_id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLabel(label)
                          }}
                          className={`w-full flex justify-between items-center px-3 py-2 text-sm md:text-base border rounded-md transition-colors touch-manipulation ${
                            selectedLabel?.outer_id === label.outer_id
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span>{label.title}</span>
                          <span className="font-medium">€{label.net_price_currency}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm md:text-base font-medium">수량:</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuantityChange(quantity - 1)
                        }} 
                        disabled={quantity <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuantityChange(quantity + 1)
                        }} 
                        disabled={quantity >= option.per_max}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">(최대 {option.per_max}명)</span>
                  </div>
                  
                  {quantity > 0 && selectedLabel && (
                    <div className="text-right">
                      <div className="text-sm md:text-base text-gray-600">총액</div>
                      <div className="text-lg md:text-xl font-bold text-blue-600">€{totalPrice}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


