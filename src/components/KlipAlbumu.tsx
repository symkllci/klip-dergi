import KlipOynatici from "@/components/KlipOynatici"; // Klip: önce kapak + ▶, tıklanınca Instagram
import InstagramGlifi from "@/components/InstagramGlifi"; // Instagram'ın resmî tek renk glifi (Meta marka sayfasından)
import type { Clip } from "@/types"; // Klip kalıbı

// Klibin linkinin adı (platforma göre). Ekranda yazmıyor: glif linkinin aria-label'ı (ekran okuyucu bunu okur)
function izleYazisi(klip: Clip): string {
  if (klip.platform === "youtube") {
    return "Klibi YouTube'da izle";
  }
  return "Klibi Instagram'da izle";
}

// Klip albümü: kişi sayfasından AYRI bileşene taşındı → aynı albümü deneme sayfası da kullanabilsin
// (bir kez yaz, iki yerde kullan). Kişi sayfası: <KlipAlbumu klipler={kisi.clips} />
export default function KlipAlbumu({ klipler }: { klipler: Clip[] }) {
  // 📚 MDN CSS Grid · repeat(auto-fill, minmax(240px, 1fr)): sığdığı kadar sütun, her biri en az 240px
  // Geniş ekran (1152px) → 4 sütun (~270px, eskiden 320px → biraz küçüldü) · tablet → 2–3 · telefon → 1
  // min(240px,100%): çok dar ekranda taşmasın · gap-y-12: satırlar arası daha geniş (yazılar karışmasın)
  return (
    <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-x-6 gap-y-12">
      {klipler.map((klip, sira) => (
        // Genişlik artık hücreden geliyor (w-[320px], shrink-0, snap-start gerek kalmadı)
        <li key={klip.url}>
          {/*  Dergi numarası + konu yan yana */}
          <p className="mb-3 flex items-baseline gap-3">
            {/* padStart(2, "0"): sayı 2 haneden kısaysa başına 0 ekle → 01…09, 10, 11, 12 (eskiden "0" + 10 = "010" oluyordu) */}
            <span className="font-serif text-3xl italic text-rose-800">{String(sira + 1).padStart(2, "0")}</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</span>
          </p>
          {/* Klip: önce kapak + ▶, tıklanınca Instagram yüklenir (sayfa hızlı açılsın) */}
          <KlipOynatici klip={klip} />

          {/* ⭐ Klip altı: solda Lora başlık + gri kaynak satırı, sağda Instagram glifi (link).
              Eskisi: "Klibi Instagram'da izle ↗" yazısı → kaldırıldı (plan) */}
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold leading-snug">{klip.title}</h3>
              {/* Kaynak: klibin kesildiği bölüm. Küçük ve gri. Sadece varsa (&&): 4 klipte yok */}
              {klip.source && (
                <a
                  href={klip.source.episodeUrl} // Bölümün YouTube linki
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-xs leading-relaxed text-stone-500 hover:text-rose-800 hover:underline"
                >
                  {klip.source.episodeTitle}
                </a>
              )}
            </div>
            {klip.platform === "instagram" ? (
              // Glif linki: 29×29 px (Meta'nın en küçük boyu) · gri, üstüne gelince bordo
              // aria-label: ekranda yazı yok, ekran okuyucu "Klibi Instagram'da izle" okusun
              <a
                href={klip.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={izleYazisi(klip)}
                title={izleYazisi(klip)} // Fare üstüne gelince küçük ipucu
                className="mt-1 shrink-0 text-stone-500 transition-colors hover:text-rose-800"
              >
                <InstagramGlifi className="h-[29px] w-[29px]" />
              </a>
            ) : (
              // YouTube klibi gelirse: glif yok, kısa yazı (Instagram glifi YouTube için kullanılmaz)
              <a
                href={klip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 shrink-0 text-xs text-stone-500 underline hover:text-rose-800"
              >
                {izleYazisi(klip)} ↗
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}