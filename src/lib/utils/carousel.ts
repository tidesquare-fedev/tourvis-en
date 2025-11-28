/**
 * 캐러셀 관련 공통 유틸리티 함수들
 * 중복된 캐러셀 로직을 통합하여 관리
 */

export interface CarouselOptions {
  align?: 'start' | 'center' | 'end';
  slidesToScroll?: number;
  loop?: boolean;
  showArrows?: boolean;
  className?: string;
}

export interface CarouselItemOptions {
  className?: string;
  basis?: string;
}

/**
 * 기본 캐러셀 아이템 클래스명 생성
 * @param basis - flex-basis 값 (기본값: 'basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4')
 * @returns 캐러셀 아이템 클래스명
 */
export function getCarouselItemClassName(
  basis: string = 'basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4',
): string {
  return `pl-2 md:pl-4 ${basis}`;
}

/**
 * 캐러셀 네비게이션 표시 여부 확인
 * @param showArrows - 화살표 표시 여부
 * @param itemCount - 아이템 개수
 * @param minItemsForArrows - 화살표를 표시할 최소 아이템 개수 (기본값: 4)
 * @returns 화살표 표시 여부
 */
export function shouldShowCarouselArrows(
  showArrows: boolean = true,
  itemCount: number = 0,
  minItemsForArrows: number = 4,
): boolean {
  return showArrows && itemCount >= minItemsForArrows;
}

/**
 * 캐러셀 네비게이션 클래스명 생성
 * @returns 네비게이션 컨테이너 클래스명
 */
export function getCarouselNavigationClassName(): string {
  return 'flex justify-center mt-3 space-x-4';
}

/**
 * 캐러셀 인디케이터 클래스명 생성
 * @param isActive - 활성 상태 여부
 * @param className - 추가 클래스명
 * @returns 인디케이터 클래스명
 */
export function getCarouselIndicatorClassName(
  isActive: boolean,
  className: string = '',
): string {
  const baseClasses = 'h-2.5 w-2.5 rounded-full transition-all';
  const activeClasses = isActive
    ? 'bg-blue-600 w-5'
    : 'bg-gray-300 hover:bg-gray-400';
  return `${baseClasses} ${activeClasses} ${className}`.trim();
}

/**
 * 캐러셀 인디케이터 컨테이너 클래스명 생성
 * @param className - 추가 클래스명
 * @returns 인디케이터 컨테이너 클래스명
 */
export function getCarouselIndicatorsContainerClassName(
  className: string = '',
): string {
  return `flex justify-center gap-2 ${className}`.trim();
}

/**
 * 캐러셀 스크롤 스냅 계산
 * @param itemCount - 아이템 개수
 * @param slidesToScroll - 한 번에 스크롤할 슬라이드 수
 * @returns 스크롤 스냅 배열
 */
export function getCarouselScrollSnaps(
  itemCount: number,
  slidesToScroll: number = 1,
): number[] {
  if (itemCount <= 0) return [];

  const snaps: number[] = [];
  for (let i = 0; i < itemCount; i += slidesToScroll) {
    snaps.push(i);
  }
  return snaps;
}

/**
 * 캐러셀 현재 인덱스 계산
 * @param scrollSnaps - 스크롤 스냅 배열
 * @param currentScroll - 현재 스크롤 위치
 * @returns 현재 인덱스
 */
export function getCarouselCurrentIndex(
  scrollSnaps: number[],
  currentScroll: number,
): number {
  if (scrollSnaps.length === 0) return 0;

  let closestIndex = 0;
  let minDistance = Math.abs(scrollSnaps[0] - currentScroll);

  for (let i = 1; i < scrollSnaps.length; i++) {
    const distance = Math.abs(scrollSnaps[i] - currentScroll);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * 캐러셀 옵션 기본값 생성
 * @param options - 사용자 옵션
 * @returns 기본값이 적용된 옵션
 */
export function getCarouselDefaultOptions(
  options: Partial<CarouselOptions> = {},
): CarouselOptions {
  return {
    align: 'start',
    slidesToScroll: 1,
    loop: false,
    showArrows: true,
    className: 'w-full',
    ...options,
  };
}
