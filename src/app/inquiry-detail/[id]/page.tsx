'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MessageCircle, User } from 'lucide-react'

interface InquiryDetail {
  id: string
  subject: string
  category: string
  status: 'pending' | 'answered' | 'closed'
  createdAt: string
  message: string
  name: string
  email: string
  phone?: string
  reply?: { message: string; repliedAt: string; repliedBy: string }
}

const mockInquiryDetails: Record<string, InquiryDetail> = {
  'INQ-001': { id: 'INQ-001', subject: 'Question about Seoul tour package', category: 'Tour Package', status: 'pending', createdAt: '2024-01-15', message: 'Hello, I would like to know more details about the Seoul tour package...', name: 'John Doe', email: 'john@email.com', phone: '+1-555-123-4567' },
  'INQ-002': { id: 'INQ-002', subject: 'Cancellation policy inquiry', category: 'Cancellation', status: 'answered', createdAt: '2024-01-10', message: 'Hi, I would like to know about the cancellation policy for tours...', name: 'John Doe', email: 'john@email.com', phone: '+1-555-123-4567', reply: { message: 'You can cancel up to 24 hours before...', repliedAt: '2024-01-12', repliedBy: 'Customer Service Team' } },
}

const getStatusColor = (status: string) => ({ pending: 'bg-yellow-100 text-yellow-800', answered: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' } as any)[status] || 'bg-gray-100 text-gray-800'
const getStatusText = (status: string) => ({ pending: 'Pending', answered: 'Answered', closed: 'Closed' } as any)[status] || 'Unknown'

export default function InquiryDetailPage() {
  const params = useParams<{ id: string }>()
  const inquiry = params?.id ? mockInquiryDetails[params.id] : null

  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem('previousPath', window.location.pathname)
  }, [])

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <img src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" alt="KoreaTours" className="h-6 sm:h-8" />
              <nav className="flex items-center space-x-3 sm:space-x-6">
                <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
                <Link href="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Check Reservation</Link>
              </nav>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Inquiry Not Found</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">The requested inquiry does not exist.</p>
              <Link href="/inquiry-list"><Button className="w-full sm:w-auto">Back to Inquiry List</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <img src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" alt="KoreaTours" className="h-6 sm:h-8" />
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Check Reservation</Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
          <Link href="/inquiry-list" className="order-1 sm:order-1"><Button variant="ghost" size="sm" className="flex items-center"><ArrowLeft className="w-4 h-4 mr-2" />Back to List</Button></Link>
          <div className="order-2 sm:order-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Inquiry Details</h1>
            <p className="text-base sm:text-lg text-gray-600">View inquiry content and responses</p>
          </div>
        </div>
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1 w-full">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="text-base sm:text-lg break-words">{inquiry.subject}</span>
                  <Badge className={`${getStatusColor(inquiry.status)} w-fit`}>{getStatusText(inquiry.status)}</Badge>
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-600"><strong>Inquiry Number:</strong> {inquiry.id}</p>
                <p className="text-xs sm:text-sm text-gray-600"><strong>Category:</strong> {inquiry.category}</p>
                <p className="text-xs sm:text-sm text-gray-600"><strong>Created:</strong> {inquiry.createdAt}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-600"><strong>Name:</strong> {inquiry.name}</p>
                <p className="text-xs sm:text-sm text-gray-600 break-all"><strong>Email:</strong> {inquiry.email}</p>
                {inquiry.phone && <p className="text-xs sm:text-sm text-gray-600"><strong>Phone:</strong> {inquiry.phone}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg"><User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />My Inquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">{inquiry.message}</p>
          </CardContent>
        </Card>
        {inquiry.reply ? (
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg"><MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 break-words">{inquiry.reply.message}</p>
                <div className="text-xs sm:text-sm text-gray-600">
                  <p><strong>Responded by:</strong> {inquiry.reply.repliedBy}</p>
                  <p><strong>Response Date:</strong> {inquiry.reply.repliedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-6 sm:p-8 text-center">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Waiting for Response</h3>
              <p className="text-sm sm:text-base text-gray-600">Your inquiry has been received. We will respond within 24 hours.</p>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/inquiry-list" className="w-full sm:w-auto"><Button variant="outline" className="w-full sm:w-auto">Back to Inquiry List</Button></Link>
          <Link href="/inquiry" className="w-full sm:w-auto"><Button style={{ backgroundColor: '#01c5fd' }} className="w-full sm:w-auto">New Inquiry</Button></Link>
        </div>
      </div>
    </div>
  )
}


