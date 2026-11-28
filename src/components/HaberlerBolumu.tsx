import { Lora } from "next/font/google";
import haberler from "@/data/haberler.json"; // scripts/haber-cek.ts doldurur, editör PR'da onaylar
import type { Sozluk } from "@/lib/sozluk";

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

type Haber = { kisi: string; kaynak: string; tarih: string; baslik: string; url: string };

const EN_FAZLA = 3; // Plan: kişi başına en fazla 3 haber
const GUN = 90; // Sadece son 90 gün ("Son 90 gün" yazısı doğru kalsın)
// Sınır tarihi: sayfa ÜRETİLİRKEN (build) bir kez hesaplanır. Bileşenin içinde Date.now() olmaz (React kuralı: çizim saf olmalı)
const SINIR = new Date(Date.now() - GUN * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

// HABERLERDE: kişi sayfasında, Kliplerden sonra. Hocanın tasarımı: görselsiz; solda kaynak + tarih, sağda başlık + "Haberi oku ↗"
// Sadece başlık, kaynak, tarih ve link: haberin metni ve fotoğrafı haber sitesinin, almıyoruz
export default function HaberlerBolumu({ slug, s }: { slug: string; s: Sozluk }) {
  const liste = (haberler as Haber[])
    .filter((h) => h.kisi === slug && h.tarih >= SINIR) // bu kişi + son 90 gün
    .sort((a, b) => b.tarih.localeCompare(a.tarih)) // en yeni üstte
    .slice(0, EN_FAZLA);
  if (liste.length === 0) return null; // Haberi yoksa bölüm hiç çıkmaz

  const k = s.kisiSayfasi;
  return (
    <section aria-labelledby="haberlerde" className="mx-auto mt-20 max-w-3xl border-t-2 border-stone-900 pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="haberlerde" className={`${baslikFontu.className} text-2xl font-bold sm:text-3xl`}>{k.haberlerde}</h2>
        <span className="text-xs text-stone-500">{k.son90Gun}</span>
      </div>
      <ul>
        {liste.map((h, sira) => (
          <li key={h.url} className={sira > 0 ? "border-t border-stone-300" : ""}>
            {/* Bütün satır tek link. Telefonda alt alta, geniş ekranda solda 120 px kaynak sütunu */}
            <a
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-1.5 py-5 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-5"
            >
              <span className="text-xs leading-relaxed tracking-wider text-stone-500">
                {/* Kaynak adı BÜYÜK HARFE çevrilmiyor: Türkçe sayfada "MediaCat" → "MEDİACAT" olurdu (i → İ). Markanın kendi yazılışı */}
                <b className="block text-sm font-semibold tracking-normal text-rose-800">{h.kaynak}</b>
                <time dateTime={h.tarih} className="uppercase">
                  {new Date(h.tarih).toLocaleDateString(s.genel.yerel, { day: "numeric", month: "long", timeZone: "UTC" })}
                </time>
              </span>
              <span>
                {/* lang="tr": başlık Türkçe (İngilizce sayfada da), ekran okuyucu doğru okusun */}
                <span lang="tr" className={`${baslikFontu.className} block text-lg font-semibold leading-snug group-hover:underline group-hover:underline-offset-4 sm:text-xl`}>
                  {h.baslik}
                </span>
                <span className="mt-1.5 block text-sm text-stone-500">{k.haberiOku} ↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs italic text-stone-500">{k.haberNotu}</p>
    </section>
  );
}