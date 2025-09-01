"use client"

import { Button } from '@/components/ui/button'
import { Plus, Minus, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import { TourOption } from '@/types/tour'
import { useState } from 'react'

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

  const totalPrice = selectedLabel ? quantity * selectedLabel.net_price_currency : 0

  return (
    <div className="space-y-6">
      <h4 className="font-medium">Tour Options</h4>
      
      {/* Option Selection */}
      <div className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.outer_id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
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
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{option.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">
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
                    <div className="grid grid-cols-4 gap-2">
                      {option.timeslots.map((timeslot) => (
                        <button
                          key={timeslot.outer_id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTimeslot(timeslot.title)
                          }}
                          className={`px-3 py-2 text-sm border rounded-md transition-colors ${
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
                          className={`w-full flex justify-between items-center px-3 py-2 text-sm border rounded-md transition-colors ${
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">수량:</span>
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
                      <span className="w-8 text-center font-medium">{quantity}</span>
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
                      <div className="text-sm text-gray-600">총액</div>
                      <div className="text-lg font-bold text-blue-600">€{totalPrice}</div>
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


