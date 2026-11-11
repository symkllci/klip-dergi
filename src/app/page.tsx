import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { Lora } from "next/font/google"; // Google Fonts'tan serif (tırnaklı) başlık fontu.
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.
import KlipKarti from "@/components/KlipKarti"; // Ortak kart bileşeni, kişiler sayfası da kullanıyor
import Vitrin from "@/components/Vitrin"; // Kayan vitrin: tarayıcıda çalışan ("use client") bileşen

// Başlık fontu: dergi hissi versin diye serif (kaynak: Next.js Fonts belgesi).
// latin-ext: Türkçe harfler (ş, ğ, ı, İ) için.
// style: hem düz hem italik (eğik) yazı kullanabilmek için. Logo italik, başlıklar düz.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Renkler (Tailwind'in hazır renkleri):
// krem zemin amber-50 · koyu mürekkep stone-900 · bordo vurgu rose-800

// Ana sayfa: sitenin adresi "/" (localhost:3000). Sunucuda hazırlanır, sadece vitrin tarayıcıda çalışır.
export default function Home() {
  const kisiler = getAllPeople(); // Bütün kişileri al (şu an 12).
  const vitrin = kisiler.slice(0, 5); // Vitrin: ilk 5 kişi (0, 1, 2, 3, 4). slice'ın 2. sayısı dahil değil.
  const digerleri = kisiler.slice(5); // Diğer hikâyeler: 5. sıradan sona kadar, vitrinde olmayanlar.
  const one = digerleri[0]; // Öne çıkan: ortadaki büyük kart
  const sol = digerleri.slice(1, 3); // 1 ve 2 numaralı kişiler (sol sütun)
  const sag = digerleri.slice(3, 5); // 3 ve 4 numaralı kişiler (sağ sütun)
  const alt = digerleri.slice(5); // 5'ten sona kadar (alttaki yatay kartlar)

  return (
    // Bütün sayfa: krem zemin (amber-50), koyu mürekkep rengi yazı (stone-900)
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Üst kısım: ortalanmış dergi adı. Lora italik: yumuşak, Colossus'tan farklı bir logo */}
        <header className="border-b-2 border-stone-900 pb-4">
          <h1 className={`${baslikFontu.className} text-center text-5xl font-bold italic sm:text-7xl`}>
            Klip Dergi
          </h1>

          {/* ⭐ Adın altındaki menü: Lora, bordo, ortada, aralarında nokta (dergi künyesi gibi) */}
     <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 whitespace-nowrap font-serif text-sm text-rose-800 sm:gap-x-4 sm:text-lg">
            {/* Sayfa içi bağlantı: aşağıdaki "Diğer hikâyeler" bölümüne iner */}
            <a href="#hikayeler" className="hover:underline">
              Girişimci hikâyeleri
            </a>
            <span className="text-stone-300">·</span>
            <Link href="/kisiler" className="hover:underline">
              Kişiler
            </Link>
            <span className="text-stone-300">·</span>
            {/* Dış bağlantı: yeni sekmede açılır, rel güvenlik için */}
            <a
              href="https://www.instagram.com/viralgirisimci/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Podcast klipleri
            </a>
          </nav>
        </header>

        {/* Vitrin: ilk 5 kişi, ayrı bileşende (src/components/Vitrin.tsx) */}
        <Vitrin kisiler={vitrin} />

        {/* Diğer kişiler: başlık satırı ve kartlar */}
        <section className="mt-14">
          {/* id="hikayeler": menüdeki "Girişimci hikâyeleri" linki buraya iner */}
          <div id="hikayeler" className="mb-6 flex items-baseline justify-between border-b border-stone-300 pb-2">
            <h2 className={`${baslikFontu.className} text-2xl font-bold`}>Diğer hikâyeler</h2>
            <Link href="/kisiler" className="text-sm text-stone-500 hover:text-rose-800 hover:underline">
              Tüm kişiler →
            </Link>
          </div>

          {/* Üst: 3 sütun (geniş ekranda). Ortadaki sütun daha geniş: 1fr · 1.55fr · 1fr */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.55fr_1fr]">
            {/* Sol sütun: 2 küçük kart alt alta */}
            <div className="flex flex-col gap-6">
              {sol.map((kisi) => (
                <KlipKarti key={kisi.slug} kisi={kisi} klip={kisi.clips[0]} />
              ))}
            </div>

            {/* Orta: öne çıkan büyük kart. Telefonda en üstte (order-first) */}
            <div className="order-first lg:order-none">
              <KlipKarti kisi={one} klip={one.clips[0]} boyut="buyuk" />
            </div>

            {/* Sağ sütun: 2 küçük kart alt alta */}
            <div className="flex flex-col gap-6">
              {sag.map((kisi) => (
                <KlipKarti key={kisi.slug} kisi={kisi} klip={kisi.clips[0]} />
              ))}
            </div>
          </div>

          {/* Alt: yatay kartlar, orta ekranda 2 yan yana */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {alt.map((kisi) => (
              <KlipKarti key={kisi.slug} kisi={kisi} klip={kisi.clips[0]} boyut="yatay" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}