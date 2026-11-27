import type { Metadata } from "next"; // Sekme başlığı ve robots ayarının kalıbı
import { Lora } from "next/font/google"; // Başlık fontu (kişi sayfasıyla aynı)
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif
import KlipAlbumu from "@/components/KlipAlbumu"; // Kişi sayfasındaki albümün AYNISI
import { dilAl, getSozluk } from "@/lib/sozluk"; // Albümdeki küçük yazılar (konu, "Klibi oynat") için sözlük

// 12 KLİP DENEMESİ (plan çıktısı): "12 klip olsa kişi sayfası nasıl görünür?"
// Deneme verisi: elimizdeki 21 gerçek klipten ilk 12'si (uydurma klip yok). Sadece görünüş denemesi.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// robots noindex: Google bu sayfayı listelemesin (ses-deneme gibi, sadece bizim için)
export const metadata: Metadata = {
  title: "12 klip denemesi",
  robots: { index: false, follow: false },
};

// Bu sayfa Çarşamba silinecek: sayfa yazıları Türkçe kaldı, sadece albüm sözlükten okuyor
export default async function KlipDeneme({ params }: PageProps<"/[lang]/klip-deneme">) {
  const s = getSozluk(dilAl((await params).lang));
  // flatMap: her kişinin klip listesini tek uzun listeye dök → 21 klip · slice(0, 12): ilk 12'si
  const klipler = (await getAllPeople())
    .flatMap((kisi) => kisi.clips)
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* Genişlik kişi sayfasıyla AYNI: tam genişlik, yanlarda clamp(16px, 3.2vw, 56px).
          Deneme, kişi sayfasında nasıl görüneceğini göstermeli → ikisi hep aynı genişlikte */}
      <main className="px-[clamp(16px,3.2vw,56px)] py-10">
        {/* Manşet: küçük bordo üst yazı (DENEME) + büyük Lora başlık + italik açıklama.
            Üstteki künye çizgisi kaldırıldı: "12 klip" zaten aşağıda yazıyor, çizgi de bölüm çizgisiyle çift görünüyordu */}
        <header className="pb-10 pt-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-800">Deneme</p>
          <h1 className={`${baslikFontu.className} mt-3 text-5xl font-bold leading-tight sm:text-7xl`}>
            On iki klip
          </h1>
          <p className="mx-auto mt-3 max-w-2xl font-serif text-lg italic leading-relaxed text-stone-600 sm:text-xl">
            Bir kişinin 12 klibi olsa sayfası böyle görünür. Klipler gerçek; yalnız görünüş denemesi.
          </p>
        </header>

        {/* Bölüm başlığı: ana sayfadaki gibi büyük Lora + sağda bordo büyük harf + altında koyu çizgi */}
        <section>
          <div className="flex items-end justify-between border-b border-stone-900 pb-4">
            <h2 className={`${baslikFontu.className} text-3xl sm:text-5xl`}>Klipler</h2>
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-800">{klipler.length} klip</p>
          </div>
          {/* Albüm: kişi sayfasındakinin aynısı (auto-fill, minmax(240px, 1fr)) */}
          <div className="mt-4">
            <KlipAlbumu klipler={klipler} s={s} />
          </div>
        </section>
      </main>
    </div>
  );
}