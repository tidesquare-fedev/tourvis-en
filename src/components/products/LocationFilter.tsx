
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from 'react'

interface LocationFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
}

export const LocationFilter = ({ value, onChange, options }: LocationFilterProps) => {
  const base = (Array.isArray(options) && options.length > 0) ? options : [
    "Seoul","Busan","Jeju","Gyeongju","Incheon","Sokcho","Gangneung","Jeonju","Andong","Gapyeong",
  ]
  const locations = [{ value: "all", label: "All Locations" }, ...base.map((l) => ({ value: l, label: l }))]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <LocationPills value={value} onChange={onChange} locations={locations} />
    </div>
  );
};

function LocationPills({ value, onChange, locations }: { value: string[]; onChange: (v: string[]) => void; locations: { value: string; label: string }[] }) {
  const [expanded, setExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setShowToggle(el.scrollHeight > el.clientHeight + 1)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [])

  const toggle = () => setExpanded((e) => !e)

  return (
    <>
      <div ref={ref} className={`flex flex-wrap gap-2 transition-all ${expanded ? '' : 'max-h-20 overflow-hidden'}`}>
        {locations.map((loc) => {
          const selected = value.includes(loc.value) || (loc.value === 'all' && value.length === 0)
          const onClick = () => {
            if (loc.value === 'all') return onChange([])
            if (value.includes(loc.value)) onChange(value.filter(v => v !== loc.value))
            else onChange([...value, loc.value])
          }
          return (
            <button key={loc.value} type="button" onClick={onClick} className={`px-3 py-1.5 rounded-full border text-sm ${selected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
              {loc.label}
            </button>
          )
        })}
      </div>
      {showToggle && (
        <div className="mt-2">
          <button type="button" onClick={toggle} className="text-xs text-gray-900 hover:underline">
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </>
  )
}
