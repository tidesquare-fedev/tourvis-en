"use client"

type Section = { id: string; label: string }

type TourSectionTabsProps = {
  sections: Section[]
  activeSection: string
  onClick: (id: string) => void
}

export function TourSectionTabs({ sections, activeSection, onClick }: TourSectionTabsProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b mb-8">
      <div className="flex space-x-1 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onClick(section.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeSection === section.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  )
}


