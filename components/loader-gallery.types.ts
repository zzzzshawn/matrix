import type { ReactNode } from "react";
import type { LoaderCard } from "@/components/loader-details-drawer";
import type { DotMatrixCommonProps } from "@/loaders";

export type LoaderPreviewOverrideMap = Partial<Record<string, Partial<DotMatrixCommonProps>>>;

export type HeroNavLink = {
  label: string;
  href: string;
};

export type LoaderGalleryHeroContent = {
  title: ReactNode;
  description: ReactNode;
  navLinks: readonly HeroNavLink[];
  installCommand: string;
};

export interface LoaderGalleryProps {
  items: LoaderCard[];
  heroContent?: Partial<LoaderGalleryHeroContent>;
  cardAnimationEnabled?: boolean;
  detailPreviewScale?: number;
  detailPreviewDotBoost?: number;
  previewPropsOverrides?: LoaderPreviewOverrideMap;
  className?: string;
}
