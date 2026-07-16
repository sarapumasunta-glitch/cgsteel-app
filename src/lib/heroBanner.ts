export type HeroBannerType = "video" | "image";

export const HERO_BANNER_TYPES: HeroBannerType[] = ["image", "video"];

export const HERO_BANNER_TYPE_LABELS: Record<HeroBannerType, string> = {
  image: "Foto",
  video: "Video",
};
