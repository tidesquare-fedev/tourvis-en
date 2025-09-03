'use client'

interface TourErrorBoundaryProps {
  error?: string
}

export default function TourErrorBoundary({ error }: TourErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">투어 정보를 불러올 수 없습니다</h1>
        <p className="text-gray-600 mb-4">
          {error || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
