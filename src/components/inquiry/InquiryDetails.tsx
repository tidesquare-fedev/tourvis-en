'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { Inquiry, InquiryReplyWithAdmin } from '@/types/admin';

interface InquiryDetailsProps {
  inquiry: Inquiry;
  replies?: InquiryReplyWithAdmin[];
  isLoadingReplies?: boolean;
  showAdminInfo?: boolean;
}

export function InquiryDetails({
  inquiry,
  replies = [],
  isLoadingReplies = false,
  showAdminInfo = false,
}: InquiryDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      answered: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pending',
      answered: 'Answered',
      closed: 'Closed',
    };
    return texts[status as keyof typeof texts] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* 문의 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
            <Badge className={getStatusColor(inquiry.status)}>
              {getStatusText(inquiry.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                문의 번호
              </Label>
              <p className="text-sm text-gray-900 font-mono">{inquiry.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                카테고리
              </Label>
              <p className="text-sm text-gray-900">{inquiry.category}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                생성일
              </Label>
              <p className="text-sm text-gray-900">
                {formatDate(inquiry.created_at)}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                작성자
              </Label>
              <p className="text-sm text-gray-900">{inquiry.author}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">
              연락처 정보
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{inquiry.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{inquiry.email}</span>
              </div>
              {inquiry.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{inquiry.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">
              문의 내용
            </Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 답변 목록 */}
      {replies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              답변 목록 ({replies.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {replies.map(reply => (
                <div
                  key={reply.id}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      {showAdminInfo && reply.admin_users?.username
                        ? `관리자 답변 (${reply.admin_users.username})`
                        : '관리자 답변'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 답변 대기 중 */}
      {replies.length === 0 && inquiry.status === 'pending' && (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-sm text-yellow-700">
              관리자 답변을 기다리고 있습니다
            </p>
          </CardContent>
        </Card>
      )}

      {/* 로딩 중 */}
      {isLoadingReplies && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">답변을 불러오는 중...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
