"use client"

import { Button } from '@/components/ui/button'
import { Plus, Minus, Clock, Users, MapPin, Bus, X, ChevronDown, ChevronUp, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { TourOption } from '@/types/tour'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type TourOptionsProps = {
  selectedDate?: Date
  options: TourOption[]
  quantity: number
  onQuantityChange: (qty: number) => void
}

export function TourOptions({ selectedDate, options, quantity, onQuantityChange }: TourOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<TourOption | undefined>(undefined)
  const [descExpanded, setDescExpanded] = useState<Record<string, boolean>>({})
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>({})
  const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({})
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false)
  const [cardExpanded, setCardExpanded] = useState<Record<string, boolean>>({})
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ENGLISH')
  const [ageGroupQuantities, setAgeGroupQuantities] = useState<Record<string, number>>({
    adult: 1,      // 18-64세
    youth: 0,      // 13-17세
    child: 0,      // 5-12세
    infant: 0,     // 0-4세
    senior: 0      // 65-99세
  })
  const descRefs = useRef<Record<string, HTMLParagraphElement | null>>({})

  // 총 인원수 계산
  const totalParticipants = Object.values(ageGroupQuantities).reduce((sum, count) => sum + count, 0)

  // 옵션 제목에서 언어 추출하는 함수
  const extractLanguageFromTitle = (title: string): string => {
    const languageMap: Record<string, string> = {
      '영어': 'ENGLISH',
      '한국어': 'KOREAN', 
      '일본어': 'JAPANESE',
      '중국어': 'CHINESE',
      '스페인어': 'SPANISH',
      '프랑스어': 'FRENCH',
      '독일어': 'GERMAN',
      '이탈리아어': 'ITALIAN',
      '포르투갈어': 'PORTUGUESE',
      '러시아어': 'RUSSIAN'
    }
    
    for (const [korean, english] of Object.entries(languageMap)) {
      if (title.includes(korean)) {
        return english
      }
    }
    
    // 기본값은 영어
    return 'ENGLISH'
  }

  // 옵션들에서 사용 가능한 언어들 추출
  const availableLanguagesFromOptions = Array.from(new Set(
    options.map(option => extractLanguageFromTitle(option.title))
  )).sort()

  // 사용 가능한 언어들 계산 (옵션에서 추출)
  const languages = availableLanguagesFromOptions

  // 선택된 조건에 따라 필터링된 옵션들 계산
  const filteredOptions = options.filter(option => {
    // 인원수 필터링 (최소/최대 인원수 확인)
    const hasValidCapacity = option.per_min <= totalParticipants && totalParticipants <= option.per_max
    
    // 언어 필터링 - 옵션 제목에서 추출한 언어와 선택된 언어가 일치하는지 확인
    const optionLanguage = extractLanguageFromTitle(option.title)
    const hasMatchingLanguage = optionLanguage === selectedLanguage
    
    return hasValidCapacity && hasMatchingLanguage
  })

  // 실제 DOM 요소의 높이를 측정하여 3줄 초과 여부 확인
  const checkActualOverflow = (optionId: string) => {
    const element = descRefs.current[optionId]
    if (element) {
      // 모든 화면 크기에서 3줄 초과 여부 확인
      return element.scrollHeight > element.clientHeight
    }
    return false
  }

  // 사용 가능한 언어가 변경될 때 선택된 언어 조정
  useEffect(() => {
    if (languages.length > 0 && !languages.includes(selectedLanguage)) {
      setSelectedLanguage(languages[0])
    }
  }, [languages, selectedLanguage])

  useEffect(() => {
    // DOM이 렌더링된 후 실제 높이를 측정
    const updateShowMoreStates = () => {
      const newShowMoreStates: Record<string, boolean> = {}
      options.forEach((option) => {
        if (option.description) {
          // 실제 DOM 측정만 사용하여 정확한 3줄 초과 여부 판단
          newShowMoreStates[option.code] = checkActualOverflow(option.code)
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
      
      {/* 날짜 선택 섹션 */}
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-3 text-blue-800">
            <Clock className="w-6 h-6" />
            <span className="text-base font-semibold">선택된 날짜: {format(selectedDate, 'PPP')}</span>
          </div>
        </div>
      )}

      {/* 인원 및 언어 선택 섹션 */}
      {selectedDate && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <h5 className="text-lg font-semibold text-gray-900">인원 및 언어 선택</h5>
          
          <div className="space-y-6">
            {/* 연령대별 인원 선택 */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-4">
                <Users className="w-5 h-5 inline mr-2" />
                참가 인원 (총 {totalParticipants}명)
              </label>
              
      <div className="space-y-4">
                {/* 성인 (18-64세) */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-900">성인</span>
                    <span className="text-sm text-gray-500">(18-64세)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        adult: Math.max(0, prev.adult - 1)
                      }))}
                      disabled={ageGroupQuantities.adult <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-base font-semibold text-gray-900">{ageGroupQuantities.adult}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        adult: prev.adult + 1
                      }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 청소년 (13-17세) */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-900">청소년</span>
                    <span className="text-sm text-gray-500">(13-17세)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        youth: Math.max(0, prev.youth - 1)
                      }))}
                      disabled={ageGroupQuantities.youth <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-base font-semibold text-gray-900">{ageGroupQuantities.youth}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        youth: prev.youth + 1
                      }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 아동 (5-12세) */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-900">아동</span>
                    <span className="text-sm text-gray-500">(5-12세)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        child: Math.max(0, prev.child - 1)
                      }))}
                      disabled={ageGroupQuantities.child <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-base font-semibold text-gray-900">{ageGroupQuantities.child}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        child: prev.child + 1
                      }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 유아 (0-4세) */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-900">유아</span>
                    <span className="text-sm text-gray-500">(0-4세)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        infant: Math.max(0, prev.infant - 1)
                      }))}
                      disabled={ageGroupQuantities.infant <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-base font-semibold text-gray-900">{ageGroupQuantities.infant}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        infant: prev.infant + 1
                      }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 시니어 (65-99세) */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-900">시니어</span>
                    <span className="text-sm text-gray-500">(65-99세)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        senior: Math.max(0, prev.senior - 1)
                      }))}
                      disabled={ageGroupQuantities.senior <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-base font-semibold text-gray-900">{ageGroupQuantities.senior}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 h-8 p-0 rounded-full border-2 hover:bg-gray-50"
                      onClick={() => setAgeGroupQuantities(prev => ({
                        ...prev,
                        senior: prev.senior + 1
                      }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 언어 선택 */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-3">
                <Globe className="w-5 h-5 inline mr-2" />
                가이드 언어
              </label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {languages.map(language => {
                  const languageNames: Record<string, string> = {
                    'ENGLISH': 'English',
                    'KOREAN': '한국어',
                    'JAPANESE': '日本語',
                    'CHINESE': '中文',
                    'SPANISH': 'Español',
                    'FRENCH': 'Français',
                    'GERMAN': 'Deutsch',
                    'ITALIAN': 'Italiano',
                    'PORTUGUESE': 'Português',
                    'RUSSIAN': 'Русский'
                  }
                  return (
                    <option key={language} value={language}>
                      {languageNames[language] || language}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>
      )}

            {/* 가능한 옵션들 표시 */}
      {selectedDate && filteredOptions.length > 0 ? (
        <div className="space-y-5">
          <h5 className="text-lg font-semibold text-gray-900">선택 가능한 투어 옵션</h5>
          {filteredOptions.map((option) => (
            <div 
              key={option.code}
              className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                selectedOption?.code === option.code 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
            }`}
            onClick={() => {
              setSelectedOption(option)
                // 옵션 선택 시 수량을 0으로 초기화
                if (!optionQuantities[option.code]) {
                  setOptionQuantities(prev => ({
                    ...prev,
                    [option.code]: 0
                  }))
                }
            }}
          >
                          <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-gray-900 text-lg leading-snug break-words">{option.title}</h5>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCardExpanded(prev => ({
                          ...prev,
                          [option.code]: !prev[option.code]
                        }))
                      }}
                    >
                      {cardExpanded[option.code] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                                    {option.description && cardExpanded[option.code] && (
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
              </div>
                <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
                  €{option.labels?.[0]?.net_price_currency || 0}
              </span>
            </div>
            
                            {/* 옵션 기본 정보 표시 */}
              {cardExpanded[option.code] && (
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-600">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>소요시간: 7시간</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>최대 인원: {option.per_max}명</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>픽업 가능</span>
                  </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">가격: €{option.labels?.[0]?.net_price_currency || 0}부터</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex gap-2">
                    <button 
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-base font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                        setIsPickupModalOpen(true)
                      }}
                    >
                      <Bus className="w-5 h-5" />
                      <span>픽업 지역 보기</span>
                    </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      ) : selectedDate ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-base">선택한 조건에 맞는 투어 옵션이 없습니다.</p>
          <p className="text-sm mt-2">인원수나 언어를 변경해보세요.</p>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-base">날짜를 먼저 선택해주세요.</p>
        </div>
      )}

      {/* Pickup Location Modal */}
      <Dialog open={isPickupModalOpen} onOpenChange={setIsPickupModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>숙소 픽업 장소</span>
              <button
                onClick={() => setIsPickupModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Instruction */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bus className="w-4 h-4" />
              <span>적격 픽업 지역에 머무는 경우 숙소 픽업을 이용할 수 있습니다.</span>
            </div>

            {/* Map */}
            <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.123456789!2d19.944544!3d50.064650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b1aa3e418c3%3A0x4b0b3d7c8e9f0a1b!2sKrak%C3%B3w%2C%20Poland!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Krakow Pickup Area Map"
              />
            </div>

            {/* Pickup Information */}
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                크라쿠프 구시가지 또는 구 유대인 지구(카지미에츠)에 있는 호텔이나 아파트에서 픽업 서비스를 받으실 수 있습니다. 
                운전 기사가 해당 지역에 정차할 수 없는 경우 가능한 한 가까운 다른 장소로 이동합니다.
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">픽업 시간</h4>
                <p>활동이 시작되기 전 0 - 15분.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">하차 지점</h4>
                <p>픽업 지점과 동일합니다.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}