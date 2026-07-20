export function isRenderableImageSrc(src: string | null | undefined): src is string {
  if (!src) return false;
  const value = src.trim();
  if (!value) return false;
  if (value.startsWith("/")) return true;
  return value.startsWith("http://") || value.startsWith("https://");
}
