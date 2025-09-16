'use client'

import { useState, type ReactNode } from 'react'
import { Package, X, AlertTriangle, Check, ChevronRight, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type ImportantInfoItem = {
  id: string
  title: string | ReactNode
  icon: ReactNode
  content: string[]
  color: string
}

type ImportantInformationProps = {
  bringItems: string[]
  notAllowed: string[]
  notSuitable: string[]
  beforeTravel?: string[]
  beforeTravelHtml?: string
}

export function ImportantInformation({ 
  bringItems, 
  notAllowed, 
  notSuitable, 
  beforeTravel = [],
  beforeTravelHtml = ''
}: ImportantInformationProps) {
  const [selectedItem, setSelectedItem] = useState<ImportantInfoItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const cleanList = (arr?: string[]) => (Array.isArray(arr) ? arr.map((s) => String(s).trim()).filter(Boolean) : [])
  const bringItemsClean = cleanList(bringItems)
  const notAllowedClean = cleanList(notAllowed)
  const notSuitableClean = cleanList(notSuitable)
  const beforeTravelClean = cleanList(beforeTravel)
  const hasBeforeTravelHtml = typeof beforeTravelHtml === 'string' && beforeTravelHtml.trim().length > 0

  const ensureUlClasses = (html: string): string => {
    const s = String(html || '')
    if (!s) return ''
    if (/<ul[\s>]/i.test(s)) return s.replace('<ul', '<ul class="list-disc pl-5 space-y-1"')
    return `<ul class="list-disc pl-5 space-y-1">${s}</ul>`
  }

  const infoItems: ImportantInfoItem[] = [
    {
      id: 'bring',
      title: 'What to Bring',
      icon: <Package className="w-5 h-5" />,
      content: bringItemsClean,
      color: 'text-blue-600'
    },
    {
      id: 'not-allowed',
      title: <span><span style={{ color: '#ff00cc' }}>Not</span> Allowed</span>,
      icon: <X className="w-5 h-5" />,
      content: notAllowedClean,
      color: 'text-purple-600'
    },
    {
      id: 'not-suitable',
      title: <span><span style={{ color: '#ff00cc' }}>Not</span> Suitable For</span>,
      icon: <AlertTriangle className="w-5 h-5" />,
      content: notSuitableClean,
      color: 'text-blue-600'
    },
    {
      id: 'before-travel',
      title: 'Before you travel',
      icon: <Check className="w-5 h-5" />,
      content: beforeTravelClean,
      color: 'text-purple-600'
    }
  ]

  const visibleItems = infoItems.filter((it) => {
    if (it.id === 'before-travel') {
      return (Array.isArray(it.content) && it.content.length > 0) || hasBeforeTravelHtml
    }
    return Array.isArray(it.content) && it.content.length > 0
  })

  const handleItemClick = (item: ImportantInfoItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  if (visibleItems.length === 0) return null

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
          {visibleItems.map((item) => (
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className={`${selectedItem?.color} flex-shrink-0`}>
                {selectedItem?.icon}
              </div>
              <span className="break-words">{selectedItem?.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-1">
            {selectedItem?.id === 'before-travel' && hasBeforeTravelHtml && (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: ensureUlClasses(beforeTravelHtml) }} />
            )}
            {selectedItem?.id === 'before-travel' && !hasBeforeTravelHtml && selectedItem?.content && selectedItem.content.length > 0 && (
              <ul className="space-y-2 sm:space-y-3">
                {selectedItem.content.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 sm:gap-4">
                    <span className="text-gray-900 flex-shrink-0 text-lg">•</span>
                    <span className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {selectedItem?.id !== 'before-travel' && selectedItem?.content && selectedItem.content.length > 0 && (
              <ul className="space-y-2 sm:space-y-3">
                {selectedItem.content.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 sm:gap-4">
                    <span className="text-gray-900 flex-shrink-0 text-lg">•</span>
                    <span className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {(!selectedItem?.content || selectedItem?.content.length === 0) && (!hasBeforeTravelHtml || selectedItem?.id !== 'before-travel') && (
              <p className="text-gray-500 text-base sm:text-lg">No specific information available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
