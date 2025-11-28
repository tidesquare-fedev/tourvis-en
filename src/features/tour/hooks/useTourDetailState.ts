import { useState, useRef, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
  ref: React.RefObject<HTMLDivElement>;
}

interface TourDetailState {
  selectedDate: Date | undefined;
  quantity: number;
  activeSection: string;
  showFullDescription: boolean;
  showAllReviews: boolean;
  infoModal: { title: string; content: string } | null;
}

interface TourDetailActions {
  setSelectedDate: (date: Date | undefined) => void;
  setQuantity: (quantity: number) => void;
  setActiveSection: (section: string) => void;
  setShowFullDescription: (show: boolean) => void;
  setShowAllReviews: (show: boolean) => void;
  setInfoModal: (modal: { title: string; content: string } | null) => void;
  scrollToSection: (sectionId: string) => void;
  handleQuantityChange: (newQuantity: number) => void;
}

export function useTourDetailState(
  sections: Section[],
): TourDetailState & TourDetailActions {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [quantity, setQuantity] = useState(0);
  const [activeSection, setActiveSection] = useState('options');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [infoModal, setInfoModal] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // Intersection Observer for section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id, ref }) => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.ref.current) {
      section.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
    if (typeof document !== 'undefined') {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    // Mock tour data에서 maxGroup을 가져와야 함
    const maxGroup = 10; // 실제로는 props나 context에서 가져와야 함
    if (newQuantity >= 0 && newQuantity <= maxGroup) {
      setQuantity(newQuantity);
    }
  };

  return {
    // State
    selectedDate,
    quantity,
    activeSection,
    showFullDescription,
    showAllReviews,
    infoModal,
    // Actions
    setSelectedDate,
    setQuantity,
    setActiveSection,
    setShowFullDescription,
    setShowAllReviews,
    setInfoModal,
    scrollToSection,
    handleQuantityChange,
  };
}
