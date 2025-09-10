'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Info, X, Edit, Calendar, Users, ArrowLeft, CheckCircle, CreditCard, Lock } from 'lucide-react'

// 목업 데이터 제거 - 실제 API에서 데이터를 가져와야 함

import { Suspense } from 'react'

function BookingInfoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tourId = searchParams.get('tour') || 'jeju-hallasan-hiking'
  
  // 하이드레이션 오류 방지를 위해 초기값을 고정
  const [isClient, setIsClient] = useState(false)
  const [storedObj, setStoredObj] = useState<any>(null)
  
  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('selectedProduct')
    if (stored) {
      try {
        setStoredObj(JSON.parse(stored))
      } catch (e) {
        console.error('Error parsing stored product data:', e)
      }
    }
  }, [])
  
  const tour = storedObj ? { 
    id: storedObj.tourId || storedObj.id || tourId, 
    title: storedObj.title, 
    price: Math.round(Number(storedObj.totalAmount || 0) / Math.max(1, Number(searchParams.get('quantity') || 1))), 
    image: storedObj.image || '/placeholder.svg'
  } : {
    id: tourId,
    title: 'Tour Information',
    price: 0,
    image: '/placeholder.svg'
  }
  
  const selections = Array.isArray(storedObj?.selections) ? storedObj.selections as Array<{ optionTitle: string; timeslotTitle?: string; lines: Array<{ label: string; qty: number; unit: number }>; subtotal: number }> : []
  const formatNum = (n: number) => new Intl.NumberFormat('en-US').format(Math.max(0, Number(n) || 0))
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+82', date: '2025-07-23', adults: 1, children: 0, specialRequests: '' })
  
  const travelerText = (() => {
    if (!isClient) return '1 Travelers' // 서버 사이드 렌더링 시 고정값
    if (selections.length > 0) {
      const map: Record<string, number> = {}
      selections.forEach((s) => {
        s.lines.forEach((ln) => {
          const key = String(ln.label || 'Traveler')
          const qty = Number(ln.qty || 0)
          if (qty > 0) map[key] = (map[key] || 0) + qty
        })
      })
      const parts = Object.entries(map).filter(([, q]) => q > 0).map(([k, q]) => `${q} ${k}`)
      if (parts.length > 0) return parts.join(', ')
    }
    return `${storedObj?.quantity || (formData.adults + formData.children)} Travelers`
  })()
  
  const dateText = (() => {
    if (!isClient) return 'Wed, Jul 23, 2025' // 서버 사이드 렌더링 시 고정값
    return storedObj?.date ? new Date(storedObj.date).toLocaleDateString() : (formData.date ? new Date(formData.date).toLocaleDateString() : 'Wed, Jul 23, 2025')
  })()
  
  const selectedTimes = Array.from(new Set(selections.map((s) => String(s.timeslotTitle || '').trim()).filter(Boolean)))
  const dateTimeText = selectedTimes.length > 0 ? `${dateText} • ${selectedTimes.join(', ')}` : `${dateText}${storedObj?.timeslotTitle ? ` • ${storedObj.timeslotTitle}` : ''}`
  
  // 총 금액 계산 - 모든 옵션의 subtotal을 합산
  const total = (() => {
    if (!isClient) return tour.price * (formData.adults + formData.children) // 서버 사이드 렌더링 시 기본값
    return selections.length > 0 
      ? selections.reduce((sum, selection) => sum + (selection.subtotal || 0), 0)
      : (storedObj?.totalAmount || (tour.price * (formData.adults + formData.children)))
  })()

  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [ticketUserData, setTicketUserData] = useState({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+82' })
  const [sameAsTraveler, setSameAsTraveler] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '', country: 'South Korea', zipCode: '' })
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phone: '', ticketFirstName: '', ticketLastName: '', ticketEmail: '', ticketPhone: '' })
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)
  const [isTicketCountryModalOpen, setIsTicketCountryModalOpen] = useState(false)

  const countryCodes = [
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+354', country: 'Iceland', flag: '🇮🇸' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' }
  ]

  const validateField = (field: string, value: string, type: 'traveler' | 'ticket' = 'traveler') => {
    let error = ''
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'This field is required'
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Only English letters are allowed'
        break
      case 'email':
        if (!value.trim()) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address'
        break
      case 'phone':
        if (!value.trim()) error = 'Phone number is required'
        else if (value.length < 8) error = 'Please enter a valid phone number'
        break
    }
    const errorKey = type === 'ticket' ? `ticket${field.charAt(0).toUpperCase() + field.slice(1)}` : field
    setErrors((prev) => ({ ...prev, [errorKey]: error }))
    return error === ''
  }

  const handleNextStep = (step: number) => {
    if (step === 1) {
      const a = validateField('firstName', formData.firstName)
      const b = validateField('lastName', formData.lastName)
      const c = validateField('email', formData.email)
      const d = validateField('phone', formData.phone)
      if (a && b && c && d) {
        setCompletedSteps((prev) => [...prev, 1])
        setActiveStep(2)
      }
    } else if (step === 2) {
      const a = validateField('firstName', ticketUserData.firstName, 'ticket')
      const b = validateField('lastName', ticketUserData.lastName, 'ticket')
      const c = validateField('email', ticketUserData.email, 'ticket')
      const d = validateField('phone', ticketUserData.phone, 'ticket')
      if (a && b && c && d) {
        setCompletedSteps((prev) => [...prev, 2])
        setActiveStep(3)
      }
    }
  }

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }
    if (paymentMethod === 'card' && (!cardInfo.cardNumber || !cardInfo.expiryMonth || !cardInfo.expiryYear || !cardInfo.cvv || !cardInfo.holderName)) {
      alert('Please fill in all card information')
      return
    }
    if (paymentMethod === 'paypal') {
      console.log('Processing PayPal payment...')
    } else if (paymentMethod === 'card') {
      console.log('Processing card payment...')
    }
    
    // 예약 완료 처리
    const reservationNumber = `KT${Date.now().toString().slice(-8)}`
    console.log('=== Booking Info Debug ===')
    console.log('Tour object:', tour)
    console.log('Tour ID:', tour.id)
    
    const reservationData = {
      reservationNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.countryCode || 'South Korea',
      date: formData.date || new Date().toISOString().split('T')[0],
      participants: (formData.adults + formData.children).toString(),
      specialRequests: formData.specialRequests || '',
      tourTitle: tour.title,
      tourPrice: tour.price,
      totalAmount: total,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      ticketUser: ticketUserData,
      // 실제 상품 데이터 추가
      tour: {
        id: tour.id,
        title: tour.title,
        price: tour.price,
        image: tour.image || '/placeholder.svg'
      },
      // 상품 상세 정보 추가
      productDetails: {
        basic: {
          duration: '3 hours',
          duration_unit: 'hours',
          meeting_point: 'Jeju Airport Terminal 1',
          meeting_time: '09:00 AM',
          included: ['Professional guide', 'Transportation', 'Lunch'],
          excluded: ['Personal expenses', 'Tips'],
          requirements: ['Valid ID', 'Comfortable shoes']
        }
      },
      selections: selections, // 선택된 옵션들
      travelerText: travelerText,
      dateTimeText: dateTimeText,
      // activityDetails는 예약 완료 페이지에서 상품 상세 API로 가져옴
    }
    
    // 예약 데이터 저장
    console.log('Saving reservation data:', reservationData)
    localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(reservationData))
    console.log('Reservation saved with number:', reservationNumber)
    
    // 예약 완료 페이지로 이동
    router.replace(`/reservation-details?reservation=${reservationNumber}`)
  }

  const setField = (field: string, value: any) => setFormData((p) => ({ ...p, [field]: value }))
  const setTicketField = (field: string, value: any) => setTicketUserData((p) => ({ ...p, [field]: value }))

  const getStepIcon = (step: number) => {
    if (completedSteps.includes(step)) return <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">✓</div>
    if (activeStep === step) return <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">{step}</div>
    return <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">{step}</div>
  }

  const isStepActive = (step: number) => activeStep === step
  const isStepCompleted = (step: number) => completedSteps.includes(step)
  const isStepAccessible = (step: number) => step <= activeStep || completedSteps.includes(step)

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <Link href="/" className="flex items-center">
              <span className="logo h-6 sm:h-8 w-24 sm:w-28" role="img" aria-label="TOURVIS" />
            </Link>
          </div>
        </div>
      </header>

      {/* GNB 아래 여백 */}
      <div className="h-16"></div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Booking Information</h1>
          <p className="text-sm sm:text-base text-gray-600">Please enter your information and preferences for the booking.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <img src={tour.image} alt="Tour" className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base break-words">{storedObj?.title || tour.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Usage Date: {storedObj?.date ? new Date(storedObj.date).toLocaleDateString() : (formData.date ? new Date(formData.date).toLocaleDateString() : 'Friday, July 18, 2025')}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Option Information</span>
                    <span className="sm:hidden">Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="mx-auto w-full">
                    <DialogHeader className="relative pb-2 mb-4 border-b">
                      <DialogTitle className="text-left text-lg">Option Information</DialogTitle>
                    </DialogHeader>
                    <div className="px-2 sm:px-4 pb-6">
                      <div className="bg-white rounded-lg border p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                          <img src={tour.image} alt="Tour" className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">{storedObj?.title || tour.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Usage Date: {storedObj?.date ? new Date(storedObj.date).toLocaleDateString() : (formData.date ? new Date(formData.date).toLocaleDateString() : 'Friday, July 18, 2025')}</p>
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4 border-t pt-4">
                          {selections.length > 0 ? (
                            selections.map((s, idx) => (
                              <div key={idx} className="border rounded-lg p-2 sm:p-3">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                                  <span className="font-medium text-sm sm:text-base break-words">{s.optionTitle}{s.timeslotTitle ? ` • ${s.timeslotTitle}` : ''}</span>
                                </div>
                                <div className="mt-2 space-y-1">
                                  {s.lines.map((ln, i) => (
                                    <div key={i} className="flex justify-between text-xs sm:text-sm text-gray-700">
                                      <span className="break-words">{ln.label}</span>
                                      <span className="flex-shrink-0 ml-2">x {ln.qty}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t mt-2">
                                  <span className="text-xs sm:text-sm font-semibold">Subtotal</span>
                                  <span className="text-xs sm:text-sm font-bold">${formatNum(s.subtotal)}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm sm:text-base break-words">{storedObj?.optionTitle || tour.title}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 text-sm">Quantity</span>
                                <span className="font-medium text-sm">x {storedObj?.quantity || (formData.adults + formData.children)}</span>
                              </div>
                            </>
                          )}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg font-semibold">Total Product Amount</span>
                            <div className="text-right">
                              <span className="text-base sm:text-lg font-bold">${formatNum(storedObj?.totalAmount || (tour.price * (formData.adults + formData.children)))}</span>
                              <br />
                              <span className="text-xs sm:text-sm font-normal text-gray-600">${formatNum(tour.price)} per person</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{travelerText}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{dateTimeText}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-base sm:text-lg font-semibold">Total</span>
                <span className="text-base sm:text-lg font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="cursor-pointer" onClick={() => isStepAccessible(1) && setActiveStep(1)}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">{getStepIcon(1)} Contact details</div>
              {isStepCompleted(1) && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setActiveStep(1); setCompletedSteps((s) => s.filter((x) => x !== 1)) }} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          {isStepActive(1) && (
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">We'll use this information to send you confirmation and updates about your booking</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="First name" value={formData.firstName} onChange={(e) => setField('firstName', e.target.value.replace(/[^a-zA-Z\s]/g, ''))} onBlur={(e) => validateField('firstName', e.target.value)} required />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Last name" value={formData.lastName} onChange={(e) => setField('lastName', e.target.value.replace(/[^a-zA-Z\s]/g, ''))} onBlur={(e) => validateField('lastName', e.target.value)} required />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email address" value={formData.email} onChange={(e) => setField('email', e.target.value)} onBlur={(e) => validateField('email', e.target.value)} required />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                <p className="text-sm text-gray-500 mt-1 bg-green-50 p-2 rounded">Your booking confirmation will be sent to {formData.email || 'your email'}</p>
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  {/* 모바일에서는 모달, 데스크톱에서는 셀렉트 */}
                  <div className="hidden sm:block">
                    <Select value={formData.countryCode} onValueChange={(v) => setField('countryCode', v)}>
                      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (<SelectItem key={`${c.code}-${c.country}`} value={c.code}>
                          <span className="mr-3">{c.flag}</span>
                          <span>{c.country} ({c.code})</span></SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 모바일용 국가 번호 버튼 */}
                  <div className="sm:hidden">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-20 h-10 px-2 flex items-center justify-center"
                      onClick={() => setIsCountryModalOpen(true)}
                    >
                      <span className="text-sm">{countryCodes.find(c => c.code === formData.countryCode)?.flag} {formData.countryCode}</span>
                    </Button>
                  </div>
                  
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Phone number" 
                    value={formData.phone} 
                    onChange={(e) => setField('phone', e.target.value.replace(/[^0-9-]/g, ''))} 
                    onBlur={(e) => validateField('phone', e.target.value)} 
                    className="flex-1" 
                    required 
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                
                {/* 모바일용 국가 번호 선택 모달 */}
                <Dialog open={isCountryModalOpen} onOpenChange={setIsCountryModalOpen}>
                  <DialogContent className="w-[95vw] max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Country Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {countryCodes.map((c) => (
                        <Button
                          key={`${c.code}-${c.country}`}
                          variant="ghost"
                          className={`w-full justify-start h-12 px-4 ${formData.countryCode === c.code ? 'bg-[#01c5fd] text-white hover:bg-[#01c5fd] hover:text-white' : 'hover:bg-gray-100'}`}
                          onClick={() => {
                            setField('countryCode', c.code)
                            setIsCountryModalOpen(false)
                          }}
                        >
                          <span className="text-lg mr-3">{c.flag}</span>
                          <span className={`flex-1 text-left ${formData.countryCode === c.code ? 'text-white' : 'text-gray-900'}`}>
                            {c.code} {c.country} ({c.code})
                          </span>
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Button onClick={() => handleNextStep(1)} className="w-full text-white" style={{ backgroundColor: '#01c5fd' }} size="lg">Next</Button>
            </CardContent>
          )}
          {isStepCompleted(1) && !isStepActive(1) && (
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{formData.countryCode} {formData.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{formData.email}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-6">
          <CardHeader className={`cursor-pointer ${isStepAccessible(2) ? '' : 'opacity-50'}`} onClick={() => isStepAccessible(2) && setActiveStep(2)}>
            <CardTitle className="flex items-center justify-between"><div className="flex items-center gap-2">{getStepIcon(2)} Activity details</div></CardTitle>
          </CardHeader>
          {isStepActive(2) && (
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sameAsTraveler" checked={sameAsTraveler} onCheckedChange={(checked) => {
                    setSameAsTraveler(!!checked)
                    if (checked) {
                      setTicketUserData({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone, countryCode: formData.countryCode })
                    } else {
                      setTicketUserData({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+82' })
                    }
                  }} />
                  <Label htmlFor="sameAsTraveler" className="text-sm">Same as Traveler Information</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ticketFirstName">First Name (English only)</Label>
                    <Input id="ticketFirstName" placeholder="First name (English)" value={ticketUserData.firstName} onChange={(e) => setTicketField('firstName', e.target.value.replace(/[^a-zA-Z\s]/g, ''))} onBlur={(e) => validateField('firstName', e.target.value, 'ticket')} disabled={sameAsTraveler} required />
                    {errors.ticketFirstName && <p className="text-sm text-red-500 mt-1">{errors.ticketFirstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ticketLastName">Last Name (English only)</Label>
                    <Input id="ticketLastName" placeholder="Last name (English)" value={ticketUserData.lastName} onChange={(e) => setTicketField('lastName', e.target.value.replace(/[^a-zA-Z\s]/g, ''))} onBlur={(e) => validateField('lastName', e.target.value, 'ticket')} disabled={sameAsTraveler} required />
                    {errors.ticketLastName && <p className="text-sm text-red-500 mt-1">{errors.ticketLastName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="ticketEmail">Email</Label>
                  <Input id="ticketEmail" type="email" placeholder="Email address" value={ticketUserData.email} onChange={(e) => setTicketField('email', e.target.value)} onBlur={(e) => validateField('email', e.target.value, 'ticket')} disabled={sameAsTraveler} required />
                  {errors.ticketEmail && <p className="text-sm text-red-500 mt-1">{errors.ticketEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="ticketPhone">Phone number</Label>
                  <div className="flex gap-2">
                    {/* 모바일에서는 모달, 데스크톱에서는 셀렉트 */}
                    <div className="hidden sm:block">
                      <Select value={ticketUserData.countryCode} onValueChange={(v) => setTicketField('countryCode', v)} disabled={sameAsTraveler}>
                        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((c) => (<SelectItem key={`ticket-${c.code}-${c.country}`} value={c.code}><span className="mr-3">{c.flag}</span><span className="w-20 inline-block mr-6">{c.code}</span><span>{c.country} ({c.code})</span></SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* 모바일용 국가 번호 버튼 */}
                    <div className="sm:hidden">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-20 h-10 px-2 flex items-center justify-center"
                        onClick={() => setIsTicketCountryModalOpen(true)}
                        disabled={sameAsTraveler}
                      >
                        <span className="text-sm">{countryCodes.find(c => c.code === ticketUserData.countryCode)?.flag} {ticketUserData.countryCode}</span>
                      </Button>
                    </div>
                    
                    <Input 
                      id="ticketPhone" 
                      type="tel" 
                      placeholder="Phone number" 
                      value={ticketUserData.phone} 
                      onChange={(e) => setTicketField('phone', e.target.value.replace(/[^0-9-]/g, ''))} 
                      onBlur={(e) => validateField('phone', e.target.value, 'ticket')} 
                      disabled={sameAsTraveler} 
                      className="flex-1" 
                      required 
                    />
                  </div>
                  {errors.ticketPhone && <p className="text-sm text-red-500 mt-1">{errors.ticketPhone}</p>}
                  
                  {/* 모바일용 티켓 사용자 국가 번호 선택 모달 */}
                  <Dialog open={isTicketCountryModalOpen} onOpenChange={setIsTicketCountryModalOpen}>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select Country Code</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {countryCodes.map((c) => (
                          <Button
                            key={`ticket-${c.code}-${c.country}`}
                            variant="ghost"
                            className={`w-full justify-start h-12 px-4 ${ticketUserData.countryCode === c.code ? 'bg-[#01c5fd] text-white hover:bg-[#01c5fd] hover:text-white' : 'hover:bg-gray-100'}`}
                            onClick={() => {
                              setTicketField('countryCode', c.code)
                              setIsTicketCountryModalOpen(false)
                            }}
                          >
                            <span className="text-lg mr-3">{c.flag}</span>
                            <span className={`flex-1 text-left ${ticketUserData.countryCode === c.code ? 'text-white' : 'text-gray-900'}`}>
                              {c.country} ({c.code})
                            </span>
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">• Be careful to write accurately when entering your reservation.</p>
                  <p className="text-sm text-gray-600">• Please provide accurate contact information for smooth reservation.</p>
                  <p className="text-sm text-gray-600">• Reservation information cannot be changed arbitrarily after reservation.</p>
                </div>
                <div>
                  <Label htmlFor="specialRequests">Please enter the details you want to inform the business.</Label>
                  <Textarea id="specialRequests" value={formData.specialRequests} onChange={(e) => setField('specialRequests', e.target.value)} placeholder="Please enter any special requests or requirements." rows={4} />
                </div>
              </div>
              <Button onClick={() => handleNextStep(2)} className="w-full text-white" style={{ backgroundColor: '#01c5fd' }} size="lg">Next</Button>
            </CardContent>
          )}
          {isStepCompleted(2) && !isStepActive(2) && (
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Ticket User</p>
                  <p className="text-gray-600">{ticketUserData.firstName} {ticketUserData.lastName}</p>
                  <p className="text-gray-600">{ticketUserData.email}</p>
                  <p className="text-gray-600">{ticketUserData.countryCode} {ticketUserData.phone}</p>
                </div>
                {formData.specialRequests && (
                  <div>
                    <p className="font-medium">Special Requests</p>
                    <p className="text-gray-600">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-6">
          <CardHeader className={`cursor-pointer ${isStepAccessible(3) ? '' : 'opacity-50'}`} onClick={() => isStepAccessible(3) && setActiveStep(3)}>
            <CardTitle className="flex items-center gap-2">{getStepIcon(3)} Payment details</CardTitle>
          </CardHeader>
          {isStepActive(3) && (
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {/* PayPal 결제 옵션 */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-4 cursor-pointer flex-1">
                    <img 
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                      alt="PayPal" 
                      className="w-12 h-8 object-contain"
                    />
                    <div>
                      <span className="font-semibold">PayPal</span>
                      <p className="text-sm text-gray-600">You will be redirected to PayPal to complete payment</p>
                    </div>
                  </Label>
                </div>

                {/* 카드 결제 옵션 */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-4 cursor-pointer flex-1">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                    <div>
                      <span className="font-semibold">Debit or credit card</span>
                      <p className="text-sm text-gray-600">Pay directly with your card</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* PayPal 선택 시 표시되는 정보 */}
              {paymentMethod === 'paypal' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800">PayPal Benefits</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Buyer protection included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No need to enter card details</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Instant payment confirmation</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* 카드 결제 선택 시 표시되는 폼 */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label htmlFor="cardNumber">Card number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 1234 1234 1234" 
                        value={cardInfo.cardNumber} 
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ') })} 
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZJU0E8L3RleHQ+Cjwvc3ZnPgo=" alt="Visa" className="w-8 h-5" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwN0RDQyIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFNRVg8L3RleHQ+Cjwvc3ZnPgo=" alt="Amex" className="w-8 h-5" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4K" alt="Mastercard" className="w-8 h-5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={`${cardInfo.expiryMonth}${cardInfo.expiryYear ? '/' + cardInfo.expiryYear : ''}`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 2) {
                            setCardInfo({ ...cardInfo, expiryMonth: value, expiryYear: '' })
                          } else {
                            setCardInfo({ ...cardInfo, expiryMonth: value.slice(0, 2), expiryYear: value.slice(2, 4) })
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="••••" 
                        type="password"
                        value={cardInfo.cvv} 
                        onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="holderName">Name on card</Label>
                    <Input 
                      id="holderName" 
                      placeholder="Name on card" 
                      value={cardInfo.holderName} 
                      onChange={(e) => setCardInfo({ ...cardInfo, holderName: e.target.value })} 
                    />
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tour Price</span>
                    <span>${formatNum(tour.price)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{storedObj?.quantity || (formData.adults + formData.children)}</span>
                  </div>
                  {selections.length > 0 && (
                    <div className="space-y-1">
                      {selections.map((selection, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                          <span className="truncate">{selection.optionTitle}</span>
                          <span>${formatNum(selection.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>${formatNum(total)} USD</span>
                  </div>
                </div>
              </div>

              {paymentMethod === 'paypal' ? (
                <Button 
                  onClick={handlePayment} 
                  className="w-full text-white hover:opacity-90" 
                  style={{ backgroundColor: '#01c5fd' }}
                  size="lg"
                >
                  <img 
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                    alt="PayPal" 
                    className="w-6 h-4 mr-2"
                  />
                  Pay with PayPal
                </Button>
              ) : paymentMethod === 'card' ? (
                <Button 
                  onClick={handlePayment} 
                  className="w-full text-white hover:opacity-90" 
                  style={{ backgroundColor: '#01c5fd' }}
                  size="lg"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Pay now
                </Button>
              ) : (
                <Button 
                  onClick={handlePayment} 
                  className="w-full text-white bg-gray-400 cursor-not-allowed" 
                  size="lg"
                  disabled
                >
                  Select a payment method
                </Button>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

export default function BookingInfoPage() {
  return (
    <Suspense fallback={<div />}> 
      <BookingInfoContent />
    </Suspense>
  )
}


