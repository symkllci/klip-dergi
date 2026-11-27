// ⭐ Sitenin tam adresi (https://...). Paylaşım görseli, hreflang ve sitemap tam adres ister.
// Vercel her ortamda bize kendi adresini "ortam değişkeni" (process.env) olarak verir:
// - Ana sitede (production): VERCEL_PROJECT_PRODUCTION_URL → klip-dergi.vercel.app
// - Önizlemede (preview, ör. hafta6): VERCEL_BRANCH_URL → klip-dergi-git-hafta6-....vercel.app
// - Kendi bilgisayarımda: hiçbiri yok → localhost
// Eskiden layout.tsx'in içindeydi; sitemap.ts ve robots.ts de kullansın diye buraya taşındı
export function siteAdresi(): URL {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_BRANCH_URL) {
    return new URL(`https://${process.env.VERCEL_BRANCH_URL}`);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}