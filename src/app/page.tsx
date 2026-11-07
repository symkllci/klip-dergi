import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import Image from "next/image"; // Vitrin kapakları için Next.js'in resim bileşeni
import { Lora } from "next/font/google"; // Google Fonts'tan serif (tırnaklı) başlık fontu.
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.
import KlipKarti from "@/components/KlipKarti"; // Ortak kart bileşeni, kişiler sayfası da kullanıyor

// Başlık fontu: dergi hissi versin diye serif (kaynak: Next.js Fonts belgesi).
// latin-ext: Türkçe harfler (ş, ğ, ı, İ) için.
// style: hem düz hem italik (eğik) yazı kullanabilmek için. Logo italik, başlıklar düz.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Renkler (Tailwind'in hazır renkleri):
// krem zemin amber-50 · koyu mürekkep stone-900 · bordo vurgu rose-800

// Tarihi Türkçe uzun biçime çeviren tarif (girisimler.net'teki "10 Şubat 2025" gibi).
// "2026-09-24" → "24 Eylül 2026"
function tarihYaz(tarih: string): string {
  return new Date(tarih).toLocaleDateString("tr-TR", {
    day: "numeric", // gün: 24
    month: "long", // ay: Eylül (uzun adıyla)
    year: "numeric", // yıl: 2026
  });
}

// Ana sayfa: sitenin adresi "/" (localhost:3000)
export default function Home() {
  const kisiler = getAllPeople(); // Bütün kişileri al (şu an 12).
  const vitrin = kisiler.slice(0, 5); // Vitrin: ilk 5 kişi (0, 1, 2, 3, 4). slice'ın 2. sayısı dahil değil.
  const digerleri = kisiler.slice(5); // Diğer hikâyeler: 5. sıradan sona kadar, vitrinde olmayanlar.

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
            {/* Sayfa içi bağlantı: aşağıdaki "Diğer hikâyeler" bölümüne iner */}
            <a href="#hikayeler" className="text-stone-500 hover:text-rose-800">
              Girişimci hikâyeleri
            </a>
            <Link href="/kisiler" className="font-semibold text-rose-800 hover:underline">
              Kişiler
            </Link>
            {/* Dış bağlantı: yeni sekmede açılır, rel güvenlik için */}
            <a
              href="https://www.instagram.com/viralgirisimci/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-rose-800"
            >
              Podcast klipleri
            </a>
          </nav>
        </header>

        {/* Vitrin: 5 hikâye yan yana, yatay kayan şerit (yalnız CSS, JavaScript yok) */}
        <section className="mt-10">
          {/* flex: yan yana diz · overflow-x-auto: yatayda kaydır · snap-x snap-mandatory: her kaydırmada bir hikâyeye otur */}
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {vitrin.map((kisi, sira) => {
              const klip = kisi.clips[0]; // Bu hikâyede kişinin ilk klibi
              return (
                // w-full shrink-0: her hikâye şeridin tam genişliği kadar, küçülmesin · snap-start: sol kenarı şeride otursun
                <Link
                  key={kisi.slug}
                  href={`/kisiler/${kisi.slug}`}
                  className="group grid w-full shrink-0 snap-start overflow-hidden rounded-lg border border-stone-900 bg-white md:grid-cols-2"
                >
                  {/* Büyük kapak: kutuyu doldurur, üstüne gelince hafifçe büyür */}
                  <div className="relative h-80 overflow-hidden bg-stone-900 md:h-auto md:min-h-80">
                    <Image
                      src={klip.cover}
                      alt={klip.title}
                      fill
                      // Sadece ilk hikâye ilk ekranda: o hemen (eager), diğerleri tembel (lazy) yüklensin (LCP)
                      loading={sira === 0 ? "eager" : "lazy"}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">
                      Öne çıkan · {klip.topic}
                    </p>
                    {/* Hikâye anlatan büyük başlık */}
                    <h2 className={`${baslikFontu.className} mt-3 text-4xl font-bold leading-tight lg:text-5xl`}>
                      {klip.title}
                    </h2>
                    {/* Bir cümlelik alt başlık */}
                    <p className="mt-4 text-lg text-stone-600">{kisi.bio.split(". ")[0]}.</p>
                    {/* Kişi · tarih satırı */}
                    <p className="mt-4 text-sm text-stone-500">
                      {kisi.name} · {tarihYaz(klip.publishedAt)}
                    </p>
                    {/* Kişi sayfasına link yazısı */}
                    <p className="mt-6 text-sm font-semibold uppercase tracking-wider transition-colors group-hover:text-rose-800">
                      Hikâyeyi oku →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Diğer kişiler: başlık satırı ve kartlar */}
        <section className="mt-14">
          {/* id="hikayeler": menüdeki "Girişimci hikâyeleri" linki buraya iner */}
          <div id="hikayeler" className="mb-6 flex items-baseline justify-between border-b border-stone-300 pb-2">
            <h2 className={`${baslikFontu.className} text-2xl font-bold`}>Diğer hikâyeler</h2>
            <Link href="/kisiler" className="text-sm text-stone-500 hover:text-rose-800 hover:underline">
              Tüm kişiler →
            </Link>
          </div>

          {/* Telefonda alt alta, orta ekranda 2, geniş ekranda 4 kart yan yana */}
          {/* Her kart KlipKarti: kişinin ilk klibinin kapağı, başlığı ve konusu */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {digerleri.map((kisi) => (
              <li key={kisi.slug}>
                <KlipKarti kisi={kisi} klip={kisi.clips[0]} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}