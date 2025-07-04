const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export function getImageUrl(relativePath: string): string {
  return `${imageBaseUrl}/${relativePath}`;
}
