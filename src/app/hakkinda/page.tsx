import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Kirinti from "@/components/Kirinti"; // Ekmek kırıntısı: nerede olduğunu gösterir (kişi sayfasındakinin aynısı)

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Sekme başlığı: "Hakkımızda · Klip Dergi"
export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Klip Dergi nedir, ilkelerimiz, künye ve kaldırma politikası.",
};

// Ortak görünüşler (kalıplar)
// Bölüm başlığı: Kişiler sayfasındaki konular gibi küçük BÜYÜK HARF, üstünde kalın çizgi (gazete bölüm ayracı)
const bolumBasligi = "border-t-2 border-stone-900 pt-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500";

// İlkelerimiz: 3 madde (planda yazan)
const ilkeler = [
  {
    baslik: "Klip barındırmıyoruz",
    metin: "Sitemizde hiçbir video dosyası saklanmaz. Klipler yalnızca bağlantı ve platformların resmî yerleştirme (embed) araçlarıyla gösterilir.",
  },
  {
    baslik: "Biyografiler özgün",
    metin: "Her biyografi ekibimiz tarafından, doğrulanmış kaynaklardan yararlanılarak kendi cümleleriyle yazılır.",
  },
  {
    baslik: "Fotoğraflar açık lisanslı",
    metin: "Kullandığımız fotoğraflar açık lisanslıdır; fotoğrafçı, lisans ve kaynak bilgisi fotoğrafın altında belirtilir.",
  },
];

// Künye: görev, isim ve (varsa) Instagram adresi
const kunye = [
  { gorev: "Yayın adı", isim: "Klip Dergi" },
  { gorev: "Yayın türü", isim: "Çevrim içi dergi" },
  { gorev: "Tasarım · Yazılım geliştirici", isim: "Şeyma Kelleci", link: "https://www.instagram.com/sheymacodding/" },
  { gorev: "Proje yöneticisi · Yazılım geliştirici", isim: "Mustafa Yusuf Aksoy", link: "https://www.instagram.com/codewander/" },
  { gorev: "İletişim", isim: "info@klipdergi.com" }, // DEMO: gerçek adres gelince değişecek
];

// Hakkımızda sayfası (adres: /hakkinda) · Maket A: gazete künyesi
export default function HakkindaSayfasi() {
  return (
    <div className="bg-amber-50 text-stone-900">
      {/* max-w-5xl: eskisinden (max-w-2xl) geniş → ilkeler yan yana 3 sütun sığsın */}
      <main className="mx-auto max-w-5xl px-6 pb-10 pt-6">
        {/* GİRİŞ: Kişiler sayfasıyla aynı → ortada kırıntı + kalın Lora başlık + italik açıklama */}
        <header className="pb-12 text-center">
          {/* Ekmek kırıntısı: ortada (flex justify-center) */}
          <div className="flex justify-center">
            <Kirinti adimlar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Hakkımızda" }]} />
          </div>
          <h1 className={`${baslikFontu.className} mt-3 text-4xl font-bold sm:text-5xl`}>Hakkımızda</h1>
          <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic leading-relaxed text-stone-600">
            Podcast&apos;lerde viral olan girişimci kliplerini bir araya getiren çevrim içi bir dergi.
            Her kişi için kısa bir biyografi, sosyal medya hesapları ve konuştukları klipler tek sayfada.
          </p>
        </header>

        {/* İLKELERİMİZ: yan yana 3 sütun (telefonda alt alta). Büyük bordo Lora numara, altında başlık ve yazı */}
        <section>
          <h2 className={bolumBasligi}>İlkelerimiz</h2>
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
          <h2 className={bolumBasligi}>Künye</h2>
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">Hak sahipleri için · Kaldırma politikası</p>
          <p className={`${baslikFontu.className} mt-4 max-w-3xl text-2xl leading-relaxed sm:text-3xl`}>
            Sitemizde yer alan bir klip, biyografi ya da fotoğraf hakkında itirazınız varsa iletişim adresimizden bize yazın.
            İtiraz edilen içerik <span className="text-rose-300">24 saat içinde kaldırılır.</span>
          </p>
        </section>
      </main>
    </div>
  );
}