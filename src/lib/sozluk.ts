import { notFound } from "next/navigation";
import tr from "@/sozluk/tr.json"; // Türkçe arayüz yazıları
import enVerisi from "@/sozluk/en.json"; // İngilizce arayüz yazıları

// 📚 Next.js Internationalization belgesi: "dictionaries" (sözlükler) = anahtar → o dildeki yazı
// Sayfalar yazıyı elle yazmaz, sözlükten okur: s.genel.kisiler → "Kişiler" ya da "People"

// Sözlüğün kalıbı Türkçe dosyadan çıkar. typeof = "bu dosyanın şekli"
export type Sozluk = typeof tr;

// İngilizce dosyaya Türkçenin kalıbını veriyoruz (as değil, tip vererek atama):
// en.json'da bir anahtar eksik ya da fazlaysa TypeScript hemen söyler → iki sözlük hep aynı kalır
const en: Sozluk = enVerisi;

const sozlukler = { tr, en };

// Sitenin dilleri: "tr" | "en". keyof = "nesnenin anahtarlarından biri"
export type Dil = keyof typeof sozlukler;
export const DILLER = Object.keys(sozlukler) as Dil[];

// Adresten gelen yazı bizim dillerimizden biri mi? Değilse 404 (ör. /de)
export function dilAl(lang: string): Dil {
  if (lang in sozlukler) return lang as Dil;
  notFound();
}

// O dilin sözlüğü
export function getSozluk(dil: Dil): Sozluk {
  return sozlukler[dil];
}

// Site içi adres: Türkçe adresler aynı kalır, İngilizcenin başına /en gelir
// yol("tr", "/kisiler") → "/kisiler" · yol("en", "/kisiler") → "/en/kisiler" · yol("en", "/") → "/en"
export function yol(dil: Dil, adres: string): string {
  if (dil === "tr") return adres;
  return adres === "/" ? "/en" : `/en${adres}`;
}

// Konunun o dildeki adı. Veride konular Türkçe ("yatırım"); sözlükte karşılığı yoksa olduğu gibi yazılır
export function konuAdi(s: Sozluk, konu: string): string {
  return (s.konular as Record<string, string>)[konu] ?? konu;
}

// "1 klip" / "3 klip" · "1 clip" / "3 clips" (İngilizcede çoğul -s alır, Türkçede almaz)
export function klipSayisi(s: Sozluk, adet: number): string {
  return `${adet} ${adet === 1 ? s.genel.klip : s.genel.klipler}`;
}
