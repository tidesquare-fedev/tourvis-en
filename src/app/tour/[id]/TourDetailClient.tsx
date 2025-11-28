'use client';

import { LayoutProvider } from '@/components/layout/LayoutProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useTourDetailState } from '@/features/tour/hooks/useTourDetailState';
import { TourOption } from '@/types/tour';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Check,
  X,
  MapPin,
  AlertTriangle,
  Package,
  XCircle,
  Info,
  ChevronRight,
  Clock,
  ChevronUp,
  ChevronDown,
  Users,
} from 'lucide-react';
import { TourImageGallery } from '@/features/tour/components/TourImageGallery';
import { TourHeader } from '@/features/tour/components/TourHeader';
import { TourStats } from '@/features/tour/components/TourStats';
import { TourHighlights } from '@/features/tour/components/TourHighlights';
import { TourSectionTabs } from '@/features/tour/components/TourSectionTabs';
import { TourDatePicker } from '@/features/tour/components/TourDatePicker';
import { TourOptions } from '@/features/tour/components/TourOptions';
import { TourDescription } from '@/features/tour/components/TourDescription';
import { TourReviews } from '@/features/tour/components/TourReviews';
import { TourBookingCard } from '@/features/tour/components/TourBookingCard';
import { TopReviewsCarousel } from '@/features/tour/components/TopReviewsCarousel';
import { TourHeroSection } from '@/features/tour/components/TourHeroSection';
import { TourUsageGuide } from '@/features/tour/components/TourUsageGuide';
import { ImportantInformation } from '@/features/tour/components/ImportantInformation';
import { IncludedExcluded } from '@/features/tour/components/IncludedExcluded';
import { TourApiResponse } from '@/types/tour';
import { useReviews } from '@/hooks/useReviewApi';
import { useTnaOptions } from '@/hooks/useTnaOptions';
import { CancellationPolicy } from '@/features/tour/components/CancellationPolicy';
import { StickyBox } from '@/components/shared/StickyBox';
// 옵션/가격 조회는 클라이언트→Next API 프록시를 통해 서버에서 토큰으로 호출

interface TourDetailClientProps {
  tourData: TourApiResponse;
  tourId: string;
}

export default function TourDetailClient({
  tourData,
  tourId,
}: TourDetailClientProps) {
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/en';
  const router = useRouter();
  const { toast } = useToast();

  const optionsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const usageGuideRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const cancellationRef = useRef<HTMLDivElement>(null);
  const informationRef = useRef<HTMLDivElement>(null);
  const includedRef = useRef<HTMLDivElement>(null);
  // Sections for intersection observing (tabs auto-highlight)
  const sectionsForObserver = useMemo(
    () => [
      { id: 'options', label: 'Options', ref: optionsRef },
      { id: 'description', label: 'Description', ref: descriptionRef },
      { id: 'usage-guide', label: 'Itinerary', ref: usageGuideRef },
      { id: 'information', label: 'Information', ref: informationRef },
      { id: 'included', label: 'Included', ref: includedRef },
      { id: 'reviews', label: 'Reviews', ref: reviewsRef },
      { id: 'cancellation', label: 'Cancellation', ref: cancellationRef },
    ],
    [],
  );

  const [isMeetingPointExpanded, setIsMeetingPointExpanded] = useState(false);
  const [initialItineraryList, setInitialItineraryList] = useState<
    Array<{
      day: number;
      title: string;
      description: string;
      duration: string;
      activities: string[];
    }>
  >([]);

  // Meeting Point 내용을 간결하게 요약하는 함수
  const getMeetingPointSummary = (content: string) => {
    // HTML 태그 제거
    const textContent = content.replace(/<[^>]*>/g, '');
    // 첫 번째 문장이나 200자까지만 표시
    const firstSentence = textContent.split('.')[0];
    if (firstSentence.length <= 200) {
      return (
        firstSentence + (textContent.length > firstSentence.length ? '...' : '')
      );
    }
    return textContent.substring(0, 200) + '...';
  };

  // 지역명 조합: areas[0].name + (parent.name || parent.parent.name)
  const composeLocation = (areas: unknown): string => {
    try {
      const list = Array.isArray(areas) ? areas : [];
      if (list.length === 0) return '';
      const first: any = list[0];
      const cityName = String(first?.name || '');
      let parentName = '';
      if (first?.parent && typeof first.parent === 'object') {
        parentName = String((first.parent as any)?.name || '');
        if (!parentName && (first.parent as any)?.parent) {
          parentName = String(
            ((first.parent as any).parent as any)?.name || '',
          );
        }
      }
      return parentName ? `${cityName}, ${parentName}` : cityName;
    } catch (_err) {
      return '';
    }
  };

  // Mock tour data - 실제로는 API에서 가져올 데이터
  const tour = {
    id: tourId,
    title: tourData.basic.name,
    subtitle: tourData.basic.sub_name,
    location: composeLocation((tourData.basic as any)?.areas) || ' ',
    rating: 4.8,
    reviewCount: 1247,
    images: tourData.basic.images,
    // 대표 가격: display_price 우선
    price: tourData.basic.display_price?.price2 ?? tourData.basic.price,
    originalPrice:
      tourData.basic.display_price?.price1 ?? tourData.basic.originalPrice,
    discountRate:
      tourData.basic.display_price?.dc_rate ?? tourData.basic.discountRate,
    currency: tourData.basic.currency,
    duration: `${tourData.basic.duration}분`,
    durationUnit: tourData.basic.duration_unit,
    language: '한국어, 영어',
    meetingPoint:
      tourData.detail.additional_fields?.find(
        field => field.key === 'meetingPoint',
      )?.content || tourData.basic.meeting_point,
    meetingPointAddress: tourData.basic.meeting_point_address,
    meetingPointLatitude: tourData.basic.meeting_point_latitude,
    meetingPointLongitude: tourData.basic.meeting_point_longitude,
    meetingPointDescription: tourData.basic.meeting_point_description,
    meetingPointImage: tourData.basic.meeting_point_image,
    cancellationPolicy: tourData.basic.cancellation_policy,
    cancellationHours: tourData.basic.cancellation_hours,
    cancellationDescription: tourData.basic.cancellation_description,
    instantConfirmation: tourData.basic.instant_confirmation,
    mobileVoucher: tourData.basic.mobile_voucher,
    printVoucher: tourData.basic.print_voucher,
    languages: tourData.basic.languages,
    included: tourData.basic.included,
    excluded: tourData.basic.excluded,
    bringItems: tourData.basic.bring_items,
    notAllowed: tourData.basic.not_allowed,
    notSuitable: tourData.basic.not_suitable,
    additionalInfo: tourData.basic.additional_info,
    description: tourData.detail.description,
    highlights: tourData.detail.highlights,
    itinerary: tourData.detail.itinerary,
    additionalFields: tourData.detail.additional_fields,
    reviews: tourData.basic.reviews,
    availableDates: tourData.basic.available_dates,
    timeslots: tourData.basic.timeslots,
  };

  // Section refs for navigation

  // sections and visibility lists are defined after helper fns

  // Build sections after lists are available
  const hasDescription = Boolean(tourData.detail.description);

  // Use custom hook for state management (initialize with empty; will update via effect)
  const {
    selectedDate,
    quantity,
    activeSection,
    showFullDescription,
    showAllReviews,
    infoModal,
    scrollToSection,
    handleQuantityChange,
    setSelectedDate,
  } = useTourDetailState(sectionsForObserver as any);

  // Reviews: use unified hook (React Query)
  const {
    reviews: fetchedReviews,
    totalCount: reviewTotalCount,
    isLoading: isLoadingReviews,
  } = useReviews(tourId);
  const [reviewPage, setReviewPage] = useState(1);
  const pagedReviews = fetchedReviews.slice(
    (reviewPage - 1) * 10,
    (reviewPage - 1) * 10 + 10,
  );

  const goToReviewPage = async (p: number) => {
    if (p < 1) return;
    setReviewPage(p);
  };

  const handleBooking = () => {
    if (quantity < 1) {
      toast({
        title: 'Quantity Required',
        description: 'Please select at least 1 participant to continue.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const participants = Object.values(selectedLabelQtyByOption).reduce(
        (t, m) =>
          t + Object.values(m || {}).reduce((s, n) => s + Number(n || 0), 0),
        0,
      );
      const payload = {
        tourId,
        title: tour.title,
        image: Array.isArray(tour.images) ? tour.images[0] || '' : '',
        date: selectedDate ? selectedDate.toISOString() : undefined,
        quantity: participants,
        optionTitle: String(
          (selectedOptionObj as any)?.title ||
            (selectedOptionObj as any)?.name ||
            '',
        ),
        timeslotTitle: String(
          (selectedTimeslotObj as any)?.title ||
            (selectedTimeslotObj as any)?.name ||
            '',
        ),
        totalAmount: totalPrice,
        currency: 'USD',
        selections: bookingSelections,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedProduct', JSON.stringify(payload));
      }
    } catch {}
    router.push(
      `/booking-info?tour=${tourId}&date=${selectedDate?.toISOString()}&quantity=${quantity}`,
    );
  };

  const STAR_COLOR = '#ff00cc';

  const maskName = (fullName: string): string => {
    if (!fullName || typeof fullName !== 'string') return '';
    const maskPart = (part: string) =>
      part.length <= 1
        ? part
        : part[0] + '*'.repeat(Math.max(1, part.length - 1));
    return fullName
      .split(' ')
      .map(segment => segment.split('-').map(maskPart).join('-'))
      .join(' ');
  };

  // Helpers to derive UI-friendly data from API response
  const splitToList = (raw: unknown): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .map(v =>
          String(v ?? '')
            .replace(/<[^>]*>/g, '')
            .trim(),
        )
        .filter(Boolean);
    }
    const s = typeof raw === 'string' ? raw : '';
    if (!s) return [];
    return s
      .split(/<li[^>]*>|<br\s*\/?|\n|\r/gi)
      .map(t => t.replace(/<[^>]*>/g, '').trim())
      .filter(Boolean);
  };

  const deriveIncluded = (): string[] => {
    if (
      Array.isArray(tourData.basic.included) &&
      tourData.basic.included.length > 0
    )
      return tourData.basic.included;
    const fromDetail = (tourData as any)?.detail?.includes;
    return splitToList(fromDetail);
  };

  const deriveExcluded = (): string[] => {
    if (
      Array.isArray(tourData.basic.excluded) &&
      tourData.basic.excluded.length > 0
    )
      return tourData.basic.excluded;
    const fromDetail = (tourData as any)?.detail?.excludes;
    return splitToList(fromDetail);
  };

  const deriveBeforeTravel = (): string[] => {
    const fields: any[] = Array.isArray(tourData.detail.additional_fields)
      ? tourData.detail.additional_fields
      : [];
    const candidates: string[] = [];
    for (const f of fields) {
      const key = String(f?.key || '').toLowerCase();
      const title = String(f?.title || '').toLowerCase();
      if (
        /(before|travel|주의|안내|important|note)/i.test(key) ||
        /(before|travel|주의|안내|important|note)/i.test(title)
      ) {
        candidates.push(...splitToList(f?.content));
      }
    }
    const extra = splitToList(tourData.detail.additional_info);
    return [...candidates, ...extra];
  };
  const beforeTravelHtml = String(tourData.detail.additional_info || '');

  const deriveBringItems = (): string[] => {
    const fromBasic = (() => {
      const raw = (tourData as any)?.basic?.bring_items;
      if (Array.isArray(raw))
        return raw.map((s: any) => String(s || '').trim()).filter(Boolean);
      return splitToList(raw);
    })();
    const fields: any[] = Array.isArray(tourData.detail.additional_fields)
      ? tourData.detail.additional_fields
      : [];
    const fromFields: string[] = [];
    for (const f of fields) {
      const key = String(f?.key || '').toLowerCase();
      const title = String(f?.title || '').toLowerCase();
      if (
        /(bring|준비|준비물)/i.test(key) ||
        /(bring|준비|준비물)/i.test(title)
      ) {
        fromFields.push(...splitToList(f?.content));
      }
    }
    return [...fromBasic, ...fromFields];
  };

  const deriveNotAllowed = (): string[] => {
    const fromBasic = (() => {
      const raw = (tourData as any)?.basic?.not_allowed;
      if (Array.isArray(raw))
        return raw.map((s: any) => String(s || '').trim()).filter(Boolean);
      return splitToList(raw);
    })();
    const fields: any[] = Array.isArray(tourData.detail.additional_fields)
      ? tourData.detail.additional_fields
      : [];
    const fromFields: string[] = [];
    for (const f of fields) {
      const key = String(f?.key || '').toLowerCase();
      const title = String(f?.title || '').toLowerCase();
      if (
        /(not\s*allowed|금지|허용되지)/i.test(key) ||
        /(not\s*allowed|금지|허용되지)/i.test(title)
      ) {
        fromFields.push(...splitToList(f?.content));
      }
    }
    return [...fromBasic, ...fromFields];
  };

  const deriveNotSuitable = (): string[] => {
    const fromBasic = (() => {
      const raw = (tourData as any)?.basic?.not_suitable;
      if (Array.isArray(raw))
        return raw.map((s: any) => String(s || '').trim()).filter(Boolean);
      return splitToList(raw);
    })();
    const fields: any[] = Array.isArray(tourData.detail.additional_fields)
      ? tourData.detail.additional_fields
      : [];
    const fromFields: string[] = [];
    for (const f of fields) {
      const key = String(f?.key || '').toLowerCase();
      const title = String(f?.title || '').toLowerCase();
      if (
        /(not\s*suitable|참가가\s*어려워|부적합)/i.test(key) ||
        /(not\s*suitable|참가가\s*어려워|부적합)/i.test(title)
      ) {
        fromFields.push(...splitToList(f?.content));
      }
    }
    return [...fromBasic, ...fromFields];
  };

  const deriveItineraryFromCourses = (): Array<{
    day: number;
    title: string;
    description: string;
    duration: string;
    activities: string[];
  }> => {
    const groups: any[] = Array.isArray((tourData as any)?.course_groups)
      ? (tourData as any).course_groups
      : [];
    const list: Array<{
      day: number;
      title: string;
      description: string;
      duration: string;
      activities: string[];
    }> = [];
    if (groups.length > 0) {
      let day = 1;
      for (const g of groups) {
        const itemsRaw: any[] = Array.isArray(g?.courses)
          ? g.courses
          : Array.isArray(g?.items)
            ? g.items
            : [];
        const items: any[] =
          Array.isArray(itemsRaw) &&
          itemsRaw.length > 0 &&
          Array.isArray(itemsRaw[0])
            ? (itemsRaw as any[]).flat()
            : itemsRaw;
        for (const it of items) {
          const title = String(it?.title || it?.name || `Course ${day}`);
          const description = String(
            it?.description || it?.content || it?.desc || '',
          );
          const duration = String(it?.duration || it?.time || '');
          const activities = Array.isArray(it?.activities)
            ? it.activities.map((a: any) => String(a))
            : [];
          list.push({ day, title, description, duration, activities });
          day += 1;
        }
      }
      return list;
    }
    // Fallback to detail.itinerary if no course_groups
    const fallback: any[] = Array.isArray(tourData.detail.itinerary)
      ? tourData.detail.itinerary
      : [];
    return fallback as any;
  };

  // initialize itinerary list after helper is available
  useEffect(() => {
    setInitialItineraryList(deriveItineraryFromCourses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourData]);

  // 옵션 및 가격 로딩 상태
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [optionData, setOptionData] = useState<any | null>(null);
  const [optionPriceMap, setOptionPriceMap] = useState<Record<string, number>>(
    {},
  );
  const [labelPriceMap, setLabelPriceMap] = useState<
    Record<string, Record<string, number>>
  >({});
  const [selectedOptionCode, setSelectedOptionCode] = useState<string>('');
  const [selectedLabelId, setSelectedLabelId] = useState<string | undefined>(
    undefined,
  );
  const [selectedTimeslotId, setSelectedTimeslotId] = useState<
    string | undefined
  >(undefined);
  const [timeslotByOption, setTimeslotByOption] = useState<
    Record<string, { id: string; title: string }>
  >({});
  // label quantities per option: { [optionCode]: { [labelCode]: qty } }
  const [selectedLabelQtyByOption, setSelectedLabelQtyByOption] = useState<
    Record<string, Record<string, number>>
  >({});
  // 동적 가격 조회 중인 옵션 ID
  const [loadingDynamicPrice, setLoadingDynamicPrice] = useState<string | null>(
    null,
  );
  const previousPrices = useRef<Record<string, number>>({});
  const isDateType = useMemo(
    () => String(tourData.basic.calendar_type).toUpperCase() === 'DATE',
    [tourData.basic.calendar_type],
  );

  // 옵션/가격 API 접근을 훅으로 일원화
  const {
    optionsQuery,
    priceDateType,
    pricePeriodType,
    dynamicPrice,
    startStr,
    endStr,
    isDateType: _hookDateType,
    createRequestPayload,
    createDynamicPricePayload,
    fetchDynamicPrice,
  } = useTnaOptions(tourId, {
    calendarType: isDateType ? 'DATE' : 'PERIOD',
    selectedDate,
    range,
  });
  useEffect(() => {
    setOptionData(optionsQuery.data ?? null);
    if (optionsQuery.data) {
      const options = optionsQuery.data?.options || [];
      if (Array.isArray(options)) {
        options.forEach((option: any) => {
          // 옵션 정보 처리 (콘솔 로그 제거)
        });
      }
    }
  }, [optionsQuery.data]);

  // optionPriceMap 변경 시 처리
  useEffect(() => {
    // optionPriceMap 업데이트 처리 (콘솔 로그 제거)
  }, [optionPriceMap]);

  // 옵션 가격 일괄 조회 (dynamic_price 이거나 라벨에 price가 없을 때만)
  useEffect(() => {
    const run = async () => {
      const optsSource = optionData as any;
      const opts: any[] = Array.isArray(optsSource?.options)
        ? optsSource.options
        : Array.isArray(optsSource)
          ? optsSource
          : Array.isArray(optsSource?.list)
            ? optsSource.list
            : [];
      if (opts.length === 0) return;
      const start = isDateType
        ? selectedDate
          ? format(selectedDate, 'yyyy-MM-dd')
          : undefined
        : range.from
          ? format(range.from, 'yyyy-MM-dd')
          : undefined;
      const end = isDateType
        ? selectedDate
          ? format(selectedDate, 'yyyy-MM-dd')
          : undefined
        : range.to
          ? format(range.to, 'yyyy-MM-dd')
          : start;
      if (!start || !end) return;
      // bulk 가격 조회: 라벨 가격 사전 확보 목적 (회차 필요 없는 엔드포인트 대응)
      try {
        const needPricing = opts.filter(o => {
          const hasLabelPrices =
            Array.isArray(o.labels) &&
            o.labels.some(
              (l: any) => typeof l?.price === 'number' && l.price > 0,
            );
          return o.dynamic_price === true || !hasLabelPrices;
        });
        const entries = await Promise.all(
          needPricing.map(async o => {
            const code = String(
              o.code || o.product_option_code || o.option_code || o.id || '',
            );
            if (!code) return [code, 0] as const;
            const payload: any = {
              product_option_code: code,
              start_date: start,
              end_date: end,
            };
            const json = isDateType
              ? await priceDateType.mutateAsync(payload)
              : await pricePeriodType.mutateAsync(payload);
            // update label prices if present
            try {
              const pricesArray: any[] = Array.isArray(
                (json as any)?.data?.prices,
              )
                ? (json as any).data.prices
                : Array.isArray((json as any)?.data?.dates)
                  ? (json as any).data.dates[0]?.prices ?? []
                  : Array.isArray((json as any)?.dates)
                    ? (json as any).dates?.[0]?.prices ?? []
                    : [];
              if (Array.isArray(pricesArray) && pricesArray.length > 0) {
                setLabelPriceMap(prev => ({
                  ...prev,
                  [code]: pricesArray.reduce(
                    (acc: Record<string, number>, p: any) => {
                      const k = String(
                        p?.label_code || p?.labelId || p?.label || '',
                      ).toUpperCase();
                      const v = Number(p?.price ?? 0) || 0;
                      if (k) acc[k] = v;
                      return acc;
                    },
                    { ...(prev[code] || {}) },
                  ),
                }));
              }
            } catch {}
            const price = (json as any)?.success
              ? Number(
                  (json as any)?.data?.price ??
                    (json as any)?.data?.sale_price ??
                    (json as any)?.data?.amount ??
                    0,
                )
              : 0;
            return [code, price] as const;
          }),
        );
        const map: Record<string, number> = {};
        entries.forEach(([k, v]) => {
          if (k) map[k] = v;
        });
        setOptionPriceMap(map);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[price bulk error]', e);
        }
      }
    };
    run();
  }, [optionData, isDateType, selectedDate, range, tourId]);

  // 동적 가격 조회 함수 (수량 변경 시 호출)
  const handleDynamicPriceFetch = async (
    option: any,
    timeslot: any,
    count: number,
  ) => {
    if (!option || !timeslot || !selectedDate) {
      setLoadingDynamicPrice(null);
      return;
    }

    // 로딩 상태는 이미 설정되어 있음 (수량 변경 시 설정됨)

    try {
      // 요청 payload 생성 (선택된 라벨 ID 전달)
      const requestPayload = createRequestPayload(
        option,
        timeslot,
        count,
        selectedLabelId,
      );

      // 동적 가격 조회 (선택된 라벨 ID 전달)
      const result = await fetchDynamicPrice(
        option,
        timeslot,
        count,
        selectedLabelId,
      );

      if (result?.price) {
        // 가격 정보 업데이트 - 동적 가격 결과의 price 사용
        setOptionPriceMap(prev => {
          const newMap = { ...prev, [option.id]: result.price };
          return newMap;
        });

        // 라벨별 가격 정보 업데이트
        if (result.labels) {
          const labelPrices = result.labels.reduce(
            (acc: Record<string, number>, label: any) => {
              if (label.id && label.unit_price) {
                acc[label.id] = label.unit_price;
              }
              return acc;
            },
            {},
          );
          setLabelPriceMap(prev => ({
            ...prev,
            [option.id]: { ...(prev[option.id] || {}), ...labelPrices },
          }));
        }
      }
    } catch (error) {
      // 에러 처리 (콘솔 로그 제거)
    } finally {
      // 로딩 상태 종료
      setLoadingDynamicPrice(null);
    }
  };

  // 옵션 클릭 시 단건 가격 조회 및 반영
  useEffect(() => {
    const run = async () => {
      if (!selectedOptionCode) return;
      // 선택 완료 가드: 인벤토리 스코프에 따라 필요한 선택(라벨/회차)이 완료된 뒤에만 가격 조회
      const needTimeslot =
        /TIMESLOT/i.test(String(tourData.basic.inventory_scope)) ||
        tourData.basic.timeslot_is === true;
      const needLabel = /LABEL/i.test(String(tourData.basic.inventory_scope));
      if (needTimeslot && !selectedTimeslotId) return;
      if (needLabel && !selectedLabelId) return;
      const start = isDateType
        ? selectedDate
          ? format(selectedDate, 'yyyy-MM-dd')
          : undefined
        : range.from
          ? format(range.from, 'yyyy-MM-dd')
          : undefined;
      const end = isDateType
        ? selectedDate
          ? format(selectedDate, 'yyyy-MM-dd')
          : undefined
        : range.to
          ? format(range.to, 'yyyy-MM-dd')
          : start;
      if (!start || !end) return;
      const priceCall = isDateType
        ? priceDateType.mutateAsync
        : pricePeriodType.mutateAsync;
      try {
        const payload: any = {
          product_option_code: selectedOptionCode,
          start_date: start,
          end_date: end,
        };
        // 회차/라벨은 날짜형 엔드포인트에서는 불필요할 수 있으므로 제외하여 404 회피
        const json = await priceCall(payload);
        // update label prices from single response if available
        try {
          const pricesArray: any[] = Array.isArray((json as any)?.data?.prices)
            ? (json as any).data.prices
            : Array.isArray((json as any)?.data?.dates)
              ? (json as any).data.dates[0]?.prices ?? []
              : Array.isArray((json as any)?.dates)
                ? (json as any).dates?.[0]?.prices ?? []
                : [];
          if (Array.isArray(pricesArray) && pricesArray.length > 0) {
            setLabelPriceMap(prev => ({
              ...prev,
              [selectedOptionCode]: pricesArray.reduce(
                (acc: Record<string, number>, p: any) => {
                  const k = String(
                    p?.label_code || p?.labelId || p?.label || '',
                  ).toUpperCase();
                  const v = Number(p?.price ?? 0) || 0;
                  if (k) acc[k] = v;
                  return acc;
                },
                { ...(prev[selectedOptionCode] || {}) },
              ),
            }));
          }
        } catch {}
        const price = (json as any)?.success
          ? Number(
              (json as any)?.data?.price ??
                (json as any)?.data?.sale_price ??
                (json as any)?.data?.amount ??
                0,
            )
          : 0;
        setOptionPriceMap(prev => ({ ...prev, [selectedOptionCode]: price }));
      } catch (e) {
        console.error('[price single error]', e);
      }
    };
    run();
  }, [
    selectedOptionCode,
    selectedLabelId,
    selectedTimeslotId,
    isDateType,
    selectedDate,
    range,
    tourId,
  ]);

  // 선택된 옵션/라벨/회차 객체 및 가격/제목 도출
  const currentOptionList: any[] = useMemo(() => {
    const src: any = optionData;
    if (Array.isArray(src?.options)) return src.options;
    if (Array.isArray(src)) return src;
    if (Array.isArray(src?.list)) return src.list;
    return [];
  }, [optionData]);

  const selectedOptionObj: any | undefined = useMemo(() => {
    if (!selectedOptionCode) return undefined;
    return currentOptionList.find(
      (o: any) =>
        String(
          o.code || o.product_option_code || o.option_code || o.id || '',
        ) === selectedOptionCode,
    );
  }, [currentOptionList, selectedOptionCode]);

  const selectedLabelObj: any | undefined = useMemo(() => {
    if (!selectedOptionObj || !selectedLabelId) return undefined;
    const labels = Array.isArray(selectedOptionObj.labels)
      ? selectedOptionObj.labels
      : [];
    return labels.find(
      (l: any) => String(l.code || l.id || '') === String(selectedLabelId),
    );
  }, [selectedOptionObj, selectedLabelId]);

  const selectedTimeslotObj: any | undefined = useMemo(() => {
    if (!selectedOptionObj || !selectedTimeslotId) return undefined;
    const times = Array.isArray(selectedOptionObj.timeslots)
      ? selectedOptionObj.timeslots
      : [];
    return times.find(
      (t: any) => String(t.id || t.code || '') === String(selectedTimeslotId),
    );
  }, [selectedOptionObj, selectedTimeslotId]);

  const getTimeslotTitleFromOptions = (
    optionCode: string,
    tsId?: string,
  ): string | undefined => {
    try {
      const opt = currentOptionList.find(
        (o: any) =>
          String(
            o.code || o.product_option_code || o.option_code || o.id || '',
          ) === String(optionCode),
      );
      const times: any[] = Array.isArray((opt as any)?.timeslots)
        ? (opt as any).timeslots
        : [];
      const t = times.find(
        (tt: any) => String(tt.id || tt.code || '') === String(tsId),
      );
      if (t) return String(t.title || t.name || t.code || '');
    } catch {}
    return undefined;
  };

  const selectedUnitPrice = useMemo(() => 0, []);

  // 시간/라벨/옵션 선택 시 기본 수량 1로 설정 (처음 선택 시)
  useEffect(() => {
    if (
      (selectedTimeslotId || selectedLabelId || selectedOptionCode) &&
      quantity < 1
    ) {
      handleQuantityChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeslotId, selectedLabelId, selectedOptionCode]);

  // 수량 변경 시 동적 가격 조회
  useEffect(() => {
    if (selectedOptionCode && selectedTimeslotId && quantity > 0) {
      // 선택된 옵션과 타임슬롯 정보 찾기
      const selectedOption = optionData?.options?.find(
        (o: any) =>
          o.id === selectedOptionCode || o.code === selectedOptionCode,
      );
      const selectedTimeslot = selectedOption?.timeslots?.find(
        (t: any) => t.id === selectedTimeslotId,
      );

      if (
        selectedOption &&
        selectedTimeslot &&
        selectedOption.dynamic_price === true
      ) {
        // 이전 가격을 백업하여 로딩 중에도 표시
        const previousPrice =
          optionPriceMap[selectedOption.id] ||
          optionPriceMap[selectedOption.code];
        if (previousPrice) {
          previousPrices.current[selectedOption.id] = previousPrice;
        }

        // 약간의 지연 후 로딩 상태 설정 (깜빡임 방지)
        setTimeout(() => {
          setLoadingDynamicPrice(selectedOption.id);
        }, 50);

        handleDynamicPriceFetch(selectedOption, selectedTimeslot, quantity);
      } else if (selectedOption && selectedTimeslot) {
        // 동적 가격이 아닌 옵션 처리 (콘솔 로그 제거)
      }
    }
  }, [
    quantity,
    selectedOptionCode,
    selectedTimeslotId,
    selectedLabelId,
    optionData,
  ]);

  // 옵션 변경 시 이전 선택(라벨/회차) 초기화
  useEffect(() => {
    setSelectedLabelId(undefined);
    setSelectedTimeslotId(undefined);
  }, [selectedOptionCode]);

  // total price: sum across all selected options (label quantities × label price)
  const totalPrice = useMemo(() => {
    let total = 0;
    const getLabelUnitPrice = (optCode: string, labelCode: string): number => {
      const upper = String(labelCode).toUpperCase();
      const fromMap = Number(labelPriceMap[optCode]?.[upper] ?? 0);
      if (fromMap > 0) return fromMap;
      // fallback to optionData labels price/net_price_currency
      try {
        const src: any = optionData;
        const list: any[] = Array.isArray(src?.options)
          ? src.options
          : Array.isArray(src)
            ? src
            : Array.isArray(src?.list)
              ? src.list
              : [];
        const opt = list.find(
          (o: any) =>
            String(
              o.code || o.product_option_code || o.option_code || o.id || '',
            ).toUpperCase() === String(optCode).toUpperCase(),
        );
        const labels: any[] = Array.isArray(opt?.labels) ? opt.labels : [];
        const lab = labels.find(
          (lb: any) => String(lb?.code || lb?.id || '').toUpperCase() === upper,
        );
        if (lab) {
          if (typeof lab?.price === 'number') return Number(lab.price);
          if (typeof lab?.net_price_currency === 'number')
            return Number(lab.net_price_currency);
        }
      } catch {}
      return 0;
    };
    Object.entries(selectedLabelQtyByOption).forEach(([optCode, qtyMap]) => {
      Object.entries(qtyMap || {}).forEach(([lCode, qty]) => {
        const unit = getLabelUnitPrice(optCode, lCode);
        total += Number(qty || 0) * unit;
      });
    });
    return total;
  }, [selectedLabelQtyByOption, labelPriceMap]);

  const bookingSelections = useMemo(() => {
    const selections: Array<{
      optionTitle: string;
      timeslotTitle?: string;
      lines: Array<{ label: string; qty: number; unit: number }>;
      subtotal: number;
      isLoading?: boolean;
    }> = [];
    const getLabelUnitPrice = (optCode: string, labelCode: string): number => {
      const upper = String(labelCode).toUpperCase();
      const fromMap = Number(labelPriceMap[optCode]?.[upper] ?? 0);
      if (fromMap > 0) return fromMap;
      try {
        const src: any = optionData;
        const list: any[] = Array.isArray(src?.options)
          ? src.options
          : Array.isArray(src)
            ? src
            : Array.isArray(src?.list)
              ? src.list
              : [];
        const opt = list.find(
          (o: any) =>
            String(
              o.code || o.product_option_code || o.option_code || o.id || '',
            ).toUpperCase() === String(optCode).toUpperCase(),
        );
        const labels: any[] = Array.isArray(opt?.labels) ? opt.labels : [];
        const lab = labels.find(
          (lb: any) => String(lb?.code || lb?.id || '').toUpperCase() === upper,
        );
        if (lab) {
          if (typeof lab?.price === 'number') return Number(lab.price);
          if (typeof lab?.net_price_currency === 'number')
            return Number(lab.net_price_currency);
        }
      } catch {}
      return 0;
    };

    Object.entries(selectedLabelQtyByOption).forEach(([optCode, qtyMap]) => {
      let subtotal = 0;
      const lines: Array<{ label: string; qty: number; unit: number }> = [];

      // 해당 옵션이 로딩 중인지 확인
      const src: any = optionData;
      const list: any[] = Array.isArray(src?.options)
        ? src.options
        : Array.isArray(src)
          ? src
          : Array.isArray(src?.list)
            ? src.list
            : [];
      const opt = list.find(
        (o: any) =>
          String(
            o.code || o.product_option_code || o.option_code || o.id || '',
          ).toUpperCase() === String(optCode).toUpperCase(),
      );
      const isOptionLoading =
        loadingDynamicPrice === opt?.id || loadingDynamicPrice === optCode;

      Object.entries(qtyMap || {}).forEach(([lCode, qty]) => {
        let unit = getLabelUnitPrice(optCode, lCode);

        // 로딩 중이면 이전 가격 사용
        if (isOptionLoading && unit === 0) {
          const priceKey = `${optCode}-${lCode}`;
          unit = previousPrices.current[priceKey] || 0;
        } else if (unit > 0) {
          // 가격이 있으면 이전 가격에 저장
          const priceKey = `${optCode}-${lCode}`;
          previousPrices.current[priceKey] = unit;
        }

        const qtyNum = Number(qty || 0);
        if (qtyNum > 0) {
          const labels: any[] = Array.isArray(opt?.labels) ? opt.labels : [];
          const lab = labels.find(
            (lb: any) =>
              String(lb?.code || lb?.id || '').toUpperCase() ===
              String(lCode).toUpperCase(),
          );
          const labelName = String(lab?.title || lab?.name || 'Participant');
          lines.push({ label: labelName, qty: qtyNum, unit });
          subtotal += qtyNum * unit;
        }
      });

      if (lines.length > 0) {
        const optionTitle = String(opt?.title || opt?.name || optCode);
        // timeslot title from selectedTimeslot
        let timeslotTitle: string | undefined;
        try {
          const sel = timeslotByOption[optCode];
          if (sel) {
            timeslotTitle = sel.title;
          }
        } catch {}

        selections.push({
          optionTitle,
          timeslotTitle,
          lines,
          subtotal,
          isLoading: isOptionLoading,
        });
      }
    });
    return selections;
  }, [
    selectedLabelQtyByOption,
    labelPriceMap,
    optionData,
    timeslotByOption,
    loadingDynamicPrice,
  ]);
  // 예약 가능 조건: 날짜 선택 + 수량 1이상 + 옵션 선택(필요 시 라벨/회차 포함)
  const canBook = Boolean(selectedDate) && totalPrice > 0;
  // Reset booking state if quantities return to 0
  useEffect(() => {
    // keep option/time selection; booking is disabled when total is 0
  }, [totalPrice]);

  const toBulletedList = (html: string): string => {
    if (!html || typeof html !== 'string') return '';
    if (html.includes('<ul')) {
      return html.replace('<ul', '<ul class="list-disc pl-5 space-y-1"');
    }
    return `<ul class="list-disc pl-5 space-y-1">${html}</ul>`;
  };

  // Derived lists and visibility guards
  const itineraryList = deriveItineraryFromCourses();
  const includedList = deriveIncluded();
  const excludedList = deriveExcluded();
  const beforeTravelList = deriveBeforeTravel();
  const bringItemsList = deriveBringItems();
  const notAllowedList = deriveNotAllowed();
  const notSuitableList = deriveNotSuitable();
  const hasImportantInfo =
    bringItemsList.length > 0 ||
    notAllowedList.length > 0 ||
    notSuitableList.length > 0 ||
    beforeTravelList.length > 0;
  const hasMeetingPoint = Boolean(
    tourData.detail.additional_fields?.find(
      field => field.key === 'meetingPoint',
    )?.content || tourData.basic.meeting_point,
  );

  const showItineraryTab =
    initialItineraryList.length > 0 || itineraryList.length > 0;
  const hasReviews =
    (Array.isArray(fetchedReviews) && fetchedReviews.length > 0) ||
    (Array.isArray(tour.reviews) && tour.reviews.length > 0);
  const hasCancellation = Boolean(tourData.basic.cancellation_description);

  const sections = [
    { id: 'options', label: 'Options' },
    ...(hasDescription ? [{ id: 'description', label: 'Description' }] : []),
    ...(showItineraryTab ? [{ id: 'usage-guide', label: 'Itinerary' }] : []),
    ...(hasImportantInfo ? [{ id: 'information', label: 'Information' }] : []),
    ...(includedList.length > 0 || excludedList.length > 0
      ? [{ id: 'included', label: 'Included' }]
      : []),
    ...(hasReviews ? [{ id: 'reviews', label: 'Reviews' }] : []),
    ...(hasCancellation ? [{ id: 'cancellation', label: 'Cancellation' }] : []),
  ];

  return (
    <LayoutProvider
      tourTitle={tour.title}
      sections={sections}
      activeSection={activeSection}
      onSectionClick={scrollToSection}
    >
      {/* New Hero Section */}
      <TourHeroSection
        tourData={tourData}
        tour={{ ...tour, reviews: tour.reviews }}
        starColor={STAR_COLOR}
        onScrollToReviews={() => scrollToSection('reviews')}
        maskName={maskName}
        reviewsOverride={fetchedReviews
          .slice(0, 100)
          .map(({ name, rating, date, comment }) => ({
            name,
            rating,
            date,
            comment,
          }))}
        ratingOverride={Number(tour.rating) || 0}
        reviewCountOverride={reviewTotalCount}
      />

      {/* Tour Highlights */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <TourHighlights
          highlights={tour.highlights || []}
          title={tourData.detail.highlight_title}
          detail={tourData.detail.highlight_detail}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-0 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 booking-container items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Options Section */}
            <div ref={optionsRef} id="options" className="scroll-mt-20">
              <TourSectionTabs
                sections={sections}
                activeSection={activeSection}
                onClick={scrollToSection}
                idAttr="tabs-trigger"
              />

              <div className="mt-6 space-y-6">
                {isDateType ? (
                  <>
                    <TourDatePicker
                      selectedDate={selectedDate}
                      onSelect={setSelectedDate}
                      availableDates={tourData.basic.available_dates}
                      dateStates={tourData.basic.available_date_states}
                    />
                    {selectedDate && optionData && (
                      <TourOptions
                        selectedDate={selectedDate}
                        options={((): any[] => {
                          const src: any = optionData;
                          const list: any[] = Array.isArray(src?.options)
                            ? src.options
                            : Array.isArray(src)
                              ? src
                              : Array.isArray(src?.list)
                                ? src.list
                                : [];
                          // 재고 계산: inventory.quantity > 0 이거나 timeslots 내 quantity 합이 > 0
                          const filtered = list.filter((o: any) => {
                            const globalQ =
                              Number(o?.inventory?.quantity ?? 0) || 0;
                            const tsList = Array.isArray(
                              o?.inventory?.timeslots,
                            )
                              ? o.inventory.timeslots
                              : [];
                            let sum = 0;
                            for (const t of tsList) {
                              const q = Number((t as any)?.quantity ?? 0) || 0;
                              sum += q;
                            }
                            const total = globalQ + sum;
                            return total > 0;
                          });
                          return filtered.map((o: any) => {
                            const code = String(
                              o.code ||
                                o.product_option_code ||
                                o.option_code ||
                                o.id ||
                                '',
                            );
                            const optionId = String(o.id || o.option_id || '');
                            const isPriceLoading =
                              loadingDynamicPrice === optionId;
                            const labels =
                              Array.isArray(o.labels) && o.labels.length > 0
                                ? o.labels.map((l: any) => ({
                                    code: String(l.code || l.id || ''),
                                    title: String(l.title || l.name || ''),
                                    net_price_currency: isPriceLoading
                                      ? previousPrices.current[optionId] ||
                                        previousPrices.current[code] ||
                                        (typeof l.price === 'number'
                                          ? l.price
                                          : optionPriceMap[optionId] ??
                                            optionPriceMap[code] ??
                                            0)
                                      : typeof l.price === 'number'
                                        ? l.price
                                        : optionPriceMap[optionId] ??
                                          optionPriceMap[code] ??
                                          0,
                                    sale_price_currency: null,
                                    normal_price_currency: null,
                                    required: Boolean(l.required),
                                    outer_id: String(l.outer_id || ''),
                                    sort_order: Number(l.sort_order ?? 0),
                                    per_min: l.per_min ?? null,
                                    per_max:
                                      typeof l.per_max === 'number'
                                        ? l.per_max
                                        : l.per_max == null
                                          ? 0
                                          : Number(l.per_max),
                                    isLoading: isPriceLoading,
                                  }))
                                : [
                                    {
                                      title: 'Adult',
                                      code: code ? `${code}-ADULT` : 'ADULT',
                                      net_price_currency: isPriceLoading
                                        ? previousPrices.current[optionId] ||
                                          previousPrices.current[code] ||
                                          (optionPriceMap[optionId] ??
                                            optionPriceMap[code] ??
                                            0)
                                        : optionPriceMap[optionId] ??
                                          optionPriceMap[code] ??
                                          0,
                                      sale_price_currency: null,
                                      normal_price_currency: null,
                                      required: true,
                                      outer_id: '',
                                      sort_order: 0,
                                      per_min: 1,
                                      per_max: 10,
                                      isLoading: isPriceLoading,
                                    },
                                  ];
                            const timeslots = Array.isArray(o.timeslots)
                              ? o.timeslots.map((t: any) => ({
                                  code: String(t.id || t.code || ''),
                                  title: String(t.title || t.name || ''),
                                }))
                              : [];
                            const timeslotTitleMap: Record<string, string> = {};
                            for (const ts of timeslots) {
                              timeslotTitleMap[String(ts.code)] = String(
                                ts.title || '',
                              );
                            }
                            const globalQ =
                              Number(o?.inventory?.quantity ?? 0) || 0;
                            const tsList = Array.isArray(
                              o?.inventory?.timeslots,
                            )
                              ? o.inventory.timeslots
                              : [];
                            let sumQ = 0;
                            for (const t of tsList)
                              sumQ += Number((t as any)?.quantity ?? 0) || 0;
                            const stockQ = globalQ + sumQ;
                            return {
                              code,
                              title: String(o.title || o.name || ''),
                              description: String(o.description || ''),
                              per_min: Number(o.per_min ?? 1),
                              per_max: Number(o.per_max ?? 10),
                              outer_id: String(o.outer_id || ''),
                              sort_order: Number(o.sort_order ?? 0),
                              sale_start_date: null,
                              sale_end_date: null,
                              use_start_date: o.item?.start_date || null,
                              use_end_date: o.item?.end_date || null,
                              use_period: o.item?.use_period || null,
                              stock_quantity: stockQ,
                              labels,
                              timeslots,
                              dynamic_price: Boolean(o.dynamic_price),
                              attrs: o.attrs || {},
                              resell_is: false,
                              inventory_timeslots: tsList.map((t: any) => {
                                const id = String(t.id || t.code || '');
                                const title = String(
                                  timeslotTitleMap[id] || t.title || id,
                                );
                                return {
                                  id,
                                  label_id: t.label_id
                                    ? String(t.label_id)
                                    : undefined,
                                  quantity: Number(t.quantity ?? 0) || 0,
                                  title,
                                };
                              }),
                            };
                          });
                        })()}
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                        inventoryScope={tourData.basic.inventory_scope}
                        onSelectOption={c => setSelectedOptionCode(c)}
                        onSelectTimeslot={(code, tsId, labelId) => {
                          setSelectedOptionCode(code);
                          setSelectedTimeslotId(tsId);
                          setSelectedLabelId(labelId);
                          setTimeslotByOption(prev => ({
                            ...prev,
                            [code]: {
                              id: String(tsId || ''),
                              title: String(
                                getTimeslotTitleFromOptions(code, tsId) ||
                                  tsId ||
                                  '',
                              ),
                            },
                          }));
                        }}
                        onChangeLabelQuantities={(code, map) => {
                          setSelectedLabelQtyByOption(prev => ({
                            ...prev,
                            [code]: map,
                          }));
                        }}
                        getLabelPrice={(code, label) => {
                          const v = labelPriceMap[code]?.[label];
                          if (typeof v === 'number') return v;
                          return 0;
                        }}
                        // availableDates/dateStates are handled by top-level date picker; not needed here
                      />
                    )}
                  </>
                ) : (
                  <>
                    <TourDatePicker
                      mode="range"
                      selectedRange={range}
                      onRangeSelect={setRange}
                      onSelect={() => {}}
                    />
                    {range.from && optionData && (
                      <TourOptions
                        selectedDate={range.from}
                        options={(optionData?.options ?? []).map((o: any) => {
                          const isPriceLoading = loadingDynamicPrice === o.id;
                          return {
                            ...o,
                            labels: (o.labels ?? []).map((l: any) => ({
                              ...l,
                              net_price_currency: isPriceLoading
                                ? previousPrices.current[o.id] ||
                                  previousPrices.current[o.code] ||
                                  (optionPriceMap[o.id] ??
                                    optionPriceMap[o.code] ??
                                    0)
                                : optionPriceMap[o.id] ??
                                  optionPriceMap[o.code] ??
                                  0,
                              isLoading: isPriceLoading,
                            })),
                          };
                        })}
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                        inventoryScope={tourData.basic.inventory_scope}
                        onSelectOption={c => setSelectedOptionCode(c)}
                        onSelectTimeslot={(code, tsId, labelId) => {
                          setSelectedOptionCode(code);
                          setSelectedTimeslotId(tsId);
                          setSelectedLabelId(labelId);
                          setTimeslotByOption(prev => ({
                            ...prev,
                            [code]: {
                              id: String(tsId || ''),
                              title: String(
                                getTimeslotTitleFromOptions(code, tsId) ||
                                  tsId ||
                                  '',
                              ),
                            },
                          }));
                        }}
                        onChangeLabelQuantities={(code, map) => {
                          setSelectedLabelQtyByOption(prev => ({
                            ...prev,
                            [code]: map,
                          }));
                        }}
                        getLabelPrice={(code, label) => {
                          const v = labelPriceMap[code]?.[label];
                          if (typeof v === 'number') return v;
                          return 0;
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div ref={descriptionRef} id="description" className="scroll-mt-20">
              <TourDescription
                description={tourData.detail.description || tour.description}
                longDescription=""
                images={tour.images}
              />
            </div>

            {/* Itinerary Section (hide if empty) */}
            {itineraryList.length > 0 && (
              <div
                ref={usageGuideRef}
                id="usage-guide"
                className="scroll-mt-20"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Itinerary
                    </h3>
                  </div>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                    <div className="space-y-6">
                      {itineraryList.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                          {/* Timeline dot */}
                          <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {index + 1}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="ml-4 flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {item.title}
                              </h4>
                              {!!item.duration && (
                                <span className="text-sm font-medium text-gray-600">
                                  {item.duration}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3 text-base leading-relaxed">
                              {item.description}
                            </p>

                            {/* Activities */}
                            {item.activities && item.activities.length > 0 && (
                              <div className="space-y-2">
                                {item.activities.map(
                                  (activity, activityIndex) => (
                                    <div
                                      key={activityIndex}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="text-gray-400 mt-1.5 flex-shrink-0">
                                        •
                                      </span>
                                      <span className="text-gray-600 text-base leading-relaxed">
                                        {activity}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                            {/* (removed static cost info) */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup & Drop Section (hide if empty) */}
            {tourData.detail.pickup_drop && (
              <div className="scroll-mt-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Pickup & Drop
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="p-4">
                        <div
                          className="text-base text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: tourData.detail.pickup_drop,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Point Section (hide if empty) */}
            {hasMeetingPoint && (
              <div className="scroll-mt-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Meeting Point
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                          <div className="flex-1">
                            {isMeetingPointExpanded ? (
                              <div
                                className="text-base text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    tourData.detail.additional_fields?.find(
                                      field => field.key === 'meetingPoint',
                                    )?.content || tourData.basic.meeting_point,
                                }}
                              />
                            ) : (
                              <div className="text-base text-gray-700 leading-relaxed">
                                {getMeetingPointSummary(
                                  tourData.detail.additional_fields?.find(
                                    field => field.key === 'meetingPoint',
                                  )?.content || tourData.basic.meeting_point,
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              setIsMeetingPointExpanded(!isMeetingPointExpanded)
                            }
                            className="flex items-center justify-center sm:justify-start gap-1 text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors flex-shrink-0 w-full sm:w-auto py-2 sm:py-0 sm:mt-1"
                          >
                            {isMeetingPointExpanded ? (
                              <>
                                <span>Show Less</span>
                                <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                <span>Show More</span>
                                <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Important Information Section (hide if empty) */}
            {hasImportantInfo && (
              <div
                ref={informationRef}
                id="information"
                className="scroll-mt-20"
              >
                <ImportantInformation
                  bringItems={bringItemsList}
                  notAllowed={notAllowedList}
                  notSuitable={notSuitableList}
                  beforeTravel={beforeTravelList}
                  beforeTravelHtml={beforeTravelHtml}
                />
              </div>
            )}

            {/* What's Included & Not Included Section (hide if empty) */}
            {(includedList.length > 0 || excludedList.length > 0) && (
              <div ref={includedRef} id="included" className="scroll-mt-20">
                <IncludedExcluded
                  included={includedList}
                  excluded={excludedList}
                />
              </div>
            )}

            {/* Reviews Section */}
            <div ref={reviewsRef} id="reviews" className="scroll-mt-20">
              <div className="mb-4">
                <TourReviews
                  rating={tour.rating}
                  reviews={pagedReviews}
                  statsReviews={fetchedReviews}
                  showAll={true}
                  onShowAll={() => {}}
                  onShowLess={() => {}}
                  starColor={STAR_COLOR}
                  totalCount={reviewTotalCount}
                />
              </div>
              {fetchedReviews.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                  {(() => {
                    const totalPages = Math.max(
                      1,
                      Math.ceil(
                        (reviewTotalCount || fetchedReviews.length) / 10,
                      ),
                    );
                    const blockIndex = Math.floor((reviewPage - 1) / 10);
                    const blockStart = blockIndex * 10 + 1;
                    const blockEnd = Math.min(totalPages, blockStart + 9);
                    return (
                      <>
                        {/* First Page */}
                        <button
                          aria-label="first page"
                          disabled={isLoadingReviews || reviewPage === 1}
                          onClick={() => goToReviewPage(1)}
                          className="px-2 py-1 rounded-full border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                          «
                        </button>
                        {/* Prev Page */}
                        <button
                          aria-label="previous page"
                          disabled={isLoadingReviews || reviewPage === 1}
                          onClick={() =>
                            goToReviewPage(Math.max(1, reviewPage - 1))
                          }
                          className="px-2 py-1 rounded-full border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                          ‹
                        </button>
                        {/* Page Numbers (block of 10) */}
                        {Array.from(
                          { length: blockEnd - blockStart + 1 },
                          (_, i) => blockStart + i,
                        ).map(p => (
                          <button
                            key={p}
                            onClick={() => goToReviewPage(p)}
                            className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center ${reviewPage === p ? 'bg-black text-white' : 'text-gray-900 hover:bg-gray-100'}`}
                            aria-current={reviewPage === p ? 'page' : undefined}
                          >
                            {p}
                          </button>
                        ))}
                        {/* Next Page */}
                        <button
                          aria-label="next page"
                          disabled={
                            isLoadingReviews || reviewPage === totalPages
                          }
                          onClick={() =>
                            goToReviewPage(Math.min(totalPages, reviewPage + 1))
                          }
                          className="px-2 py-1 rounded-full border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                          ›
                        </button>
                        {/* Last Page */}
                        <button
                          aria-label="last page"
                          disabled={
                            isLoadingReviews || reviewPage === totalPages
                          }
                          onClick={() => goToReviewPage(totalPages)}
                          className="px-2 py-1 rounded-full border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                          »
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Cancellation Section */}
            <div
              ref={cancellationRef}
              id="cancellation"
              className="scroll-mt-20"
            >
              <CancellationPolicy
                refund={tourData.refund as any}
                description={tourData.basic.cancellation_description}
                cancellationHours={tourData.basic.cancellation_hours}
                pivotHoursOverride={48}
                labels={{
                  title: 'Cancellation Policy',
                  freeTitle: 'Free cancellation',
                  left: '100% refund',
                  right: 'No refund',
                }}
                colors={{
                  leftBg: 'bg-emerald-400/80',
                  rightBg: 'bg-rose-400/80',
                  divider: 'bg-emerald-200',
                }}
              />
            </div>
          </div>

          {/* Right Column - Booking Card (desktop only) */}
          <div className="lg:col-span-1 hidden lg:block">
            <StickyBox
              topOffset={128}
              enableBelow={0}
              boundarySelector=".booking-container"
              triggerSelector="#tabs-trigger"
              debug
            >
              <TourBookingCard
                discountRate={tour.discountRate}
                originalPrice={tour.originalPrice}
                price={selectedUnitPrice}
                selectedDate={selectedDate}
                quantity={Object.values(selectedLabelQtyByOption).reduce(
                  (t, m) =>
                    t +
                    Object.values(m || {}).reduce(
                      (s, n) => s + Number(n || 0),
                      0,
                    ),
                  0,
                )}
                canBook={canBook}
                selectedOptionTitle={String(
                  (selectedOptionObj as any)?.title ||
                    (selectedOptionObj as any)?.name ||
                    '',
                )}
                selectedLabelTitle={String(
                  (selectedLabelObj as any)?.title ||
                    (selectedLabelObj as any)?.name ||
                    '',
                )}
                selectedTimeslotTitle={String(
                  (selectedTimeslotObj as any)?.title ||
                    (selectedTimeslotObj as any)?.name ||
                    '',
                )}
                currencyCode={'USD'}
                selections={bookingSelections}
                totalAmount={totalPrice}
                isPriceLoading={loadingDynamicPrice !== null}
                onBook={handleBooking}
              />
            </StickyBox>
          </div>
        </div>
      </div>

      {/* Mobile Booking Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 lg:hidden shadow-lg">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500">
                Participants:{' '}
                {Object.values(selectedLabelQtyByOption).reduce(
                  (t, m) =>
                    t +
                    Object.values(m || {}).reduce(
                      (s, n) => s + Number(n || 0),
                      0,
                    ),
                  0,
                )}
              </div>
              <div className="text-lg font-semibold text-black">
                Total:{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalPrice || 0)}
              </div>
            </div>
            <button
              onClick={handleBooking}
              disabled={!canBook}
              className="px-6 py-3 rounded-lg bg-[#01c5fd] text-white font-semibold disabled:opacity-40 disabled:pointer-events-none hover:bg-[#01b7ea] transition-colors"
            >
              {canBook ? 'Book now' : 'Select date & qty'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {infoModal.title}
              </h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => {
                  // Mock close
                }}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div
              className="p-4 text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: infoModal.content }}
            />
            <div className="p-4 pt-0 flex justify-end">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black"
                onClick={() => {
                  // Mock close
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutProvider>
  );
}
