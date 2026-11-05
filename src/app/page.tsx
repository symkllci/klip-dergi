import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { Lora } from "next/font/google"; // Google Fonts'tan serif (tırnaklı) başlık fontu.
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.
import type { Person } from "@/types"; // Kişi kalıbı (kart bileşeninin tipi için).

// Başlık fontu: dergi hissi versin diye serif (kaynak: Next.js Fonts belgesi).
// latin-ext: Türkçe harfler (ş, ğ, ı, İ) için.
// style: hem düz hem italik (eğik) yazı kullanabilmek için. Logo italik, başlıklar düz.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Renkler (Tailwind'in hazır renkleri):
// krem zemin amber-50 · koyu mürekkep stone-900 · bordo vurgu rose-800

// Kişinin adından baş harflerini çıkaran tarif. Fotoğraf yerine kullanıyoruz (telif).
// "Nevzat Aydın" → ["Nevzat", "Aydın"] → ["N", "A"] → "NA"
function basHarfler(ad: string): string {
  return ad
    .split(" ") // Adı boşluklardan kes, kelime listesi yap.
    .map((kelime) => kelime[0]) // Her kelimenin ilk harfini al.
    .join(""); // Harfleri yan yana birleştir.
}

// Tarihi Türkçe uzun biçime çeviren tarif (girisimler.net'teki "10 Şubat 2025" gibi).
// "2026-09-24" → "24 Eylül 2026"
function tarihYaz(tarih: string): string {
  return new Date(tarih).toLocaleDateString("tr-TR", {
    day: "numeric", // gün: 24
    month: "long", // ay: Eylül (uzun adıyla)
    year: "numeric", // yıl: 2026
  });
}

// Küçük hikâye kartı: bir kişi verilir, tıklanabilir bir kart çıkar.
// group / group-hover: kartın üstüne gelince içindeki kutu ve başlık bordoya döner (Colossus'taki renklenme fikri).
function HikayeKarti({ kisi }: { kisi: Person }) {
  const klip = kisi.clips[0]; // Kartta kişinin ilk klibini anlatıyoruz.

  return (
    <Link
      href={`/kisiler/${kisi.slug}`}
      className="group block overflow-hidden rounded-lg border border-stone-300 bg-white transition-colors hover:border-rose-800"
    >
      {/* Görsel yerine baş harf kutusu: normalde gri, üstüne gelince bordo */}
      <div
        className={`${baslikFontu.className} flex h-36 items-center justify-center bg-stone-200 text-5xl text-stone-500 transition-colors group-hover:bg-rose-800 group-hover:text-white`}
      >
        {basHarfler(kisi.name)}
      </div>

      <div className="p-4 text-center">
        {/* Konu etiketi: başlığın üstünde (girisimler.net'teki kategori etiketi fikri) */}
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</p>
        {/* Hikâye anlatan başlık: kişinin ilk klibinin başlığı */}
        <h3 className={`${baslikFontu.className} mt-1 text-xl font-bold leading-snug transition-colors group-hover:text-rose-800`}>
          {klip.title}
        </h3>
        {/* Alt yazı: biyografinin ilk cümlesi */}
        <p className="mt-2 text-sm text-stone-600">{kisi.bio.split(". ")[0]}.</p>
        {/* İnce ayırıcı çizgi, altında "kişi · tarih" satırı (dergideki yazar satırı gibi) */}
        <div className="mx-auto mt-3 w-20 border-t border-stone-300" />
        <p className="mt-2 text-xs text-stone-500">
          {kisi.name} · {tarihYaz(klip.publishedAt)}
        </p>
      </div>
    </Link>
  );
}

// Ana sayfa: sitenin adresi "/" (localhost:3000)
export default function Home() {
  const kisiler = getAllPeople(); // 5 kişiyi al.
  const oneCikan = kisiler[0]; // Listenin ilk kişisi en üstte, büyük.
  const oneCikanKlip = oneCikan.clips[0]; // Öne çıkan kişinin ilk klibi.
  const digerleri = kisiler.slice(1); // slice(1): ilk kişi hariç geri kalanlar.

  return (
    // Bütün sayfa: krem zemin (amber-50), koyu mürekkep rengi yazı (stone-900)
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Üst kısım: ortalanmış dergi adı. Lora italik: yumuşak, Colossus'tan farklı bir logo */}
        <header className="border-b-2 border-stone-900 pb-4">
          <h1 className={`${baslikFontu.className} text-center text-5xl font-bold italic sm:text-7xl`}>
            Klip Dergi
          </h1>
          {/* Adın altındaki ince menü satırı */}
          <nav className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest">
            <span className="text-stone-500">Girişimci hikâyeleri</span>
            <Link href="/kisiler" className="font-semibold text-rose-800 hover:underline">
              Kişiler
            </Link>
            <span className="text-stone-500">Podcast klipleri</span>
          </nav>
        </header>

        {/* Öne çıkan kişi: büyük kutu + konu + hikâye başlığı + alt başlık + kişi · tarih + link */}
        <section className="mt-10">
          <Link
            href={`/kisiler/${oneCikan.slug}`}
            className="group grid overflow-hidden rounded-lg border border-stone-900 bg-white md:grid-cols-2"
          >
            {/* Büyük baş harf kutusu: koyu, üstüne gelince bordo */}
            <div
              className={`${baslikFontu.className} flex h-64 items-center justify-center bg-stone-900 text-8xl text-amber-50 transition-colors group-hover:bg-rose-800 md:h-auto md:min-h-80`}
            >
              {basHarfler(oneCikan.name)}
            </div>

            <div className="flex flex-col justify-center p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">
                Öne çıkan · {oneCikanKlip.topic}
              </p>
              {/* Hikâye anlatan büyük başlık */}
              <h2 className={`${baslikFontu.className} mt-3 text-4xl font-bold leading-tight lg:text-5xl`}>
                {oneCikanKlip.title}
              </h2>
              {/* Bir cümlelik alt başlık */}
              <p className="mt-4 text-lg text-stone-600">{oneCikan.bio.split(". ")[0]}.</p>
              {/* Kişi · tarih satırı */}
              <p className="mt-4 text-sm text-stone-500">
                {oneCikan.name} · {tarihYaz(oneCikanKlip.publishedAt)}
              </p>
              {/* Kişi sayfasına link yazısı */}
              <p className="mt-6 text-sm font-semibold uppercase tracking-wider transition-colors group-hover:text-rose-800">
                Hikâyeyi oku →
              </p>
            </div>
          </Link>
        </section>

        {/* Diğer kişiler: başlık satırı ve kartlar */}
        <section className="mt-14">
          <div className="mb-6 flex items-baseline justify-between border-b border-stone-300 pb-2">
            <h2 className={`${baslikFontu.className} text-2xl font-bold`}>Diğer hikâyeler</h2>
            <Link href="/kisiler" className="text-sm text-stone-500 hover:text-rose-800 hover:underline">
              Tüm kişiler →
            </Link>
          </div>

          {/* Telefonda alt alta, orta ekranda 2, geniş ekranda 4 kart yan yana */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {digerleri.map((kisi) => (
              <li key={kisi.slug}>
                <HikayeKarti kisi={kisi} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}