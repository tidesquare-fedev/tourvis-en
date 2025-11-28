'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type TourImageCarouselProps = {
  images: string[];
  title: string;
};

export function TourImageCarousel({ images, title }: TourImageCarouselProps) {
  const imageGroups: string[][] = [];
  for (let i = 0; i < images.length; i += 2) {
    imageGroups.push(images.slice(i, i + 2));
  }

  return (
    <div className="mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {imageGroups.map((group, index) => (
            <CarouselItem key={index}>
              <div className="grid grid-cols-2 gap-2 h-80">
                {group.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=600&h=400&q=80`}
                    alt={`${title} ${index * 2 + imgIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
