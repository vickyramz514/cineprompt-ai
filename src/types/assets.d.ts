/**
 * Static image imports used by Next.js Image / bundler.
 * Ensures `tsc --noEmit` works in CI without a prior `next build`.
 */

declare module "*.jpeg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.jpg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.png" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.webp" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.gif" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.svg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}
