import Image from "next/image"; // Büyük kapak için Next.js'in resim bileşeni
import Link from "next/link"; // Site içi sayfalara geçiş ("Tüm kişiler" linki)
import { notFound } from "next/navigation"; // Next.js'in "sayfa bulunamadı" (404) aracı
import { Lora } from "next/font/google"; // Ana sayfadaki serif başlık fontu
import { getAllPeople, getPersonBySlug } from "@/lib/people"; // Herkesi getiren ve slug ile bulan tarifler
import HikayeKarti from "@/components/HikayeKarti"; // Diğer kişiler kartları: ana sayfadaki kutusuz dergi kartı
import Kirinti from "@/components/Kirinti"; // Ekmek kırıntısı: nerede olduğunu gösterir
import PaylasDugmesi from "@/components/PaylasDugmesi"; // Paylaş: telefonda sistem menüsü, bilgisayarda linki kopyala
import KlipAlbumu from "@/components/KlipAlbumu"; // Klipler albümü (oynatıcı + başlık + kaynak + Instagram glifi)
import HaberlerBolumu from "@/components/HaberlerBolumu"; // Haberlerde: kişinin iş haberleri (en fazla 3, editör onaylı)
import InstagramGlifi from "@/components/InstagramGlifi"; // Instagram'ın resmî tek renk glifi (Meta marka sayfasından)
import type { Metadata } from "next"; // Sekme başlığı ve paylaşım bilgisinin kalıbı
import { dilAdresleri, dilAl, getSozluk, klipSayisi, yol } from "@/lib/sozluk"; // Dil, sözlük, klip sayısı, dile göre adres

// Başlık fontu: ana sayfayla aynı Lora. latin-ext: Türkçe harfler için
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// embedAdresi buradan KlipOynatici.tsx'e taşındı (artık onu sadece oynatıcı kullanıyor)

// Build sırasında hangi kişi sayfalarının önceden üretileceğini söyler (pastane vitrini)
export async function generateStaticParams() {
  return (await getAllPeople()).map((kisi) => ({ slug: kisi.slug }));
}

// Sekme başlığı, açıklama ve paylaşım görseli: her kişi için ayrı
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params; // Adresteki dil ve kişi kodu (ör. en, hamdi-ulukaya)
  const dil = dilAl(lang); // "tr" ya da "en"
  const s = getSozluk(dil); // O dilin sözlüğü
  const kisi = await getPersonBySlug(slug, dil); // O kişiyi bul (biyografisi o dilde)
  if (!kisi) return {}; // Kişi yoksa boş bırak

  const kapak = kisi.clips[0]?.cover; // İlk klibin kapağı = paylaşım görseli

  return {
    title: kisi.name, // Kalıptaki %s yerine geçer → "Hamdi Ulukaya · Klip Dergi"
    description: kisi.bio, // Google'da ve paylaşımda görünen açıklama
    alternates: dilAdresleri(dil, `/kisiler/${slug}`), // hreflang: bu kişinin TR ve EN sayfaları
    openGraph: {
      title: `${kisi.name} · ${s.genel.siteAdi}`, // WhatsApp önizlemesindeki başlık
      description: kisi.bio,
      images: kapak ? [kapak] : [], // WhatsApp önizlemesindeki resim
    },
  };
}

// Kişi sayfası: /kisiler/nevzat-aydin gibi adreslerde açılır
export default async function KisiSayfasi({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params; // Adresten dili ve slug'ı al
  const dil = dilAl(lang); // "tr" ya da "en"
  const s = getSozluk(dil); // O dilin sözlüğü
  const kisi = await getPersonBySlug(slug, dil); // Slug ile kişiyi bul (find), biyografisi o dilde. Bulamazsa undefined

  // Kişi yoksa 404 göster ve burada dur
  if (!kisi) {
    notFound();
  }

  const kapakKlip = kisi.clips[0]; // Üstteki büyük kapak: kişinin ilk klibi
  // Kişinin konuları, tekrarsız: new Set = aynı olanları bir kere tut · [...] = tekrar listeye çevir
  const konular = [...new Set(kisi.clips.map((klip) => klip.topic))];

  // Diğer kişiler: önce AYNI KONUDAKİLER, yer kalırsa geri kalanlar (en fazla 3 kişi)
  const tumKisiler = await getAllPeople(dil); // Bütün kişiler (12), kancaları o dilde

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
      {/* GENİŞLİK (ana sayfayla aynı mantık): sayfa tam genişlik, yanlarda clamp(16px, 3.2vw, 56px) boşluk.
          Fotoğraf (max-w-4xl) ve yazı (max-w-3xl) ortada dar: çok uzun satır okumayı zorlaştırır.
          Gazete gibi: yazı sütunu dar, görseller ve bölüm çizgileri geniş */}
      <main className="px-[clamp(16px,3.2vw,56px)] py-10">
        {/* Ekmek kırıntısı: Ana sayfa › Kişiler › (kişinin adı = buradasın, href yok → bordo) */}
        <Kirinti
          etiket={s.kirinti.etiket}
          adimlar={[{ ad: s.genel.anaSayfa, href: yol(dil, "/") }, { ad: s.genel.kisiler, href: yol(dil, "/kisiler") }, { ad: kisi.name }]}
        />

        {/* ===== GAZETE SAYFASI (Maket E) ===== */}

        {/* Künye şeridi (çizgi + PROFİL · KLİP DERGİ · konu) kaldırıldı: üstte sadece ekmek kırıntısı */}

        {/* 2. YATAY FOTOĞRAF: ismin ÜSTÜNDE, 3:2 oranında (fotoğraf makinesi oranı). Dikey portrelerde 16:9'dan az kırpar.
            max-w-4xl: çok büyümesin, isim ilk ekranda görünsün */}
        <figure className="mx-auto mt-8 max-w-4xl">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-stone-900">
            <Image
              src={kisi.photo ? kisi.photo.src : kapakKlip.cover}
              alt={kisi.photo ? `${kisi.name} ${s.kisiSayfasi.fotografi}` : `${kisi.name}: ${kapakKlip.title}`}
              fill // Kutuyu doldur
              loading="eager" // İlk ekranda en büyük resim (LCP): hemen yükle
              fetchPriority="high" // Önce bu görseli indir
              sizes="(min-width: 896px) 896px, 100vw" // max-w-4xl = 896px
              // 📚 MDN object-position: "replaced element'in içeriğinin kutu içinde nereye hizalanacağı". Varsayılan 50% 50% (orta).
              // 1. değer yatay, 2. değer dikey. Yüz her fotoğrafta başka yerde → değer VERİDEN (photo.focus).
              // Tailwind sınıfı (object-[50%_20%]) veriden gelen değerle ÇALIŞMAZ: Tailwind sınıfları kod yazılırken hazırlanır,
              // veri sonradan gelir → style={{ objectPosition }} ile doğrudan CSS veriyoruz.
              // Fotoğraf yoksa reel kapağı: biraz büyüt (yan çerçeve dışarıda kalsın), dikeyde %45 (yüz ortada)
              style={{ objectPosition: kisi.photo ? (kisi.photo.focus ?? "50% 25%") : "50% 45%" }}
              className={`object-cover grayscale ${kisi.photo ? "" : "scale-[1.15]"}`}
            />
          </div>

          {/* Atıf: sadece fotoğraf varsa (&&). Fotoğrafçı · lisans · kaynak · siyah-beyaz yapıldı */}
          {kisi.photo && (
            <figcaption className="mt-2 text-right text-xs leading-relaxed text-stone-500">
              {s.kisiSayfasi.fotograf}: {kisi.photo.author} ·{" "}
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
              · {s.kisiSayfasi.duzenleme}
            </figcaption>
          )}
        </figure>

        {/* 3. MANŞET: fotoğrafın altında, ortada dev isim + kanca */}
        <header className="py-10 text-center">
          {/* Kişinin adı: Lora, telefonda 5xl, büyük ekranda 7xl */}
          <h1 className={`${baslikFontu.className} text-5xl font-bold leading-tight sm:text-7xl`}>{kisi.name}</h1>
          {/* Kanca: isimden sonra tek cümle */}
          <p className="mx-auto mt-3 max-w-2xl font-serif text-lg italic leading-relaxed text-stone-600 sm:text-xl">{kisi.dek}</p>
          {/* Paylaş düğmesi: kancanın altında, ortada. Paylaşılan başlık: "Hamdi Ulukaya · Klip Dergi", metin: kanca */}
          <div className="mt-6">
            <PaylasDugmesi baslik={`${kisi.name} · ${s.genel.siteAdi}`} metin={kisi.dek} s={s.kisiSayfasi} />
          </div>
        </header>

        {/* 4. YAZI: tek sütun, ortada dar (max-w-3xl ≈ 70 karakterlik satır → rahat okunur).
            Fotoğraf yukarı taşındığı için sol sütun kalktı */}
        <article className="mx-auto max-w-3xl">
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
                  {kisi.name} · {s.kisiSayfasi.klipNo} {String(kisi.clips.indexOf(klip) + 1).padStart(2, "0")}: {klip.title}
                </figcaption>
                {/* Çeviri notu: sadece alıntı çeviriyse (İngilizce sayfa). Kişi bu sözü Türkçe söyledi, dürüstçe belirtiyoruz */}
                {klip.quoteTranslated && <p className="mt-1 text-xs italic text-stone-400">{s.klip.ceviri}</p>}
              </figure>
            ))}

          {/* ⭐ Editör satırı: biyografiyi kim hazırladı, en son ne zaman güncellendi */}
          {/* time = makinenin okuyacağı tarih (dateTime) + insanın okuyacağı tarih (14 Kasım 2026) */}
          <p className="mt-10 text-xs uppercase tracking-widest text-stone-500">
            {s.kisiSayfasi.editor}: {kisi.editor} · {s.kisiSayfasi.guncellendi}:{" "}
            <time dateTime={kisi.updatedAt}>
              {new Date(kisi.updatedAt).toLocaleDateString(s.genel.yerel, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
            </time>
          </p>

          {/* Sosyal medya: Instagram'ın RESMÎ glifi (KlipAlbumu'ndakiyle aynı). Linki yoksa hiç çıkmaz
              Çerçeve yok: Meta kuralı glifin çevresinde glifin yarısı kadar boşluk ister (29 px glif → ~15 px) */}
          {kisi.links.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4">
              {kisi.links.map((link) => (
                <li key={link}>
                  {/* Dış link: yeni sekmede, rel güvenlik için. Yazı yok → aria-label ekran okuyucuya söyler */}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${kisi.name} ${s.kisiSayfasi.instagramda}`}
                    title="Instagram"
                    className="block text-stone-700 transition-colors hover:text-rose-800"
                  >
                    <InstagramGlifi className="h-[29px] w-[29px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* 5. KLİPLER: tam genişlik albüm. Başlık ana sayfadaki gibi: büyük Lora + sağda bordo sayı + koyu çizgi */}
        <section className="mt-20">
          <div className="flex items-end justify-between border-b border-stone-900 pb-4">
            <h2 className={`${baslikFontu.className} text-3xl sm:text-5xl`}>{s.kisiSayfasi.klipler}</h2>
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-800">{klipSayisi(s, kisi.clips.length)}</p>
          </div>
          {/* Albüm ayrı bileşende: src/components/KlipAlbumu.tsx (deneme sayfası da kullanıyor) */}
          <KlipAlbumu klipler={kisi.clips} s={s} />
        </section>

        {/* 5½. HABERLERDE: Kliplerden sonra, Diğer kişilerden önce (hocanın tasarımı). Haberi yoksa hiç çıkmaz */}
        <HaberlerBolumu slug={kisi.slug} s={s} />

        {/* 6. DİĞER KİŞİLER: ana sayfadaki kutusuz dergi kartı (HikayeKarti, yatay görsel, ortalı yazı) */}
        <section className="mt-20">
          <div className="flex items-end justify-between border-b border-stone-900 pb-4">
            <h2 className={`${baslikFontu.className} text-3xl sm:text-5xl`}>{s.kisiSayfasi.digerKisiler}</h2>
            <Link
              href={yol(dil, "/kisiler")}
              className="group text-sm font-semibold uppercase tracking-widest text-rose-800 hover:underline"
            >
              {s.anaSayfa.tumKisiler}
            </Link>
          </div>
          {/* Telefonda alt alta, orta ekranda 3 yan yana */}
          <ul className="mt-10 grid gap-x-12 gap-y-14 sm:grid-cols-3">
            {digerKisiler.map((diger) => (
              <li key={diger.slug}>
                <HikayeKarti kisi={diger} duzen="orta" dil={dil} s={s} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}