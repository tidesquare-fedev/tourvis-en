'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotificationStore } from '@/store/notification-store';
import { InquiryApi } from '@/lib/api/inquiries';
import { validateEmail, validatePhone } from '@/lib/utils/api';

interface InquiryFormProps {
  onSuccess?: () => void;
}

const categories = [
  { value: 'reservation', label: '예약 문의' },
  { value: 'change', label: '변경/취소' },
  { value: 'refund', label: '환불 문의' },
  { value: 'product', label: '상품 문의' },
  { value: 'payment', label: '결제 문의' },
  { value: 'other', label: '기타' },
];

export function InquiryForm({ onSuccess }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { success, error } = useNotificationStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.author.trim()) {
      newErrors.author = '작성자명을 입력해주세요';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상이어야 합니다';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone =
        '올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)';
    }

    if (!formData.category) {
      newErrors.category = '문의 유형을 선택해주세요';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요';
    } else if (formData.subject.length < 5) {
      newErrors.subject = '제목은 5자 이상이어야 합니다';
    }

    if (!formData.message.trim()) {
      newErrors.message = '문의 내용을 입력해주세요';
    } else if (formData.message.length < 10) {
      newErrors.message = '문의 내용은 10자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await InquiryApi.createInquiry(formData);

      success(
        '문의가 성공적으로 제출되었습니다',
        '빠른 시일 내에 답변드리겠습니다.',
      );

      // 폼 초기화
      setFormData({
        author: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        message: '',
      });
      setErrors({});

      onSuccess?.();
    } catch (err) {
      error(
        '문의 제출 실패',
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1:1 문의하기</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">작성자명 *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={e => handleInputChange('author', e.target.value)}
                placeholder="작성자명을 입력하세요"
                className={errors.author ? 'border-red-500' : ''}
              />
              {errors.author && (
                <p className="text-sm text-red-500">{errors.author}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="이름을 입력하세요"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="이메일을 입력하세요"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">문의 유형 *</Label>
            <Select
              value={formData.category}
              onValueChange={value => handleInputChange('category', value)}
            >
              <SelectTrigger
                className={errors.category ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="문의 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">제목 *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={e => handleInputChange('subject', e.target.value)}
              placeholder="문의 제목을 입력하세요"
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">문의 내용 *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={e => handleInputChange('message', e.target.value)}
              placeholder="문의 내용을 자세히 입력하세요"
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? '제출 중...' : '문의 제출'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
