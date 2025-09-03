'use client'

import { useState } from 'react'
import { Package, X, AlertTriangle, Check, ChevronRight, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type ImportantInfoItem = {
  id: string
  title: string
  icon: React.ReactNode
  content: string[]
  color: string
}

type ImportantInformationProps = {
  bringItems: string[]
  notAllowed: string[]
  notSuitable: string[]
  beforeTravel?: string[]
}

export function ImportantInformation({ 
  bringItems, 
  notAllowed, 
  notSuitable, 
  beforeTravel = [] 
}: ImportantInformationProps) {
  const [selectedItem, setSelectedItem] = useState<ImportantInfoItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const infoItems: ImportantInfoItem[] = [
    {
      id: 'bring',
      title: 'What to Bring',
      icon: <Package className="w-5 h-5" />,
      content: bringItems,
      color: 'text-blue-600'
    },
    {
      id: 'not-allowed',
      title: 'Not Allowed',
      icon: <X className="w-5 h-5" />,
      content: notAllowed,
      color: 'text-purple-600'
    },
    {
      id: 'not-suitable',
      title: 'Not Suitable For',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: notSuitable,
      color: 'text-blue-600'
    },
    {
      id: 'before-travel',
      title: 'Before you travel',
      icon: <Check className="w-5 h-5" />,
      content: beforeTravel.length > 0 ? beforeTravel : [
        'Valid ID required for entry',
        'Arrive 15 minutes before tour time',
        'Dress code applies (shoulders and knees covered)',
        'No large bags or backpacks allowed'
      ],
      color: 'text-purple-600'
    }
  ]

  const handleItemClick = (item: ImportantInfoItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Important information</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {infoItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all duration-200 group w-full"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className={`${item.color} flex-shrink-0`}>
                  {item.icon}
                </div>
                <span className="text-gray-900 font-medium text-base truncate">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[calc(100vw-32px)] sm:w-[500px] md:w-[600px] lg:w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto mx-auto my-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className={`${selectedItem?.color} flex-shrink-0`}>
                {selectedItem?.icon}
              </div>
              <span className="break-words">{selectedItem?.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-1">
            {selectedItem?.content && selectedItem.content.length > 0 ? (
              selectedItem.id === 'before-travel' ? (
                <ul className="space-y-2 sm:space-y-3">
                  {selectedItem.content[0]
                    .split(/<br\s*\/?>|<li[^>]*>/i) // <br> 태그와 <li> 태그로 분할
                    .map(item => item.replace(/<[^>]*>/g, '')) // 각 항목에서 HTML 태그 제거
                    .filter(item => item.trim()) // 빈 문자열 제거
                    .map((item, index) => (
                      <li key={index} className="flex items-center gap-3 sm:gap-4">
                        <span className="text-gray-900 flex-shrink-0 text-lg">•</span>
                        <span className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">{item.trim()}</span>
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <ul className="space-y-2 sm:space-y-3">
                  {selectedItem.content.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 sm:gap-4">
                      <span className="text-gray-900 flex-shrink-0 text-lg">•</span>
                      <span className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-gray-500 text-base sm:text-lg">No specific information available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
