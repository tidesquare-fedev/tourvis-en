'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Shield, 
  Calendar,
  Save,
  X
} from 'lucide-react'
import { AdminSession } from '@/types/admin'

interface AdminAccount {
  id: string
  username: string
  role: 'admin' | 'super_admin'
  created_at: string
  updated_at: string
}

interface AccountManagementProps {
  currentAdmin: AdminSession
}

export function AccountManagement({ currentAdmin }: AccountManagementProps) {
  const [accounts, setAccounts] = useState<AdminAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<AdminAccount | null>(null)

  // 폼 데이터
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin'
  })

  // 계정 목록 조회
  const fetchAccounts = async () => {
    try {
      const response = await fetch('/en/api/admin/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      } else {
        console.error('계정 목록 조회 실패')
      }
    } catch (error) {
      console.error('계정 목록 조회 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 계정 생성
  const handleCreateAccount = async () => {
    try {
      const response = await fetch('/en/api/admin/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAccounts()
        setIsCreateDialogOpen(false)
        setFormData({ username: '', password: '', role: 'admin' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || '계정 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('계정 생성 오류:', error)
      alert('계정 생성 중 오류가 발생했습니다.')
    }
  }

  // 계정 수정
  const handleEditAccount = async () => {
    if (!editingAccount) return

    try {
      const response = await fetch(`/en/api/admin/accounts/${editingAccount.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAccounts()
        setIsEditDialogOpen(false)
        setEditingAccount(null)
        setFormData({ username: '', password: '', role: 'admin' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || '계정 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('계정 수정 오류:', error)
      alert('계정 수정 중 오류가 발생했습니다.')
    }
  }

  // 계정 삭제
  const handleDeleteAccount = async () => {
    if (!deletingAccount) return

    try {
      const response = await fetch(`/en/api/admin/accounts/${deletingAccount.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAccounts()
        setDeletingAccount(null)
      } else {
        const errorData = await response.json()
        alert(errorData.error || '계정 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('계정 삭제 오류:', error)
      alert('계정 삭제 중 오류가 발생했습니다.')
    }
  }

  // 편집 다이얼로그 열기
  const openEditDialog = (account: AdminAccount) => {
    setEditingAccount(account)
    setFormData({
      username: account.username,
      password: '',
      role: account.role
    })
    setIsEditDialogOpen(true)
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({ username: '', password: '', role: 'admin' })
    setEditingAccount(null)
  }

  // 컴포넌트 마운트 시 계정 목록 조회
  useEffect(() => {
    fetchAccounts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="destructive">Super Admin</Badge>
      case 'admin':
        return <Badge variant="secondary">Admin</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">계정 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">계정 관리</h2>
          <p className="text-gray-600">관리자 계정을 관리합니다.</p>
        </div>
        {currentAdmin.role === 'super_admin' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                계정 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 계정 추가</DialogTitle>
                <DialogDescription>
                  새로운 관리자 계정을 생성합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">사용자명</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="사용자명을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="비밀번호를 입력하세요 (최소 6자)"
                  />
                </div>
                <div>
                  <Label htmlFor="role">역할</Label>
                  <Select value={formData.role} onValueChange={(value: 'admin' | 'super_admin') => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleCreateAccount}>
                  <Save className="h-4 w-4 mr-2" />
                  생성
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 계정 목록 */}
      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    {account.role === 'super_admin' ? (
                      <Shield className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <User className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.username}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleBadge(account.role)}
                      {account.id === currentAdmin.id && (
                        <Badge variant="outline">현재 계정</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      생성: {formatDate(account.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(account)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>
                  {currentAdmin.role === 'super_admin' && account.id !== currentAdmin.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingAccount(account)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>계정 삭제 확인</AlertDialogTitle>
                          <AlertDialogDescription>
                            '{account.username}' 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>계정 수정</DialogTitle>
            <DialogDescription>
              계정 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">사용자명</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="사용자명을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="edit-password">비밀번호</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="새 비밀번호를 입력하세요 (변경하지 않으려면 비워두세요)"
              />
            </div>
            {currentAdmin.role === 'super_admin' && (
              <div>
                <Label htmlFor="edit-role">역할</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'super_admin') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditAccount}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
