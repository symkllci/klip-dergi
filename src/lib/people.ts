import { cache } from "react"; // Aynı sayfa çizilirken veriyi bir kez oku (layout + sayfa ayrı ayrı istese de)
import { z } from "zod";
import kisiVerisi from "@/data/people.json"; // BİZİM yazdıklarımız: biyografi, kanca, fotoğraf, klip notları
import ornekApi from "@/data/ornek-api.json"; // API hazır olana kadar örnek cevap (21 klip)
import { CevapSemasi, KlipSemasi, type ApiKlip } from "@/lib/klip-semasi"; // Zod bekçisi
import type { Clip, ClipNote, Person, PersonData } from "@/types";
import type { AramaKisisi } from "@/components/AramaKutusu"; // Öneri listesinin kişi kalıbı (sadece tip)

// Sayfalar veriyi YALNIZ bu dosyadan alır. Veri nereden gelirse gelsin (örnek dosya ya da API), sayfalar değişmez.

// API adresi .env.local'de durur:  KLIP_API_URL=https://...
// Tanımlı değilse örnek dosya okunur. Adres gelince kodda hiçbir şey değişmez, sadece .env.local'e o satır eklenir.
const API_ADRESI = process.env.KLIP_API_URL;

// "as Person[]" yerine tip vererek atama (hocanın 10 Kasım cevabı): eksik ya da yanlış alan varsa TypeScript söyler
const kisiler: PersonData[] = kisiVerisi;

// 1) Ham cevabı al: API ya da örnek dosya. unknown = "ne geldiğini henüz bilmiyoruz", Zod bakacak
async function hamCevap(): Promise<unknown> {
  if (!API_ADRESI) return ornekApi;
  const cevap = await fetch(API_ADRESI, { next: { revalidate: 3600 } }); // saatte bir yenile
  return cevap.json();
}

// 2) Zod bekçisi: sağlam kayıtları al, bozukları ATLA ve terminale yaz (sayfa çökmesin)
const klipleriGetir = cache(async (): Promise<ApiKlip[]> => {
  const cevap = CevapSemasi.safeParse(await hamCevap());
  if (!cevap.success) {
    console.error("[klip-api] Cevap beklenen biçimde değil, hiç klip alınmadı:\n" + z.prettifyError(cevap.error));
    return [];
  }
  const saglamlar: ApiKlip[] = [];
  cevap.data.klipler.forEach((kayit, sira) => {
    const sonuc = KlipSemasi.safeParse(kayit); // safeParse: hata FIRLATMAZ, sonuç döner
    if (sonuc.success) {
      saglamlar.push(sonuc.data);
    } else {
      console.warn(`[klip-api] ${sira + 1}. kayıt atlandı:\n` + z.prettifyError(sonuc.error));
    }
  });
  return saglamlar;
});

// 3) API'deki klibi sitenin Clip kalıbına çevir, bizim notumuzu (konu, alıntı) ekle
function klibeCevir(klip: ApiKlip, not?: ClipNote): Clip {
  return {
    platform: "instagram",
    url: klip.url,
    title: klip.baslik,
    topic: not?.topic ?? "klip", // notu olmayan yeni klipte konu henüz yok
    publishedAt: klip.yayinTarihi.slice(0, 10), // "2026-10-01" ya da "2026-10-01T12:00:00Z" → "2026-10-01"
    cover: `/kapaklar/${klip.reel}.jpg`,
    source: klip.kaynak && {
      episodeTitle: klip.kaynak.videoBasligi,
      episodeUrl: `https://www.youtube.com/watch?v=${klip.kaynak.youtubeId}`,
    },
    quote: not?.quote,
  };
}

// Bütün kişiler, klipleriyle birlikte. async = veri gelmesini bekleyebilir (API'den gelince süre alır)
export async function getAllPeople(): Promise<Person[]> {
  const klipler = await klipleriGetir();
  const hepsi = kisiler.map(({ clipNotes, ...kisi }) => {
    // Klipler kişiye ADINDAN bağlanır ("kisiler": ["Nevzat Aydın"])
    const kendiKlipleri = klipler.filter((klip) => klip.kisiler.includes(kisi.name));
    // Önce notu olanlar, people.json'daki sırayla (site eskisi gibi görünsün)
    const notlular = clipNotes
      .map((not) => {
        const klip = kendiKlipleri.find((k) => k.reel === not.reel);
        return klip && klibeCevir(klip, not);
      })
      .filter((klip) => klip !== undefined);
    // Sonra API'de olup bizde notu olmayan yeni klipler
    const yeniler = kendiKlipleri
      .filter((klip) => !clipNotes.some((not) => not.reel === klip.reel))
      .map((klip) => klibeCevir(klip));
    return { ...kisi, clips: [...notlular, ...yeniler] };
  });
  // Hiç klibi kalmayan kişi gösterilmez (sayfalar en az bir klip bekliyor)
  return hepsi.filter((kisi) => {
    if (kisi.clips.length === 0) console.warn(`[klip-api] ${kisi.name}: hiç klip yok, sitede gösterilmedi`);
    return kisi.clips.length > 0;
  });
}

// Slug ile tek bir kişiyi bulan tarif, ör. /kisiler/acun-ilicali. Bulamazsa undefined
export async function getPersonBySlug(slug: string): Promise<Person | undefined> {
  const hepsi = await getAllPeople();
  return hepsi.find((person) => person.slug === slug);
}

// Arama öneri listesi için kişiler: ad, slug, konular, klip başlıkları.
// Biyografi gibi uzun bilgiler YOK → tarayıcıya az veri gider.
// Üst menüdeki arama (layout.tsx) ve Kişiler sayfasındaki arama aynı listeyi kullanır.
export async function getAramaKisileri(): Promise<AramaKisisi[]> {
  const hepsi = await getAllPeople();
  return hepsi.map((kisi) => ({
    ad: kisi.name,
    slug: kisi.slug,
    // new Set: aynı konu iki klipte varsa bir kez yaz · [...] = tekrar listeye çevir
    konular: [...new Set(kisi.clips.map((klip) => klip.topic))],
    basliklar: kisi.clips.map((klip) => klip.title),
  }));
}