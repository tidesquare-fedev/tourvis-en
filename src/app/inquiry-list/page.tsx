'use client'

import Link from 'next/link'
import { AppHeader } from '@/components/shared/AppHeader'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Plus, Lock, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface InquiryItem {
  id: string
  author: string
  password: string
  subject: string
  category: string
  status: 'pending' | 'answered' | 'closed'
  createdAt: string
  lastReply?: string
}

const sampleInquiries: InquiryItem[] = [
  { id: 'INQ-001', author: 'john', password: 'password123', subject: 'Question about Seoul tour package', category: 'Tour Package', status: 'pending', createdAt: '2024-01-15' },
  { id: 'INQ-002', author: 'john', password: 'password123', subject: 'Cancellation policy inquiry', category: 'Cancellation', status: 'answered', createdAt: '2024-01-10', lastReply: '2024-01-12' },
  { id: 'INQ-003', author: 'sarah', password: 'mypass456', subject: 'Group discount availability', category: 'Pricing', status: 'closed', createdAt: '2024-01-05', lastReply: '2024-01-08' },
  { id: 'INQ-004', author: 'mike', password: 'secure789', subject: 'Dietary restrictions for food tour', category: 'Special Requirements', status: 'pending', createdAt: '2024-01-20' },
  { id: 'INQ-005', author: 'sarah', password: 'mypass456', subject: 'Transportation from airport', category: 'Transportation', status: 'answered', createdAt: '2024-01-18', lastReply: '2024-01-19' },
]

export default function InquiryListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInquiries, setUserInquiries] = useState<InquiryItem[]>([])
  const [loginData, setLoginData] = useState({ author: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // 새로고침 시 인증 초기화
    setIsAuthenticated(false)
  }, [])

  const authenticateAndLoadInquiries = (author: string, password: string) => {
    const storedInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]')
    const allInquiries = [...storedInquiries, ...sampleInquiries]
    const list = allInquiries.filter((i: InquiryItem) => i.author === author && i.password === password)
    if (list.length > 0) {
      setIsAuthenticated(true)
      setUserInquiries(list)
      return true
    }
    return false
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const success = authenticateAndLoadInquiries(loginData.author, loginData.password)
      if (success) toast({ title: 'Login Successful', description: 'Welcome to your inquiry dashboard' })
      else toast({ title: 'Login Failed', description: 'Invalid author or password', variant: 'destructive' })
      setLoading(false)
    }, 500)
  }

  const getStatusColor = (status: string) => ({ pending: 'bg-yellow-100 text-yellow-800', answered: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' } as any)[status] || 'bg-gray-100 text-gray-800'
  const getStatusText = (status: string) => ({ pending: 'Pending', answered: 'Answered', closed: 'Closed' } as any)[status] || 'Unknown'

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader active="inquiry" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Check Inquiry</h1>
            <p className="text-base sm:text-lg text-gray-600">Enter your name and password to view your 1:1 inquiry history and check the response</p>
          </div>
          <Card className="max-w-md mx-auto mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Search className="w-5 h-5 mr-2" />Inquiry Search</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" value={loginData.author} onChange={(e) => setLoginData((p) => ({ ...p, author: e.target.value }))} placeholder="Enter your username" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={loginData.password} onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))} placeholder="Enter your password" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>{loading ? 'Searching...' : 'Search Inquiry'}</Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Don't have any inquiries yet?</p>
                <Link href="/inquiry"><Button variant="outline" className="w-full">Make Your First Inquiry</Button></Link>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium mb-1">Test Accounts:</p>
                <p className="text-xs text-blue-600">john / password123</p>
                <p className="text-xs text-blue-600">sarah / mypass456</p>
                <p className="text-xs text-blue-600">mike / secure789</p>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6 sm:mt-8">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Can't find your reservation?</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Please make sure you're using the exact reservation number and email address provided at the time of booking.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Customer Support</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Email: support@koreatours.com<br />Phone: +82-2-1234-5678<br />Hours: 9:00 AM - 6:00 PM (KST)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader active="inquiry" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Inquiry History</h1>
            <p className="text-base sm:text-lg text-gray-600">Check and manage your Direct Inquiry</p>
          </div>
          <Link href="/inquiry"><Button className="flex items-center space-x-2 w-full sm:w-auto" style={{ backgroundColor: '#01c5fd' }}><Plus className="w-4 h-4" /><span>New Inquiry</span></Button></Link>
        </div>
        <div className="space-y-4">
          {userInquiries.length > 0 ? (
            userInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{inquiry.subject}</h3>
                        <Badge className={`${getStatusColor(inquiry.status)} w-fit`}>{getStatusText(inquiry.status)}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Inquiry Number: {inquiry.id}</p>
                        <p>Category: {inquiry.category}</p>
                        <p>Created: {inquiry.createdAt}</p>
                        {inquiry.lastReply && <p>Last Reply: {inquiry.lastReply}</p>}
                      </div>
                    </div>
                    <Link href={`/inquiry-detail/${inquiry.id}`} className="w-full sm:w-auto"><Button variant="outline" size="sm" className="w-full sm:w-auto">View Details</Button></Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries yet</h3>
                <p className="text-gray-600 mb-4">If you have any questions, feel free to contact us anytime.</p>
                <Link href="/inquiry"><Button style={{ backgroundColor: '#01c5fd' }}>Make Your First Inquiry</Button></Link>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Business Hours: Weekdays 10:00 AM - 06:00 PM (Closed on weekends and holidays)</p>
              <p>• Inquiry responses are sent to your registered email within 24 hours</p>
              <p>• For urgent matters, please contact our customer service (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Can't find your reservation?</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Please make sure you're using the exact reservation number and email address provided at the time of booking.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Customer Support</h4>
                <p className="text-xs sm:text-sm text-gray-600">Email: support@koreatours.com<br />Phone: +82-2-1234-5678<br />Hours: 9:00 AM - 6:00 PM (KST)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Removed Back to Home button per requirements */}
      </div>
    </div>
  )
}


