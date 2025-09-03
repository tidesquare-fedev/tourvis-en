"use client"

import { Clock, MapPin, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

type TourUsageGuideProps = {
  itinerary: Array<{
    day: number
    title: string
    description: string
    duration: string
    activities: string[]
  }>
  meetingPoint: string
  meetingPointAddress: string
}

export function TourUsageGuide({ 
  itinerary, 
  meetingPoint, 
  meetingPointAddress
}: TourUsageGuideProps) {
  const [isMeetingPointExpanded, setIsMeetingPointExpanded] = useState(false)

  // Meeting Point 내용을 간결하게 요약하는 함수
  const getMeetingPointSummary = (content: string) => {
    // HTML 태그 제거
    const textContent = content.replace(/<[^>]*>/g, '')
    // 첫 번째 문장이나 200자까지만 표시
    const firstSentence = textContent.split('.')[0]
    if (firstSentence.length <= 200) {
      return firstSentence + (textContent.length > firstSentence.length ? '...' : '')
    }
    return textContent.substring(0, 200) + '...'
  }

  return (
    <div className="space-y-8">
      {/* Itinerary */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Itinerary</h3>
        <div className="space-y-4">
          {itinerary.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <div className="space-y-1">
                  {item.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="text-sm text-gray-600">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Point */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Meeting Point</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto sm:mx-0">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  {isMeetingPointExpanded ? (
                    <div 
                      className="text-sm text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: meetingPoint }}
                    />
                  ) : (
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {getMeetingPointSummary(meetingPoint)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsMeetingPointExpanded(!isMeetingPointExpanded)}
                  className="flex items-center justify-center sm:justify-start gap-1 text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors flex-shrink-0 w-full sm:w-auto py-2 sm:py-0 sm:mt-1"
                >
                  {isMeetingPointExpanded ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Show More</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>




    </div>
  )
}
