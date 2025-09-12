'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, MessageCircle } from 'lucide-react'
import { Inquiry } from '@/types/admin'

interface InquiryCardProps {
  inquiry: Inquiry
  isSelected?: boolean
  onSelect?: (inquiry: Inquiry) => void
  onToggleDetails?: (inquiryId: string) => void
  showDetails?: boolean
  repliesCount?: number
}

export function InquiryCard({
  inquiry,
  isSelected = false,
  onSelect,
  onToggleDetails,
  showDetails = false,
  repliesCount = 0,
}: InquiryCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      answered: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pending',
      answered: 'Answered',
      closed: 'Closed',
    }
    return texts[status as keyof typeof texts] || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect?.(inquiry)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {inquiry.subject}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {inquiry.author} • {inquiry.email}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <Badge className={`${getStatusColor(inquiry.status)} text-xs`}>
              {getStatusText(inquiry.status)}
            </Badge>
            {repliesCount > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <MessageCircle className="h-3 w-3 mr-1" />
                {repliesCount}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(inquiry.created_at)}
          </div>
          <div className="text-xs text-gray-400">
            {inquiry.category}
          </div>
        </div>

        {onToggleDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleDetails(inquiry.id)
              }}
              className="w-full text-xs"
            >
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
