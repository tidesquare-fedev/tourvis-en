'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ReservationLookupPage() {
  const [searchData, setSearchData] = useState({ reservationNumber: '', email: '' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!searchData.reservationNumber || !searchData.email) {
      toast({ title: 'Missing Information', description: 'Please enter both reservation number and email address', variant: 'destructive' })
      setLoading(false)
      return
    }
    setTimeout(() => {
      toast({ title: 'Reservation Found', description: 'Successfully retrieved reservation information' })
      setLoading(false)
      router.push('/reservation-details')
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => setSearchData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <span className="logo h-6 sm:h-8 w-24 sm:w-28" role="img" aria-label="TOURVIS" />
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/inquiry-list" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Direct Inquiry</Link>
              <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Check Reservation</h1>
          <p className="text-base sm:text-lg text-gray-600">Enter your reservation number and email address to check your booking information</p>
        </div>

        <Card className="max-w-md mx-auto mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg"><Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Reservation Search</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="reservationNumber" className="text-sm sm:text-base">Reservation Number</Label>
                <Input id="reservationNumber" value={searchData.reservationNumber} onChange={(e) => handleInputChange('reservationNumber', e.target.value)} placeholder="e.g., KT12345678" required className="text-sm sm:text-base" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                <Input id="email" type="email" value={searchData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" required className="text-sm sm:text-base" />
              </div>
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>{loading ? 'Searching...' : 'Search Reservation'}</Button>
            </form>
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

        <div className="text-center mt-6 sm:mt-8">
          <Link href="/">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }} className="w-full sm:w-auto text-sm sm:text-base">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


