import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { Lora } from "next/font/google"; // Google Fonts'tan serif (tırnaklı) başlık fontu.
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.
import Vitrin from "@/components/Vitrin"; // Kayan vitrin: tarayıcıda çalışan ("use client") bileşen
import HikayeKarti from "@/components/HikayeKarti"; // Kutusuz hikâye kartı: görsel + konu + isim + kanca (3 düzen)
import AlintiBandi from "@/components/AlintiBandi"; // Tam genişlik koyu alıntı bandı
import { dilAl, getSozluk, yol } from "@/lib/sozluk"; // Dil, sözlük ve dile göre adres

// Başlık fontu: dergi hissi versin diye serif (kaynak: Next.js Fonts belgesi).
// latin-ext: Türkçe harfler (ş, ğ, ı, İ) için.
// style: hem düz hem italik (eğik) yazı kullanabilmek için. Logo italik, başlıklar düz.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Renkler (Tailwind'in hazır renkleri):
// krem zemin amber-50 · koyu mürekkep stone-900 · bordo vurgu rose-800

// Ana sayfa: sitenin adresi "/" (localhost:3000). Sunucuda hazırlanır, sadece vitrin tarayıcıda çalışır.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const dil = dilAl((await params).lang); // Adresteki dil: "tr" ya da "en"
  const s = getSozluk(dil); // O dilin sözlüğü: yazılar buradan
  const kisiler = await getAllPeople(); // Bütün kişileri al (şu an 12).
  const vitrin = kisiler.slice(0, 5); // Vitrin: ilk 5 kişi (0, 1, 2, 3, 4). slice'ın 2. sayısı dahil değil.
  // EDİTÖR SEÇİMİ: "Diğer hikâyeler"de kim görünsün? Adları (slug) buradan değiştirmek yeterli.
  // Öne çıkan: soldaki büyük hikâye (6 sütun) · Yan: sağdaki 4 kart (soldan sağa, yukarıdan aşağı okunur)
  const ONE_CIKAN = "hamdi-ulukaya";
  const YAN = ["acun-ilicali", "elon-musk", "aykut-karaalioglu", "mark-zuckerberg"];
  // Alıntı bandı da editör seçimi: Abdullah Kiğılı'nın sözü (kısa, tam cümle, bantta güçlü duruyor)
  const BANT = "abdullah-kigili";

  // slug → kişi. find = "şarta uyan ilkini bul". ?? = bulunamazsa sağdakini al
  const kisiBul = (slug: string) => kisiler.find((kisi) => kisi.slug === slug);
  const one = kisiBul(ONE_CIKAN) ?? kisiler[0];
  // map ile 4 slug'ı 4 kişiye çevir · filter: yanlış yazılmış (bulunamayan) slug varsa listeden at
  const yan = YAN.map(kisiBul).filter((kisi) => kisi !== undefined);

  // Alıntı bandı: seçilen kişi. Bulunamazsa alıntısı olan ilk kişi (AlintiBandi alıntısız kişide zaten hiç çizilmez)
  const alintiVar = (kisi: (typeof kisiler)[number]) => kisi.clips.some((klip) => klip.quote);
  const bant = kisiBul(BANT) ?? kisiler.find(alintiVar);

  return (
    // Bütün sayfa: krem zemin (amber-50), koyu mürekkep rengi yazı (stone-900)
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* main dar değil: dergi adı, vitrin, alıntı bandı ve hikâyeler ekranın tamamını kullanır.
          Dar kutu (max-w-6xl) hiç kalmadı → bütün çizgiler aynı yerden başlayıp aynı yerde biter */}
      <main className="py-10">
        {/* Dergi adı ve menü: bölümlerle AYNI yan boşluk (clamp) → üstteki çizgi alttaki başlık çizgileriyle hizalı */}
        <div className="px-[clamp(16px,3.2vw,56px)]">
        {/* Üst kısım: ortalanmış dergi adı. Lora italik: yumuşak, Colossus'tan farklı bir logo */}
        <header className="border-b-2 border-stone-900 pb-4">
          <h1 className={`${baslikFontu.className} text-center text-5xl font-bold italic sm:text-7xl`}>
            {s.genel.siteAdi}
          </h1>

          {/*  Adın altındaki menü: Lora, bordo, ortada, aralarında nokta (dergi künyesi gibi) */}
     <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 whitespace-nowrap font-serif text-sm text-rose-800 sm:gap-x-4 sm:text-lg">
            {/* Sayfa içi bağlantı: aşağıdaki "Diğer hikâyeler" bölümüne iner */}
            <a href="#hikayeler" className="hover:underline">
              {s.anaSayfa.girisimciHikayeleri}
            </a>
            <span className="text-stone-300">·</span>
            <Link href={yol(dil, "/kisiler")} className="hover:underline">
              {s.genel.kisiler}
            </Link>
            <span className="text-stone-300">·</span>
            {/* Dış bağlantı: yeni sekmede açılır, rel güvenlik için */}
            <a
              href="https://www.instagram.com/viralgirisimci/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {s.anaSayfa.podcastKlipleri}
            </a>
          </nav>
        </header>
        </div>

        {/* Vitrin: ilk 5 kişi, ayrı bileşende (src/components/Vitrin.tsx).
            Dar kutunun DIŞINDA → tam genişlik (kenardan kenara) */}
        <Vitrin kisiler={vitrin} dil={dil} s={s} />

        {/* Bölümlerin yan boşluğu: max-w (dar kutu) YOK. clamp(16px, 3.2vw, 56px) = ekranın %3,2'si,
            ama en az 16px (telefon) en fazla 56px (geniş ekran) → sayfanın tamamı kullanılır */}

        {/* 1. DİĞER HİKÂYELER: öne çıkan + yanında 4 hikâye */}
        <section id="hikayeler" className="mt-20 px-[clamp(16px,3.2vw,56px)]">
          {/* Başlık satırı: büyük Lora başlık, sağda bordo büyük harf link, altında koyu çizgi */}
          <div className="flex items-end justify-between border-b border-stone-900 pb-4">
            <h2 className={`${baslikFontu.className} text-3xl sm:text-5xl`}>{s.anaSayfa.digerHikayeler}</h2>
            <Link
              href={yol(dil, "/kisiler")}
              className="group text-sm font-semibold uppercase tracking-widest text-rose-800 hover:underline"
            >
              {s.anaSayfa.tumKisiler}
            </Link>
          </div>

          {/* 12 sütunlu ızgara: öne çıkan 6 sütun, yanında 3 + 3 sütunluk iki kolon.
              lg (1024px+) → yan yana · md → öne çıkan tam satır, 4 kart 2'li · telefon → hepsi alt alta */}
          <div className="mt-10 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
            <div className="md:col-span-2 lg:col-span-6">
              <HikayeKarti kisi={one} duzen="one" dil={dil} s={s} />
            </div>
            {/* İki kolon. Satır satır okunsun diye: 1. kolon = 1. ve 3. kişi, 2. kolon = 2. ve 4. kişi
                → üst satır: Acun, Elon · alt satır: Aykut, Mark */}
            {[[yan[0], yan[2]], [yan[1], yan[3]]].map((kolon, k) => (
              <div key={k} className="flex flex-col gap-14 lg:col-span-3">
                {/* filter(Boolean): 4'ten az kişi seçildiyse boş yerleri atla */}
                {kolon.filter(Boolean).map((kisi) => (
                  <HikayeKarti key={kisi.slug} kisi={kisi} duzen="orta" dil={dil} s={s} />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* 2. ALINTI BANDI: sayfada BİR alıntı, tam genişlik koyu bant (alıntısı olan kişi yoksa hiç çıkmaz) */}
        {bant && <AlintiBandi kisi={bant} s={s} />}

        {/* 3. BÜTÜN HİKÂYELER: albüm. 📚 MDN CSS Grid · repeat(auto-fill, minmax(230px, 1fr))
            auto-fill = sığdığı kadar sütun aç · minmax = her sütun en az 230px · kişi eklenince yeni satır açılır, ek kod gerekmez */}
        <section className="mt-20 px-[clamp(16px,3.2vw,56px)]">
          <div className="flex items-end justify-between border-b border-stone-900 pb-4">
            <h2 className={`${baslikFontu.className} text-3xl sm:text-5xl`}>{s.anaSayfa.butunHikayeler}</h2>
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-800">{kisiler.length} {s.genel.kisi}</p>
          </div>
          {/* min(230px,100%): çok dar ekranda taşmasın */}
          <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))] gap-x-12 gap-y-14">
            {kisiler.map((kisi) => (
              <HikayeKarti key={kisi.slug} kisi={kisi} duzen="album" dil={dil} s={s} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}