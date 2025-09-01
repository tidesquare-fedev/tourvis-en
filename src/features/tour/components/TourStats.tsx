"use client"

import { Clock, Users, Calendar as CalendarIcon, MessageCircle } from 'lucide-react'

type TourStatsProps = {
  duration: string
  maxGroup: number
  minAge: number
  language: string
}

export function TourStats({ duration, maxGroup, minAge, language }: TourStatsProps) {
  return (
    <div className="mb-6">
      <div className="mt-4 sm:mt-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-semibold">{duration}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Max Group</div>
              <div className="font-semibold">{maxGroup} people</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Min Age</div>
              <div className="font-semibold">{minAge} years</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Language</div>
              <div className="font-semibold">{language}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


