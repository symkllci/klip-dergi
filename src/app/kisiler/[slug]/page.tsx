import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşeni
import Image from "next/image"; // Büyük kapak için Next.js'in resim bileşeni
import { notFound } from "next/navigation"; // Next.js'in "sayfa bulunamadı" (404) aracı
import { Lora } from "next/font/google"; // Ana sayfadaki serif başlık fontu
import { getAllPeople, getPersonBySlug } from "@/lib/people"; // Herkesi getiren ve slug ile bulan tarifler
import KlipKarti from "@/components/KlipKarti"; // Diğer kişiler kartları, ana sayfayla aynı
import type { Clip } from "@/types"; // Klip kalıbı (embedAdresi ve izleYazisi için)
import type { Metadata } from "next"; // Sekme başlığı ve paylaşım bilgisinin kalıbı

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

// Sekme başlığı, açıklama ve paylaşım görseli: her kişi için ayrı
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Adresteki kişi kodu (ör. hamdi-ulukaya)
  const kisi = getPersonBySlug(slug); // O kişiyi bul
  if (!kisi) return {}; // Kişi yoksa boş bırak

  const kapak = kisi.clips[0]?.cover; // İlk klibin kapağı = paylaşım görseli

  return {
    title: kisi.name, // Kalıptaki %s yerine geçer → "Hamdi Ulukaya · Klip Dergi"
    description: kisi.bio, // Google'da ve paylaşımda görünen açıklama
    openGraph: {
      title: `${kisi.name} · Klip Dergi`, // WhatsApp önizlemesindeki başlık
      description: kisi.bio,
      images: kapak ? [kapak] : [], // WhatsApp önizlemesindeki resim
    },
  };
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

  // Diğer kişiler: önce AYNI KONUDAKİLER, yer kalırsa geri kalanlar (en fazla 3 kişi)
  const tumKisiler = getAllPeople(); // Bütün kişiler (12)

  // 1) Aynı konudakiler: kendisi olmayan VE en az bir klibinin konusu bu kişinin konularında geçenler
  const ayniKonu = tumKisiler.filter((k) => k.slug !== kisi.slug && k.clips.some((klip) => konular.includes(klip.topic)));

  // 2) Geri kalanlar: kendisi olmayan VE aynı konudakiler listesinde OLMAYANLAR (! = değil)
  const geriKalan = tumKisiler.filter((k) => k.slug !== kisi.slug && !ayniKonu.includes(k));

  // 3) Önce aynı konudakiler, arkasından geri kalanlar; ilk 3 kişiyi al
  // [...a, ...b] = iki listeyi uç uca ekle (iki treni birleştirmek gibi) · slice(0, 3) = ilk 3
  const digerKisiler = [...ayniKonu, ...geriKalan].slice(0, 3);

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
            {/* Konu etiketi: tek, büyük kapaktaki klibin konusu */}
            <span className="rounded-full bg-rose-800 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              {kapakKlip.topic}
            </span>

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

        {/* 2. BİO: giriş paragrafı gibi. Lora (font-serif), büyük, rahat satır aralığı, max-w-3xl: satır çok uzamasın */}
        {/* first-letter: ilk harf büyük (7xl), kalın, bordo, sola yaslı (float-left) → yazı etrafından akar (dergi tarzı) */}
        <p className="font-serif mt-8 max-w-3xl text-xl leading-loose text-stone-700 sm:text-2xl sm:leading-loose first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-none first-letter:text-rose-800">
          {kisi.bio}
        </p>

        {/* 3. KLİPLER: yatay kayan şerit (Perşembe'deki vitrin gibi, yalnız CSS) */}
        <h2 className={`${baslikFontu.className} mt-12 border-b border-stone-300 pb-2 text-2xl font-bold`}>
          Klipler
        </h2>
        {/* flex: yan yana · overflow-x-auto: yatayda kaydır · snap-x snap-mandatory: her klibe otur · gap-6: aralık · pb-4: çubuk yapışmasın */}
        <ul className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {kisi.clips.map((klip) => (
            // shrink-0: küçülme · snap-start: sol kenarı şeride otursun · w-[320px]: her klip reel genişliğinde
            <li key={klip.url} className="w-[320px] shrink-0 snap-start">
              {/* Klibin konusu ve başlığı */}
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</p>
              <h3 className="mb-3 mt-1 font-semibold leading-snug">{klip.title}</h3>
              {/* Embed: klibi sayfanın içinde oynat. 320x570: dikey reel boyutu */}
              <iframe
                src={embedAdresi(klip)} // Instagram'ın gömme adresi
                title={klip.title} // Ekran okuyucu için pencerenin adı
                width="320"
                height="570"
                className="rounded-lg border border-stone-300 bg-white"
                allowFullScreen // Tam ekrana izin ver
              ></iframe>
              {/* Yedek link: embed yüklenmezse ziyaretçi buradan izlesin */}
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

        {/* 4. DİĞER KİŞİLER: 3 KlipKarti (ana sayfadakiyle aynı kart) */}
        <h2 className={`${baslikFontu.className} mt-12 border-b border-stone-300 pb-2 text-2xl font-bold`}>
          Diğer kişiler
        </h2>
        {/* Telefonda alt alta, orta ekranda 3 yan yana */}
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {digerKisiler.map((diger) => (
            <li key={diger.slug}>
              <KlipKarti kisi={diger} klip={diger.clips[0]} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}