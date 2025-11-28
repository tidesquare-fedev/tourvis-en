'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { Inquiry } from '@/types/admin';

interface InquiryListProps {
  inquiries: Inquiry[];
  onInquirySelect: (inquiry: Inquiry) => void;
  selectedInquiryId?: string;
}

export function InquiryList({
  inquiries,
  onInquirySelect,
  selectedInquiryId,
}: InquiryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            대기 중
          </Badge>
        );
      case 'answered':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            답변 완료
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            종료
          </Badge>
        );
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">높음</Badge>;
      case 'medium':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            보통
          </Badge>
        );
      case 'low':
        return <Badge variant="outline">낮음</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || inquiry.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="문의 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">대기 중</SelectItem>
              <SelectItem value="answered">답변 완료</SelectItem>
              <SelectItem value="closed">종료</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="우선순위" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="high">높음</SelectItem>
              <SelectItem value="medium">보통</SelectItem>
              <SelectItem value="low">낮음</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredInquiries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">문의가 없습니다</div>
        ) : (
          filteredInquiries.map(inquiry => (
            <Card
              key={inquiry.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedInquiryId === inquiry.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : ''
              }`}
              onClick={() => onInquirySelect(inquiry)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(inquiry.status)}
                      <h3 className="font-medium text-sm truncate">
                        {inquiry.subject}
                      </h3>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      {inquiry.author} ({inquiry.name}) •{' '}
                      {formatDate(inquiry.created_at)}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {inquiry.message}
                    </p>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(inquiry.status)}
                      {getPriorityBadge(inquiry.priority)}
                      {inquiry.category && (
                        <Badge variant="outline" className="text-xs">
                          {inquiry.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
