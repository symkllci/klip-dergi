import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import Image from "next/image"; // Öne çıkan kapak için Next.js'in resim bileşeni
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

        {/* Öne çıkan kişi: büyük kapak + konu + hikâye başlığı + alt başlık + kişi · tarih + link */}
        <section className="mt-10">
          <Link
            href={`/kisiler/${oneCikan.slug}`}
            className="group grid overflow-hidden rounded-lg border border-stone-900 bg-white md:grid-cols-2"
          >
            {/* Büyük kapak: öne çıkan klibin kapağı kutuyu doldurur, üstüne gelince hafifçe büyür */}
            {/* loading="eager": ilk ekranda göründüğü için hemen yüklensin (LCP) */}
            <div className="relative h-80 overflow-hidden bg-stone-900 md:h-auto md:min-h-80">
              <Image
                src={oneCikanKlip.cover}
                alt={oneCikanKlip.title}
                fill
                loading="eager"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
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