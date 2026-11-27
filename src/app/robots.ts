import type { MetadataRoute } from "next";
import { siteAdresi } from "@/lib/site-adresi";

// ROBOTS: /robots.txt adresinde açılır. Arama motoru robotlarına "nereye girebilirsin" der.
// 📚 Next.js robots.ts · Biz her yeri açıyoruz ve site haritasının adresini veriyoruz.
// (Deneme sayfaları silindi, saklanacak bir şey kalmadı.)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" }, // "*" = bütün robotlar · "/" = her yer
    sitemap: new URL("/sitemap.xml", siteAdresi()).toString(),
  };
}