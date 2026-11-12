import Image from "next/image"; // Büyük kapak için Next.js'in resim bileşeni
import { notFound } from "next/navigation"; // Next.js'in "sayfa bulunamadı" (404) aracı
import { Lora } from "next/font/google"; // Ana sayfadaki serif başlık fontu
import { getAllPeople, getPersonBySlug } from "@/lib/people"; // Herkesi getiren ve slug ile bulan tarifler
import KlipKarti from "@/components/KlipKarti"; // Diğer kişiler kartları, ana sayfayla aynı
import Kirinti from "@/components/Kirinti"; // Ekmek kırıntısı: nerede olduğunu gösterir
import KlipOynatici from "@/components/KlipOynatici"; //  Klip: önce kapak + ▶, tıklanınca Instagram
import type { Clip } from "@/types"; // Klip kalıbı (izleYazisi için)
import type { Metadata } from "next"; // Sekme başlığı ve paylaşım bilgisinin kalıbı

// Başlık fontu: ana sayfayla aynı Lora. latin-ext: Türkçe harfler için
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// embedAdresi buradan KlipOynatici.tsx'e taşındı (artık onu sadece oynatıcı kullanıyor)

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
        {/* Ekmek kırıntısı: Ana sayfa › Kişiler › (kişinin adı = buradasın, href yok → bordo) */}
        <Kirinti adimlar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Kişiler", href: "/kisiler" }, { ad: kisi.name }]} />

        {/* 1. ÜST KISIM: solda büyük görsel (fotoğraf ya da kapak), sağda isim. Telefonda alt alta, orta ekranda yan yana */}
        <header className="mt-6 grid items-end gap-8 border-b-2 border-stone-900 pb-8 md:grid-cols-[minmax(0,18rem)_1fr]">
          {/*  Büyük görsel: Wikipedia fotoğrafı varsa o, yoksa reel kapağı. İkisi de siyah-beyaz (grayscale) */}
          {/* figure = görsel + altındaki açıklama (atıf) bir arada. Telefonda ortada ve dar (max-w-xs) */}
          <figure className="mx-auto w-full max-w-xs md:mx-0">
            {kisi.photo ? (
              // Fotoğraf varsa: kendi boyutuyla (width/height Commons'tan geldi), kırpılmadan
              <Image
                src={kisi.photo.src} // public/fotograflar'daki dosya
                alt={`${kisi.name} fotoğrafı`} // Ekran okuyucu için
                width={kisi.photo.width} // 960
                height={kisi.photo.height} // ör. 1242: oranı bilsin, sayfa kaymasın
                loading="eager" // İlk ekranda en büyük resim (LCP): hemen yükle
                sizes="(min-width: 768px) 18rem, 20rem" // Kutunun genişliği kadar resim indir
                className="h-auto w-full rounded-lg grayscale" // Tam genişlik, boy orana göre, siyah-beyaz
              />
            ) : (
              // Fotoğraf yoksa (6 kişi): yedek olarak reel kapağı, 9:16 kutuda
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-stone-900">
                <Image
                  src={kapakKlip.cover} // Kişinin ilk klibinin kapağı
                  alt={`${kisi.name}: ${kapakKlip.title}`} // Ekran okuyucu: kişi ve klip başlığı
                  fill // Kutuyu doldur
                  loading="eager" // İlk ekranda en büyük resim (LCP): hemen yükle
                  sizes="(min-width: 768px) 18rem, 20rem" // Kutunun genişliği kadar resim indir
                  className="object-cover grayscale" // Ezmeden doldur, siyah-beyaz
                />
              </div>
            )}

            {/*  Atıf: sadece fotoğraf varsa (&&). Fotoğrafçı · lisans · kaynak · siyah-beyaz yapıldı */}
            {kisi.photo && (
              <figcaption className="mt-2 text-xs leading-relaxed text-stone-500">
                Fotoğraf: {kisi.photo.author} ·{" "}
                {/* Lisans linki varsa tıklanır, yoksa düz yazı (kamu malında link yok) */}
                {kisi.photo.licenseUrl ? (
                  <a
                    href={kisi.photo.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-rose-800"
                  >
                    {kisi.photo.license}
                  </a>
                ) : (
                  kisi.photo.license
                )}{" "}
                ·{" "}
                {/* Kaynak: fotoğrafın Commons sayfası */}
                <a
                  href={kisi.photo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-rose-800"
                >
                  Wikimedia Commons
                </a>{" "}
                · siyah-beyaz yapıldı
              </figcaption>
            )}
          </figure>

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

            {/* Kanca: isimden sonra tek cümle (hocanın slaytı) */}
            <p className="mt-4 max-w-xl font-serif text-xl italic leading-relaxed text-stone-600">{kisi.dek}</p>

            {/* Sosyal medya: yazı yerine yuvarlak Instagram ikonu (Footer'daki gibi). Linki yoksa hiç çıkmaz */}
            {kisi.links.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3">
                {kisi.links.map((link) => (
                  <li key={link}>
                    {/* Dış link: yeni sekmede, rel güvenlik için. Yazı yok → aria-label ekran okuyucuya söyler */}
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${kisi.name} Instagram'da`}
                      title="Instagram"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-700 transition-colors hover:border-rose-800 hover:bg-rose-800 hover:text-white"
                    >
                      {/* Instagram ikonu: yuvarlak köşeli kare + daire + küçük nokta. currentColor = yazı rengini al */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
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

        {/* 3. KLİPLER: dergi tarzı (B) · numara, konu, başlık, kapak, hap buton, kaynak */}
        <h2 className={`${baslikFontu.className} mt-12 border-b border-stone-300 pb-2 text-2xl font-bold`}>
          Klipler
        </h2>
        {/* flex: yan yana · overflow-x-auto: yatayda kaydır · snap-x snap-mandatory: her klibe otur · gap-6: aralık · pb-4: çubuk yapışmasın */}
        <ul className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {kisi.clips.map((klip, sira) => (
            // shrink-0: küçülme · snap-start: sol kenarı şeride otursun · w-[320px]: her klip reel genişliğinde
            <li key={klip.url} className="w-[320px] shrink-0 snap-start">
              {/*  Dergi numarası: sira 0'dan başlar → +1 ile 01, 02 */}
              <p className="font-serif text-5xl italic text-rose-800">0{sira + 1}</p>
              {/* Klibin konusu */}
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</p>
              {/*  Başlık: Lora, büyük. min-h-14 = en az 2 satırlık yer → bütün kapaklar aynı hizadan başlar */}
              <h3 className="mb-3 mt-1 min-h-14 font-serif text-xl font-bold leading-snug">{klip.title}</h3>
              {/* Klip: önce kapak + ▶, tıklanınca Instagram yüklenir (sayfa hızlı açılsın) */}
              <KlipOynatici klip={klip} />
              {/*  Yedek link: hap buton + Instagram ikonu. Fare gelince bordo dolar */}
              <a
                href={klip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-1.5 text-sm text-stone-600 transition-colors hover:border-rose-800 hover:bg-rose-800 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                {izleYazisi(klip)} ↗
              </a>
              {/* ⭐ Kaynak: klibin kesildiği bölüm (hocanın listesi). Sadece varsa (&&): 4 klipte yok */}
              {klip.source && (
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  Kaynak:{" "}
                  <a
                    href={klip.source.episodeUrl} // Bölümün YouTube linki
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-rose-800"
                  >
                    {klip.source.episodeTitle}
                  </a>{" "}
                  ↗
                </p>
              )}
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