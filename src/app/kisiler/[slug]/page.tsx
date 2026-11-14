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

        {/* ===== GAZETE SAYFASI (Maket E) ===== */}

        {/* 1. KÜNYE ŞERİDİ: üstte tek kalın çizgi. Solda PROFİL, ortada KLİP DERGİ, sağda konu */}
        <div className="mt-6 flex items-center justify-between border-t-2 border-stone-900 pt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-600 sm:text-xs">
          <span>Profil</span>
          <span className="hidden sm:inline">Klip Dergi</span>
          <span className="text-rose-800">{kapakKlip.topic}</span>
        </div>

        {/* 2. MANŞET: ortada dev isim + kanca */}
        <header className="py-10 text-center">
          {/* Kişinin adı: Lora, telefonda 5xl, büyük ekranda 7xl */}
          <h1 className={`${baslikFontu.className} text-5xl font-bold leading-tight sm:text-7xl`}>{kisi.name}</h1>
          {/* Kanca: isimden sonra tek cümle */}
          <p className="mx-auto mt-3 max-w-2xl font-serif text-lg italic leading-relaxed text-stone-600 sm:text-xl">{kisi.dek}</p>
        </header>

        {/* 3. İKİ SÜTUN: telefonda alt alta · orta ekrandan itibaren solda fotoğraf (4), sağda yazı (8). 4 + 8 = 12 */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* 3a. SOL: fotoğraf + atıf */}
          {/* figure = görsel + altındaki açıklama (atıf) bir arada. Telefonda ortada ve dar (max-w-xs) */}
          <figure className="mx-auto w-full max-w-xs md:col-span-4 md:max-w-none">
            {kisi.photo ? (
              // Fotoğraf varsa: kendi boyutuyla (width/height Commons'tan geldi), kırpılmadan
              <Image
                src={kisi.photo.src} // public/fotograflar'daki dosya
                alt={`${kisi.name} fotoğrafı`} // Ekran okuyucu için
                width={kisi.photo.width} // 960
                height={kisi.photo.height} // ör. 1242: oranı bilsin, sayfa kaymasın
                loading="eager" // İlk ekranda en büyük resim (LCP): hemen yükle
                sizes="(min-width: 768px) 22rem, 20rem" // Kutunun genişliği kadar resim indir
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
                  sizes="(min-width: 768px) 22rem, 20rem" // Kutunun genişliği kadar resim indir
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

          {/* 3b. SAĞ: biyografi + alıntılar + editör satırı */}
          <article className="md:col-span-8">
            {/* BİO: tek sütun, Lora, rahat satır aralığı */}
            {/* first-letter: ilk harf büyük, kalın, bordo, sola yaslı (float-left) → yazı etrafından akar */}
            <p className="font-serif text-xl leading-loose text-stone-700 first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-none first-letter:text-rose-800">
              {kisi.bio}
            </p>

            {/* ⭐ ALINTILAR: her klibin alıntısı, büyük ve ortada. Altında hangi klipten olduğu yazılı */}
            {/* filter: sadece alıntısı olan klipler (Aykut, Efe, Mark'ta yok → bu kısım hiç çıkmaz) */}
            {kisi.clips
              .filter((klip) => klip.quote)
              .map((klip) => (
                <figure key={klip.url} className="mt-10">
                  {/* Çizgi yerine büyük bordo tırnak işareti (süs, ekran okuyucu okumasın: aria-hidden) */}
                  <span aria-hidden="true" className="block font-serif text-6xl leading-none text-rose-800">“</span>
                  {/* blockquote = "bu başkasının sözü" diyen etiket */}
                  <blockquote className="-mt-4 font-serif text-2xl italic leading-relaxed text-stone-800">{klip.quote}</blockquote>
                  {/* Kimin sözü, hangi klip: KLİP 02 gibi. indexOf = klibin listedeki sırası (0'dan başlar → +1) */}
                  <figcaption className="mt-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
                    {kisi.name} · Klip 0{kisi.clips.indexOf(klip) + 1}: {klip.title}
                  </figcaption>
                </figure>
              ))}

            {/* ⭐ Editör satırı: biyografiyi kim hazırladı, en son ne zaman güncellendi */}
            {/* time = makinenin okuyacağı tarih (dateTime) + insanın okuyacağı tarih (14 Kasım 2026) */}
            <p className="mt-10 text-xs uppercase tracking-widest text-stone-500">
              Editör: {kisi.editor} · Güncellendi:{" "}
              <time dateTime={kisi.updatedAt}>
                {new Date(kisi.updatedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
              </time>
            </p>

            {/* Sosyal medya: yuvarlak Instagram ikonu. Linki yoksa hiç çıkmaz */}
            {kisi.links.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-3">
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
          </article>

        </div>

        {/* 4. KLİPLER: tam genişlik, yatay şerit. Her klip 320px (oynatıcı bu genişlikte rahat sığıyor) */}
        <section className="mt-16">
          {/* Başlık: KLİPLER · 2 (kaç klip olduğu) */}
          <h2 className={`${baslikFontu.className} text-2xl font-bold`}>
            Klipler <span className="text-rose-800">· {kisi.clips.length}</span>
          </h2>
          {/* flex: yan yana · overflow-x-auto: yatayda kaydır · snap: her klibe otur · gap-6: aralık */}
          <ul className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
            {kisi.clips.map((klip, sira) => (
              // shrink-0: küçülme · snap-start: sol kenarı şeride otursun · w-[320px]: her klip reel genişliğinde
              <li key={klip.url} className="w-[320px] shrink-0 snap-start">
                {/*  Dergi numarası + konu yan yana */}
                <p className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl italic text-rose-800">0{sira + 1}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</span>
                </p>
                {/*  Başlık: min-h-14 = 2 satırlık yer → bütün kapaklar aynı hizadan başlar */}
                <h3 className="mb-3 mt-1 min-h-14 font-serif text-xl font-bold leading-snug">{klip.title}</h3>
                {/* Klip: önce kapak + ▶, tıklanınca Instagram yüklenir (sayfa hızlı açılsın) */}
                <KlipOynatici klip={klip} />
                {/*  Yedek link: küçük, altı çizili */}
                <a
                  href={klip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-stone-600 underline hover:text-rose-800"
                >
                  {izleYazisi(klip)} ↗
                </a>
                {/* ⭐ Kaynak: klibin kesildiği bölüm. Sadece varsa (&&): 4 klipte yok */}
                {klip.source && (
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">
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
        </section>

        {/* 5. DİĞER KİŞİLER: 3 KlipKarti (ana sayfadakiyle aynı kart) */}
        <h2 className={`${baslikFontu.className} mt-16 text-2xl font-bold`}>
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