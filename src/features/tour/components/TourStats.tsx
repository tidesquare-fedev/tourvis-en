'use client';

import { Clock, MessageCircle, BadgeCheck, Smartphone } from 'lucide-react';

type TourStatsProps = {
  duration?: string;
  durationCode?: string;
  language?: string;
  languages?: string[];
  confirmHour?: string;
  voucherType?: string;
  productPolicies?: string[];
};

export function TourStats({
  duration,
  durationCode,
  language,
  languages,
  confirmHour,
  voucherType,
  productPolicies,
}: TourStatsProps) {
  const hasInstantConfirmation =
    (productPolicies || []).includes('INSTANT_CONFIRMATION') ||
    confirmHour === 'IN0H';
  const hasMobileVoucher = (voucherType || '') === 'M_VOUCHER';
  const languageList = Array.isArray(languages)
    ? languages.filter(Boolean)
    : [];
  const languageText = (() => {
    if (languageList.length === 0) return language || '';

    // 언어 코드를 사용자 친화적인 이름으로 변환
    const languageMap: Record<string, string> = {
      ENGLISH: 'English',
      KOREAN: 'Korean',
      JAPANESE: 'Japanese',
      CHINESE: 'Chinese',
      SPANISH: 'Spanish',
      FRENCH: 'French',
      GERMAN: 'German',
      ITALIAN: 'Italian',
      PORTUGUESE: 'Portuguese',
      RUSSIAN: 'Russian',
      ETC: 'Korean', // ETC는 보통 한국어를 의미
    };

    const friendlyLanguages = languageList.map(
      lang => languageMap[lang] || lang,
    );
    return friendlyLanguages.join(', ');
  })();
  const durationText = (() => {
    if (duration && duration.trim()) return duration;
    if (typeof durationCode === 'string') {
      const number = durationCode.replace(/[^0-9]/g, '');
      if (durationCode.startsWith('IN')) {
        if (durationCode.endsWith('H') && number) return `${number}시간`;
        if (durationCode.endsWith('D') && number) return `${number}일`;
      }
      if (durationCode.startsWith('OV')) {
        if (durationCode.endsWith('H') && number) return `${number}시간 이상`;
        if (durationCode.endsWith('D') && number) return `${number}일 이상`;
      }
    }
    return '';
  })();

  const confirmLabel = (() => {
    if (
      (productPolicies || []).includes('INSTANT_CONFIRMATION') ||
      confirmHour === 'IN0H'
    ) {
      return '즉시 확인';
    }
    if (typeof confirmHour === 'string' && confirmHour.startsWith('IN')) {
      const number = confirmHour.replace(/[^0-9]/g, '');
      if (confirmHour.endsWith('H') && number) return `${number}시간 내 확인`;
      if (confirmHour.endsWith('D') && number) return `${number}일 내 확인`;
    }
    return '';
  })();

  const voucherLabel = (() => {
    if (!voucherType) return '';
    if (voucherType === 'M_VOUCHER') return '모바일 바우처';
    if (voucherType === 'P_VOUCHER') return '인쇄 바우처';
    // Fallback: humanize code like OTHER_VOUCHER -> Other voucher
    const humanized = voucherType
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return humanized;
  })();
  return (
    <div className="mb-6 min-w-0">
      <div className="mt-4 sm:mt-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {!!durationText && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-[16px] text-gray-900">소요시간</div>
                <div className="text-[14px] text-gray-700">{durationText}</div>
              </div>
            </div>
          )}
          {!!languageText && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-[16px] text-gray-900">언어</div>
                <div className="text-[14px] text-gray-700">{languageText}</div>
              </div>
            </div>
          )}
          {!!confirmLabel && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <BadgeCheck className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-[16px] text-gray-900">확인</div>
                <div className="text-[14px] text-gray-700">{confirmLabel}</div>
              </div>
            </div>
          )}
          {!!voucherLabel && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-[16px] text-gray-900">바우처</div>
                <div className="text-[14px] text-gray-700">{voucherLabel}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
