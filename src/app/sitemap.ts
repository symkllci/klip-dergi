import type { MetadataRoute } from "next";
import { getAllPeople } from "@/lib/people";
import { DILLER, yol } from "@/lib/sozluk";
import { siteAdresi } from "@/lib/site-adresi";

// SİTE HARİTASI: /sitemap.xml adresinde açılır. Google'a "sitemde şu sayfalar var" listesi.
// 📚 Next.js sitemap.ts: bu dosya bir liste döndürür, Next.js onu XML'e çevirir.
// Plan: iki dildeki bütün kişileri listelesin → her sayfa TR ve EN olarak ayrı satır,
// her satırda "öbür dildeki hâli şurada" bilgisi (alternates, hreflang'in sitemap'teki karşılığı)

// Tam adres: "/en/kisiler" → "https://klip-dergi.vercel.app/en/kisiler"
function tamAdres(adres: string): string {
  return new URL(adres, siteAdresi()).toString();
}

// Bir sayfanın iki dildeki satırı. adres: dilsiz adres (ör. "/kisiler/hamdi-ulukaya")
function ikiDilde(adres: string, sonGuncelleme?: string): MetadataRoute.Sitemap {
  // Her iki satırda da aynı dil listesi: { tr: ".../kisiler", en: ".../en/kisiler" }
  const diller = Object.fromEntries(DILLER.map((dil) => [dil, tamAdres(yol(dil, adres))]));
  return DILLER.map((dil) => ({
    url: tamAdres(yol(dil, adres)),
    lastModified: sonGuncelleme, // Kişi sayfasında: biyografinin güncellendiği gün (people.json'daki updatedAt)
    alternates: { languages: diller },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kisiler = await getAllPeople();
  return [
    ...ikiDilde("/"), // ana sayfa
    ...ikiDilde("/kisiler"),
    ...ikiDilde("/hakkinda"),
    // flatMap: her kişi için 2 satır (TR + EN) → tek uzun liste. 12 kişi × 2 = 24 satır
    ...kisiler.flatMap((kisi) => ikiDilde(`/kisiler/${kisi.slug}`, kisi.updatedAt)),
  ];
}