'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut,
  RefreshCw,
  Bell,
  Search,
  Filter,
  X,
  User
} from 'lucide-react'
import { Inquiry, DashboardStats, AdminSession } from '@/types/admin'
import { InquiryList } from '@/components/admin/InquiryList'
import { InquiryDetail } from '@/components/admin/InquiryDetail'
import { RealtimeIndicator } from '@/components/admin/RealtimeIndicator'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { AccountManagement } from '@/components/admin/AccountManagement'
import { useRealtimeInquiries } from '@/hooks/useRealtimeInquiries'

function AdminDashboardContent() {
  const [admin, setAdmin] = useState<AdminSession | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState('inquiries')
  const [lastPendingCount, setLastPendingCount] = useState(0)
  const router = useRouter()
  
  // 실시간 문의 데이터
  const { inquiries, isConnected, refetch } = useRealtimeInquiries()

  // 관리자 인증 확인
  useEffect(() => {
    checkAuth()
  }, [])

  // 실시간 데이터 업데이트
  useEffect(() => {
    if (admin) {
      fetchDashboardData()
    }
  }, [admin])

  // 읽지 않은 문의가 있을 때 알림 표시 (중복 방지)
  useEffect(() => {
    if (admin && inquiries.length > 0) {
      const pendingCount = inquiries.filter(inquiry => inquiry.status === 'pending').length
      
      console.log('알림 체크:', { 
        totalInquiries: inquiries.length, 
        pendingCount, 
        lastPendingCount,
        inquiryStatuses: inquiries.map(i => ({ id: i.id, status: i.status }))
      })
      
      // pending 문의 수가 변경되었을 때만 알림 처리
      if (pendingCount !== lastPendingCount) {
        if (pendingCount > 0) {
          // 기존 읽지 않은 문의 알림 제거
          setNotifications(prev => prev.filter(n => 
            !n.message.includes('읽지 않은 문의가 있습니다')
          ))
          // 새 알림 추가
          addNotification(`${pendingCount}개의 읽지 않은 문의가 있습니다`)
        } else {
          // 읽지 않은 문의가 없으면 관련 알림 제거
          setNotifications(prev => prev.filter(n => 
            !n.message.includes('읽지 않은 문의가 있습니다')
          ))
        }
        setLastPendingCount(pendingCount)
      }
    } else if (admin && inquiries.length === 0) {
      // 문의가 없을 때도 알림 제거
      setNotifications(prev => prev.filter(n => 
        !n.message.includes('읽지 않은 문의가 있습니다')
      ))
      setLastPendingCount(0)
    }
  }, [inquiries, admin, lastPendingCount])

  // 자동 새로고침 기능
  useEffect(() => {
    if (!autoRefresh || !admin) return

    const interval = setInterval(() => {
      refetch()
      // 자동 새로고침에서는 알림을 추가하지 않음 (중복 방지)
    }, 15000) // 15초마다 새로고침

    return () => clearInterval(interval)
  }, [autoRefresh, admin, refetch])

  // 알림 추가 함수
  const addNotification = (message: string) => {
    const notification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString()
    }
    setNotifications(prev => [notification, ...prev].slice(0, 5))
  }

  // 알림 제거 함수
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/en/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
        // 로그인 성공 알림은 제거 (읽지 않은 문의가 있을 때만 알림 표시)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      // 통계 데이터 가져오기
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('데이터 가져오기 실패:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/en/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  const handleInquirySelect = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
  }

  const handleInquiryUpdate = (updatedInquiry: Inquiry) => {
    if (selectedInquiry?.id === updatedInquiry.id) {
      setSelectedInquiry(updatedInquiry)
    }
    // 문의 업데이트 알림은 제거 (읽지 않은 문의가 있을 때만 알림 표시)
  }

  // 필터링된 문의 목록
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || inquiry.category === filterType
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // 읽지 않은 문의 개수 (대기 중 상태)
  const unreadInquiriesCount = inquiries.filter(inquiry => inquiry.status === 'pending').length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">관리자 대시보드</h1>
            </div>
            <div className="flex items-center space-x-4">
              <RealtimeIndicator isConnected={isConnected} />
              
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                자동 새로고침 {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-gray-500" />
                  {unreadInquiriesCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadInquiriesCount}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-gray-700">
                {admin.username} ({admin.role})
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
          
          {/* 탭 네비게이션 */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inquiries'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                문의 관리
              </button>
              {admin.role === 'super_admin' && (
                <button
                  onClick={() => setActiveTab('accounts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'accounts'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  계정 관리
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inquiries' && (
          <>
            {/* 통계 카드 */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">전체 문의</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total_inquiries}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">대기 중</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pending_inquiries}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">답변 완료</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.answered_inquiries}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">오늘 문의</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.today_inquiries}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 검색 및 필터 */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="문의 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="product">상품 문의</SelectItem>
                        <SelectItem value="booking">예약 문의</SelectItem>
                        <SelectItem value="cancel">취소 문의</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="pending">대기 중</SelectItem>
                        <SelectItem value="answered">답변 완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 메인 콘텐츠 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 문의 목록 */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>문의 목록</span>
                      <Badge variant="secondary">{filteredInquiries.length}개</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {filteredInquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          onClick={() => handleInquirySelect(inquiry)}
                          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                            selectedInquiry?.id === inquiry.id ? 'bg-indigo-50 border-indigo-200' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {inquiry.subject}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {inquiry.name} ({inquiry.email})
                              </p>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge 
                                  variant={inquiry.status === 'pending' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {inquiry.status === 'pending' ? '대기 중' : '답변 완료'}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {new Date(inquiry.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 문의 상세 및 답변 */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div className="bg-white rounded-lg shadow">
                    {/* 문의 헤더 */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {selectedInquiry.subject}
                        </h2>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          selectedInquiry.status === 'pending' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {selectedInquiry.status === 'pending' ? '대기 중' : '답변 완료'}
                        </span>
                      </div>
                      
                      {/* 문의 정보 */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">문의 번호:</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">이름:</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">카테고리:</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">이메일:</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">생성일:</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedInquiry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">전화번호:</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* My Inquiry 섹션 */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center mb-4">
                        <User className="w-5 h-5 mr-2 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">문의 내용</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>
                    </div>

                    {/* Response 섹션 */}
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">답변 관리</h3>
                      </div>
                      <InquiryDetail 
                        inquiry={selectedInquiry}
                        onInquiryUpdate={handleInquiryUpdate}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-12">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>문의를 선택해주세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'accounts' && (
          <AccountManagement currentAdmin={admin} />
        )}
      </div>

      {/* 알림 토스트 */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.slice(0, 3).map(notification => (
            <div
              key={notification.id}
              className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 animate-slide-in-right"
            >
              <Bell className="w-5 h-5 text-indigo-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}