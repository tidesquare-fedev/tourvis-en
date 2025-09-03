import { renderHook, act } from '@testing-library/react'
import { useTourDetailState } from '../useTourDetailState'

// Mock refs
const mockRefs = {
  options: { current: document.createElement('div') },
  description: { current: document.createElement('div') },
  reviews: { current: document.createElement('div') },
}

const mockSections = [
  { id: 'options', label: 'Options', ref: mockRefs.options },
  { id: 'description', label: 'Description', ref: mockRefs.description },
  { id: 'reviews', label: 'Reviews', ref: mockRefs.reviews },
]

describe('useTourDetailState', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    
    expect(result.current.selectedDate).toBeUndefined()
    expect(result.current.quantity).toBe(0)
    expect(result.current.activeSection).toBe('options')
    expect(result.current.showFullDescription).toBe(false)
    expect(result.current.showAllReviews).toBe(false)
    expect(result.current.infoModal).toBeNull()
  })

  it('updates selectedDate correctly', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    const testDate = new Date('2024-01-01')
    
    act(() => {
      result.current.setSelectedDate(testDate)
    })
    
    expect(result.current.selectedDate).toBe(testDate)
  })

  it('updates quantity correctly', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    
    act(() => {
      result.current.setQuantity(5)
    })
    
    expect(result.current.quantity).toBe(5)
  })

  it('updates activeSection correctly', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    
    act(() => {
      result.current.setActiveSection('reviews')
    })
    
    expect(result.current.activeSection).toBe('reviews')
  })

  it('handles quantity change with validation', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    
    // Valid quantity
    act(() => {
      result.current.handleQuantityChange(5)
    })
    expect(result.current.quantity).toBe(5)
    
    // Invalid quantity (negative)
    act(() => {
      result.current.handleQuantityChange(-1)
    })
    expect(result.current.quantity).toBe(5) // Should not change
    
    // Invalid quantity (over max)
    act(() => {
      result.current.handleQuantityChange(15)
    })
    expect(result.current.quantity).toBe(5) // Should not change
  })

  it('updates infoModal correctly', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    const testModal = { title: 'Test Title', content: 'Test Content' }
    
    act(() => {
      result.current.setInfoModal(testModal)
    })
    
    expect(result.current.infoModal).toEqual(testModal)
    
    act(() => {
      result.current.setInfoModal(null)
    })
    
    expect(result.current.infoModal).toBeNull()
  })

  it('scrollToSection works with valid section', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    
    // Mock scrollIntoView
    const mockScrollIntoView = jest.fn()
    mockRefs.description.current.scrollIntoView = mockScrollIntoView
    
    act(() => {
      result.current.scrollToSection('description')
    })
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })
  })

  it('scrollToSection handles invalid section gracefully', () => {
    const { result } = renderHook(() => useTourDetailState(mockSections))
    
    // Should not throw error
    expect(() => {
      act(() => {
        result.current.scrollToSection('invalid-section')
      })
    }).not.toThrow()
  })
})
