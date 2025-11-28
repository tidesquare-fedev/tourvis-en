'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { ResponsiveContainer } from '@/components/common/ResponsiveContainer';
import { extractFirstEmoji, stripEmoji } from '@/lib/utils/string';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Category } from '../types';

interface ProductTabsProps {
  /** 카테고리 데이터 배열 */
  categories: Category[];
  /** 섹션 제목 */
  title?: string;
}

interface TabGroup {
  key: string;
  label: string;
  emoji: string;
  Icon: React.ComponentType<any>;
  items: any[];
}

/**
 * 제품을 탭 형태로 표시하는 컴포넌트
 * 드래그 가능한 탭과 그리드 레이아웃을 지원
 */
export function ProductTabs({
  categories,
  title = '추천 상품',
}: ProductTabsProps) {
  const tabIcons = [MapPin, Calendar, Users, Search];
  const tabsListRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const drag = useRef({ startX: 0, scrollLeft: 0 });

  /**
   * 카테고리 배열을 탭 그룹으로 변환
   */
  const buildTabGroups = (cats: Category[]): TabGroup[] => {
    return cats
      .filter(c => Array.isArray(c.items) && c.items.length > 0)
      .slice(0, 4)
      .map((cat, idx) => {
        const emoji = extractFirstEmoji(cat.title);
        const label = stripEmoji(cat.title);
        return {
          key: `cat-${idx}`,
          label,
          emoji,
          Icon: tabIcons[idx % tabIcons.length],
          items: cat.items.slice(0, 4),
        };
      });
  };

  const tabGroups = buildTabGroups(categories);

  if (tabGroups.length === 0) {
    return null;
  }

  /**
   * 탭 드래그 핸들러들
   */
  const handleTabsPointerDown = (e: any) => {
    const el = tabsListRef.current;
    if (!el) return;
    setIsDraggingTabs(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    drag.current.startX = pageX - el.offsetLeft;
    drag.current.scrollLeft = el.scrollLeft;
  };

  const handleTabsPointerMove = (e: any) => {
    if (!isDraggingTabs) return;
    e.preventDefault();
    const el = tabsListRef.current;
    if (!el) return;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - el.offsetLeft;
    const walk = x - drag.current.startX;
    el.scrollLeft = drag.current.scrollLeft - walk;
  };

  const handleTabsPointerUp = () => setIsDraggingTabs(false);

  return (
    <section className="w-full">
      <ResponsiveContainer>
        <div className="mt-2">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-left">
            {title}
          </h3>

          <Tabs defaultValue={tabGroups[0]?.key ?? 'cat-0'} className="w-full">
            <TabsList
              ref={tabsListRef as any}
              onMouseDown={handleTabsPointerDown}
              onMouseMove={handleTabsPointerMove}
              onMouseLeave={handleTabsPointerUp}
              onMouseUp={handleTabsPointerUp}
              onTouchStart={handleTabsPointerDown}
              onTouchMove={handleTabsPointerMove}
              onTouchEnd={handleTabsPointerUp}
              className="w-full overflow-x-auto overflow-y-hidden flex gap-2 sm:gap-3 rounded-none bg-transparent p-0 border-b scrollbar-hide cursor-grab active:cursor-grabbing select-none justify-start"
            >
              {tabGroups.map(tab => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="data-[state=active]:font-bold relative rounded-none bg-transparent px-3 sm:px-4 py-2 text-sm sm:text-base data-[state=active]:text-gray-900 text-gray-500 scrollbar-hide"
                >
                  {tab.emoji && <span className="mr-1.5">{tab.emoji}</span>}
                  <span className="truncate">{tab.label}</span>
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-gray-900 opacity-0 data-[state=active]:opacity-100" />
                </TabsTrigger>
              ))}
            </TabsList>

            {tabGroups.map(tab => (
              <TabsContent
                key={tab.key}
                value={tab.key}
                className="mt-4 sm:mt-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {tab.items?.slice(0, 4).map((product: any) => (
                    <Link
                      key={product.id}
                      href={product.href || `/activity/product/${product.id}`}
                      className="block"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-stretch">
                          <div className="relative w-36 sm:w-44 md:w-48 shrink-0 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-3 sm:p-4 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2 leading-snug">
                              {product.title}
                            </h4>

                            {/* 평점 표시 */}
                            {typeof product.rating === 'number' &&
                              product.rating > 0 &&
                              typeof product.reviewCount === 'number' &&
                              product.reviewCount > 0 && (
                                <div className="flex items-center text-[11px] sm:text-xs text-yellow-600 mb-1.5 sm:mb-2">
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  {product.rating?.toFixed
                                    ? product.rating.toFixed(1)
                                    : product.rating}{' '}
                                  ({product.reviewCount})
                                </div>
                              )}

                            {/* 할인 전 가격 */}
                            {typeof product.discountRate === 'number' &&
                              product.discountRate > 0 && (
                                <div className="text-[11px] sm:text-xs text-gray-500 line-through">
                                  {typeof product.originalPrice === 'number'
                                    ? `$${product.originalPrice.toLocaleString()}`
                                    : product.originalPrice}
                                </div>
                              )}

                            {/* 가격 정보 */}
                            <div className="mt-1 flex items-center gap-2">
                              {typeof product.discountRate === 'number' &&
                                product.discountRate > 0 && (
                                  <span className="text-[11px] sm:text-xs font-bold text-red-500">
                                    {product.discountRate}%
                                  </span>
                                )}
                              <div className="text-sm sm:text-base font-bold text-blue-600">
                                {typeof product.price === 'number'
                                  ? `$${product.price.toLocaleString()}`
                                  : product.price}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
