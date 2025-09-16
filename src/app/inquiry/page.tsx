'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutProvider } from '@/components/layout/LayoutProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, MessageCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function InquiryPage() {
  const router = useRouter()
  const [inquiryData, setInquiryData] = useState({ author: '', password: '', name: '', email: '', phone: '', category: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ author: '', password: '', name: '', email: '', phone: '', category: '', subject: '', message: '' })

  const validateField = (field: keyof typeof errors, value: string) => {
    let error = ''
    switch (field) {
      case 'author':
        if (!value.trim()) error = 'Author is required'
        else if (value.trim().length < 2) error = 'At least 2 characters'
        break
      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        } else {
          // 각 조건을 개별적으로 체크
          const hasLetter = /[A-Za-z]/.test(value)
          const hasNumber = /\d/.test(value)
          const hasSpecialChar = /[@$!%*#?&]/.test(value)
          
          if (!hasLetter && !hasNumber && !hasSpecialChar) {
            error = 'Password must contain letters, numbers, and special characters'
          } else if (!hasLetter && !hasNumber) {
            error = 'Password must contain letters and numbers'
          } else if (!hasLetter && !hasSpecialChar) {
            error = 'Password must contain letters and special characters'
          } else if (!hasNumber && !hasSpecialChar) {
            error = 'Password must contain numbers and special characters'
          } else if (!hasLetter) {
            error = 'Password must contain at least one letter'
          } else if (!hasNumber) {
            error = 'Password must contain at least one number'
          } else if (!hasSpecialChar) {
            error = 'Password must contain at least one special character (@$!%*#?&)'
          }
        }
        break
      case 'name':
        if (!value.trim()) error = 'Name is required'
        else if (!/^[a-zA-Z\s'-]+$/.test(value)) error = 'English letters only'
        break
      case 'email':
        if (!value.trim()) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format'
        break
      case 'phone':
        if (value && value.replace(/[^0-9]/g, '').length < 7) error = 'Phone number must have at least 7 digits'
        break
      case 'category':
        if (!value) error = 'Please select inquiry type'
        break
      case 'subject':
        if (!value.trim()) error = 'Subject is required'
        else if (value.trim().length < 3) error = 'At least 3 characters'
        break
      case 'message':
        if (!value.trim()) error = 'Message is required'
        else if (value.trim().length < 10) error = 'At least 10 characters'
        break
    }
    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validations: Array<[keyof typeof errors, string]> = [
      ['author', inquiryData.author],
      ['password', inquiryData.password],
      ['name', inquiryData.name],
      ['email', inquiryData.email],
      ['phone', inquiryData.phone],
      ['category', inquiryData.category],
      ['subject', inquiryData.subject],
      ['message', inquiryData.message],
    ]
    const allValid = validations.every(([f, v]) => validateField(f, v))
    if (!allValid) {
      toast({ title: 'Validation failed', description: 'Please check the highlighted fields', variant: 'destructive' })
      return
    }
    setLoading(true)
    
    try {
      const response = await fetch('/en/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit inquiry')
      }

      const result = await response.json()
      // 성공 모달 표시
      setShowSuccessModal(true)
      setInquiryData({ author: '', password: '', name: '', email: '', phone: '', category: '', subject: '', message: '' })
      setErrors({ author: '', password: '', name: '', email: '', phone: '', category: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      toast({ title: 'Submission Failed', description: 'Failed to submit inquiry. Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const setField = (field: string, value: string) => setInquiryData((p) => ({ ...p, [field]: value }))

  // 성공 모달이 닫힐 때 inquiry-list로 리다이렉트
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push('/inquiry-list')
  }

  return (
    <LayoutProvider>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
          <div className="order-2 sm:order-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Direct Inquiry</h1>
            <p className="text-base sm:text-lg text-gray-600">If you have any questions, feel free to contact us anytime</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg"><MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Make Inquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author" className="text-sm sm:text-base">Author *</Label>
                  <Input id="author" value={inquiryData.author} onChange={(e) => setField('author', e.target.value)} onBlur={(e) => validateField('author', e.target.value)} placeholder="Enter your username" required className="text-sm sm:text-base" />
                  {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm sm:text-base">Password *</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={inquiryData.password} onChange={(e) => setField('password', e.target.value)} onBlur={(e) => validateField('password', e.target.value)} placeholder="Enter password" required className="text-sm sm:text-base pr-10" />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-2 flex items-center text-gray-500" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must contain at least 6 characters with letters, numbers, and special characters (@$!%*#?&)</p>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                  <Input id="name" value={inquiryData.name} onChange={(e) => setField('name', e.target.value)} onBlur={(e) => validateField('name', e.target.value)} placeholder="John Doe" required className="text-sm sm:text-base" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                  <Input id="email" type="email" value={inquiryData.email} onChange={(e) => setField('email', e.target.value)} onBlur={(e) => validateField('email', e.target.value)} placeholder="your@email.com" required className="text-sm sm:text-base" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                <Input id="phone" value={inquiryData.phone} onChange={(e) => setField('phone', e.target.value)} onBlur={(e) => validateField('phone', e.target.value)} placeholder="010-1234-5678" className="text-sm sm:text-base" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="category" className="text-sm sm:text-base">Inquiry Type *</Label>
                <Select value={inquiryData.category} onValueChange={(v) => { setField('category', v); validateField('category', v) }}>
                  <SelectTrigger className="text-sm sm:text-base"><SelectValue placeholder="Please select inquiry type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reservation">Reservation Inquiry</SelectItem>
                    <SelectItem value="cancel">Cancellation/Refund Inquiry</SelectItem>
                    <SelectItem value="change">Reservation Change Inquiry</SelectItem>
                    <SelectItem value="product">Product Inquiry</SelectItem>
                    <SelectItem value="other">Other Inquiry</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div>
                <Label htmlFor="subject" className="text-sm sm:text-base">Subject *</Label>
                <Input id="subject" value={inquiryData.subject} onChange={(e) => setField('subject', e.target.value)} onBlur={(e) => validateField('subject', e.target.value)} placeholder="Please enter inquiry subject" required className="text-sm sm:text-base" />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                <Textarea id="message" value={inquiryData.message} onChange={(e) => setField('message', e.target.value)} onBlur={(e) => validateField('message', e.target.value)} placeholder="Please describe your inquiry in detail" rows={6} required className="text-sm sm:text-base" />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>{loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p>• Business Hours: Weekdays 10:00 AM - 06:00 PM (Closed on weekends and holidays)</p>
              <p>• Inquiry responses are sent to your registered email within 24 hours</p>
              <p>• For urgent matters, please contact our customer service (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 성공 모달 */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Inquiry Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              We will respond to your inquiry within 24 hours. You will be redirected to the inquiry list page.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button 
              onClick={handleSuccessModalClose}
              className="w-full"
              style={{ backgroundColor: '#01c5fd' }}
            >
              Go to Inquiry List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LayoutProvider>
  )
}