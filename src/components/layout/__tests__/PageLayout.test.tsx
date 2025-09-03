import { render, screen } from '@testing-library/react'
import { PageLayout } from '../PageLayout'

// Mock AppHeader
jest.mock('@/components/shared/AppHeader', () => ({
  AppHeader: ({ active, mobileTitle }: { active?: string; mobileTitle?: string }) => (
    <div data-testid="app-header" data-active={active} data-mobile-title={mobileTitle}>
      AppHeader
    </div>
  ),
}))

describe('PageLayout', () => {
  it('renders children correctly', () => {
    render(
      <PageLayout active="tours">
        <div data-testid="test-content">Test Content</div>
      </PageLayout>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByTestId('app-header')).toBeInTheDocument()
  })

  it('passes correct props to AppHeader', () => {
    render(
      <PageLayout active="inquiry" mobileTitle="Test Title">
        <div>Content</div>
      </PageLayout>
    )
    
    const header = screen.getByTestId('app-header')
    expect(header).toHaveAttribute('data-active', 'inquiry')
    expect(header).toHaveAttribute('data-mobile-title', 'Test Title')
  })

  it('applies custom className', () => {
    render(
      <PageLayout active="tours" className="custom-class">
        <div>Content</div>
      </PageLayout>
    )
    
    const container = screen.getByTestId('app-header').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('shows sticky navigation when enabled', () => {
    render(
      <PageLayout 
        active="tours" 
        showStickyNavigation={true}
        stickyNavigationContent={<div data-testid="sticky-nav">Sticky Nav</div>}
      >
        <div>Content</div>
      </PageLayout>
    )
    
    expect(screen.getByTestId('sticky-nav')).toBeInTheDocument()
  })

  it('hides sticky navigation when disabled', () => {
    render(
      <PageLayout 
        active="tours" 
        showStickyNavigation={false}
        stickyNavigationContent={<div data-testid="sticky-nav">Sticky Nav</div>}
      >
        <div>Content</div>
      </PageLayout>
    )
    
    expect(screen.queryByTestId('sticky-nav')).not.toBeInTheDocument()
  })
})
