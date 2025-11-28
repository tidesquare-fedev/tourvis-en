'use client';

type Section = { id: string; label: string };

type TourSectionTabsProps = {
  sections: Section[];
  activeSection: string;
  onClick: (id: string) => void;
  idAttr?: string;
};

export function TourSectionTabs({
  sections,
  activeSection,
  onClick,
  idAttr,
}: TourSectionTabsProps) {
  return (
    <div
      id={idAttr}
      className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b mb-8 w-full"
    >
      <div className="flex gap-2 px-1 max-w-full min-w-0 overflow-x-auto scrollbar-hide">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => onClick(section.id)}
            className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${activeSection === section.id ? 'text-[#01c5fd]' : 'text-gray-600 hover:text-[#01c5fd]'}`}
          >
            {section.label}
            <span
              className={`absolute left-0 right-0 -bottom-px h-0.5 transition-all ${activeSection === section.id ? 'bg-[#01c5fd]' : 'bg-transparent'}`}
            ></span>
          </button>
        ))}
      </div>
    </div>
  );
}
