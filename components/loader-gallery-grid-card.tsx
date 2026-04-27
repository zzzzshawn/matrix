"use client";

import { memo, useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import type { LoaderCard } from "@/components/loader-details-drawer";
import type { DotMatrixCommonProps } from "@/loaders";

interface LoaderGalleryGridCardProps {
  item: LoaderCard;
  onSelect: (slug: string) => void;
  isAnimationEnabled: boolean;
  PreviewComponent: ComponentType<DotMatrixCommonProps>;
  previewProps: DotMatrixCommonProps;
}

export const LoaderGalleryGridCard = memo(function LoaderGalleryGridCard({
  item,
  onSelect,
  isAnimationEnabled,
  PreviewComponent,
  previewProps
}: LoaderGalleryGridCardProps) {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const handleSelect = useCallback(() => {
    onSelect(item.slug);
  }, [onSelect, item.slug]);

  const shouldAnimate = Boolean(isAnimationEnabled && isNearViewport && (previewProps.animated ?? true));

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsNearViewport(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        rootMargin: "150px 0px",
        threshold: 0
      }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={handleSelect}
      className="aspect-square cursor-pointer bg-surface/80 rounded-3xl relative group"
    >
      <div className="theme-text-strong pointer-events-none absolute inset-x-2 bottom-2 z-20 rounded-md px-2 py-1 text-center text-[11px] font-medium tracking-wide">
        {item.title}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center ">
          <PreviewComponent {...previewProps} animated={shouldAnimate} />
        </div>
      </div>
    </button>
  );
});
