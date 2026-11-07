import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşeni
import Image from "next/image"; // Büyük kapak için Next.js'in resim bileşeni
import { notFound } from "next/navigation"; // Next.js'in "sayfa bulunamadı" (404) aracı
import { Lora } from "next/font/google"; // Ana sayfadaki serif başlık fontu
import { getAllPeople, getPersonBySlug } from "@/lib/people"; // Herkesi getiren ve slug ile bulan tarifler
import type { Clip } from "@/types"; // Klip kalıbı (embedAdresi ve izleYazisi için)

// Başlık fontu: ana sayfayla aynı Lora. latin-ext: Türkçe harfler için
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// Klibin embed (gömme) adresini üreten tarif
function embedAdresi(klip: Clip): string {
  // Instagram ise: adresin sonuna "embed" ekle → .../reel/KOD/embed
  if (klip.platform === "instagram") {
    return klip.url + "embed";
  }
  // Değilse YouTube: "watch?v=" yerine "embed/" → .../embed/KOD
  return klip.url.replace("watch?v=", "embed/");
}

// Klibin altındaki link yazısını platforma göre üreten tarif
function izleYazisi(klip: Clip): string {
  if (klip.platform === "youtube") {
    return "Klibi YouTube'da izle";
  }
  return "Klibi Instagram'da izle";
}

// Build sırasında hangi kişi sayfalarının önceden üretileceğini söyler (pastane vitrini)
export function generateStaticParams() {
  return getAllPeople().map((kisi) => ({ slug: kisi.slug }));
}

// Kişi sayfası: /kisiler/nevzat-aydin gibi adreslerde açılır
export default async function KisiSayfasi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Adresten slug'ı al
  const kisi = getPersonBySlug(slug); // Slug ile kişiyi bul (find). Bulamazsa undefined

  // Kişi yoksa 404 göster ve burada dur
  if (!kisi) {
    notFound();
  }

  const kapakKlip = kisi.clips[0]; // Üstteki büyük kapak: kişinin ilk klibi
  // Kişinin konuları, tekrarsız: new Set = aynı olanları bir kere tut · [...] = tekrar listeye çevir
  const konular = [...new Set(kisi.clips.map((klip) => klip.topic))];

  return (
    // Bütün sayfa: ana sayfayla aynı krem zemin ve koyu mürekkep yazı
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* Ana sayfayla aynı genişlik ve boşluklar */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Geri dönüş linkleri: gri, üstüne gelince bordo */}
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-stone-500 hover:text-rose-800">
            ← Ana sayfa
          </Link>
          <Link href="/kisiler" className="text-stone-500 hover:text-rose-800">
            ← Tüm kişiler
          </Link>
        </div>

        {/* 1. ÜST KISIM: solda büyük kapak, sağda isim. Telefonda alt alta, orta ekranda yan yana */}
        <header className="mt-6 grid items-end gap-8 border-b-2 border-stone-900 pb-8 md:grid-cols-[minmax(0,18rem)_1fr]">
          {/* Büyük kapak: 9:16 kutu, resim fill ile doldurur. Telefonda ortada ve dar (max-w-xs) */}
          <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-lg bg-stone-900 md:mx-0">
            <Image
              src={kapakKlip.cover} // Kişinin ilk klibinin kapağı
              alt={`${kisi.name}: ${kapakKlip.title}`} // Ekran okuyucu: kişi ve klip başlığı
              fill // Kutuyu doldur
              loading="eager" // İlk ekranda en büyük resim (LCP): hemen yükle
              sizes="(min-width: 768px) 18rem, 20rem" // Kutunun genişliği kadar resim indir
              className="object-cover" // Ezmeden doldur
            />
          </div>

          {/* İsim tarafı */}
          <div>
            {/* Konu etiketleri: kartlardaki gibi bordo, BÜYÜK HARF */}
            <div className="flex flex-wrap gap-2">
              {konular.map((konu) => (
                <span
                  key={konu}
                  className="rounded-full bg-rose-800 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white"
                >
                  {konu}
                </span>
              ))}
            </div>

            {/* Kişinin adı: Lora, çok büyük */}
            <h1 className={`${baslikFontu.className} mt-4 text-5xl font-bold leading-tight sm:text-6xl`}>
              {kisi.name}
            </h1>

            {/* Sosyal medya: sadece linki varsa göster (Adnan ve Abdullah'ta boş, başlık da çıkmasın) */}
            {kisi.links.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {kisi.links.map((link) => (
                  <li key={link}>
                    {/* Dış link: yeni sekmede, rel güvenlik için. Yazıda https:// ve www. görünmesin */}
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm text-stone-600 hover:border-rose-800 hover:text-rose-800"
                    >
                      {link.replace("https://", "").replace("www.", "")}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/* 2. BİO: giriş paragrafı gibi. text-xl: büyük · leading-loose: çok rahat satır aralığı · max-w-3xl: satır çok uzamasın */}
        <p className="mt-8 max-w-3xl text-xl leading-loose text-stone-700 sm:text-2xl sm:leading-loose">
          {kisi.bio}
        </p>

        {/* 3. KLİPLER (2. parçada yatay şeride çevrilecek) */}
        <h2 className={`${baslikFontu.className} mt-12 border-b border-stone-300 pb-2 text-2xl font-bold`}>
          Klipler
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {kisi.clips.map((klip) => (
            <li key={klip.url}>
              <h3 className="mb-2 font-semibold">{klip.title}</h3>
              {/* Embed: klibi sayfanın içinde oynat. 320x570: dikey reel boyutu */}
              <iframe
                src={embedAdresi(klip)}
                title={klip.title}
                width="320"
                height="570"
                className="rounded-lg border border-stone-300 bg-white"
                allowFullScreen
              ></iframe>
              {/* Yedek link: embed yüklenmezse */}
              <a
                href={klip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-rose-800 hover:underline"
              >
                {izleYazisi(klip)}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}