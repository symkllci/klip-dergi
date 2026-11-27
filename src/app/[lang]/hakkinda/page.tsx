import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Kirinti from "@/components/Kirinti"; // Ekmek kırıntısı: nerede olduğunu gösterir (kişi sayfasındakinin aynısı)
import { dilAdresleri, dilAl, getSozluk, yol } from "@/lib/sozluk"; // Dil, sözlük ve dile göre adres

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Sekme başlığı: "Hakkımızda · Klip Dergi" / "About · Klip Dergi" (sözlükten)
export async function generateMetadata({ params }: PageProps<"/[lang]/hakkinda">): Promise<Metadata> {
  const dil = dilAl((await params).lang);
  const s = getSozluk(dil);
  return {
    title: s.genel.hakkimizda,
    description: s.hakkinda.aciklama,
    alternates: dilAdresleri(dil, "/hakkinda"), // hreflang: bu sayfanın TR ve EN adresleri
  };
}

// Ortak görünüşler (kalıplar)
// Bölüm başlığı: Kişiler sayfasındaki konular gibi küçük BÜYÜK HARF, üstünde kalın çizgi (gazete bölüm ayracı)
const bolumBasligi = "border-t-2 border-stone-900 pt-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500";

// Hakkımızda sayfası (adres: /hakkinda) · Maket A: gazete künyesi
export default async function HakkindaSayfasi({ params }: PageProps<"/[lang]/hakkinda">) {
  const dil = dilAl((await params).lang);
  const s = getSozluk(dil);
  // İlkelerimiz: 3 madde (planda yazan). Yazılar sözlükte (hakkinda.ilkeler)
  const ilkeler = s.hakkinda.ilkeler;
  // Künye: görev (sözlükten), isim ve (varsa) Instagram adresi. İsimler çevrilmez
  const g = s.hakkinda.gorevler;
  const kunye = [
    { gorev: g.yayinAdi, isim: s.genel.siteAdi },
    { gorev: g.yayinTuru, isim: s.hakkinda.yayinTuru },
    { gorev: g.tasarim, isim: "Şeyma Kelleci", link: "https://www.instagram.com/sheymacodding/" },
    { gorev: g.proje, isim: "Mustafa Yusuf Aksoy", link: "https://www.instagram.com/codewander/" },
    { gorev: g.iletisim, isim: "info@klipdergi.com" }, // DEMO: gerçek adres gelince değişecek
  ];

  return (
    <div className="bg-amber-50 text-stone-900">
      {/* max-w-5xl: eskisinden (max-w-2xl) geniş → ilkeler yan yana 3 sütun sığsın */}
      <main className="mx-auto max-w-5xl px-6 pb-10 pt-6">
        {/* GİRİŞ: Kişiler sayfasıyla aynı → ortada kırıntı + kalın Lora başlık + italik açıklama */}
        <header className="pb-12 text-center">
          {/* Ekmek kırıntısı: ortada (flex justify-center) */}
          <div className="flex justify-center">
            <Kirinti etiket={s.kirinti.etiket} adimlar={[{ ad: s.genel.anaSayfa, href: yol(dil, "/") }, { ad: s.genel.hakkimizda }]} />
          </div>
          <h1 className={`${baslikFontu.className} mt-3 text-4xl font-bold sm:text-5xl`}>{s.genel.hakkimizda}</h1>
          <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic leading-relaxed text-stone-600">
            {s.hakkinda.giris}
          </p>
        </header>

        {/* İLKELERİMİZ: yan yana 3 sütun (telefonda alt alta). Büyük bordo Lora numara, altında başlık ve yazı */}
        <section>
          <h2 className={bolumBasligi}>{s.hakkinda.ilkelerimiz}</h2>
          <ol className="mt-8 grid gap-10 sm:grid-cols-3">
            {ilkeler.map((ilke, sira) => (
              <li key={ilke.baslik}>
                {/* padStart(2, "0"): 1 → "01" (klip albümündeki numaralar gibi) */}
                <span className={`${baslikFontu.className} block text-5xl leading-none text-rose-800`}>
                  {String(sira + 1).padStart(2, "0")}
                </span>
                <h3 className={`${baslikFontu.className} mt-4 text-xl font-bold`}>{ilke.baslik}</h3>
                <p className="mt-2 leading-relaxed text-stone-600">{ilke.metin}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* KÜNYE: basılı dergilerin künyesi gibi ORTALI. Üstte küçük görev, altında büyük Lora isim */}
        <section className="mt-20">
          <h2 className={bolumBasligi}>{s.hakkinda.kunye}</h2>
          <dl className="mt-10 space-y-7 text-center">
            {kunye.map((satir) => (
              <div key={satir.gorev}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">{satir.gorev}</dt>
                <dd className={`${baslikFontu.className} mt-1 text-2xl`}>
                  {/* Linki varsa (Instagram) tıklanır, üstüne gelince bordo */}
                  {satir.link ? (
                    <a href={satir.link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-rose-800">
                      {satir.isim}
                    </a>
                  ) : (
                    satir.isim
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* KALDIRMA POLİTİKASI: beyaz kutu YERİNE koyu bant (ana sayfadaki alıntı bandıyla aynı dil) */}
        <section className="mt-20 bg-stone-900 px-8 py-10 text-amber-50 sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">{s.hakkinda.kaldirmaEtiket}</p>
          <p className={`${baslikFontu.className} mt-4 max-w-3xl text-2xl leading-relaxed sm:text-3xl`}>
            {s.hakkinda.kaldirmaMetin} <span className="text-rose-300">{s.hakkinda.kaldirmaVurgu}</span>
          </p>
        </section>
      </main>
    </div>
  );
}