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
const etiket = "text-xs font-medium uppercase tracking-[0.2em] text-rose-800"; // küçük bordo etiket
const bolumBasligi = `${baslikFontu.className} mt-3 text-2xl`; // sakin Lora başlık
const bolum = "mt-20 border-t border-stone-200 pt-10"; // bölümler arası geniş boşluk, ince çizgi

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

// Hakkımızda sayfası (adres: /hakkinda)
export default function HakkindaSayfasi() {
  return (
    <div className="bg-amber-50 text-stone-900">
      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* ⭐ Ekmek kırıntısı: Ana sayfa › Hakkımızda. Son adımda href yok → "buradasın" (bordo, tıklanmaz) */}
        <Kirinti adimlar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Hakkımızda" }]} />

        {/* Giriş: ortalı, sakin. mt-12: kırıntıyla arasında boşluk */}
        <div className="mt-12 text-center">
          <p className={etiket}>Hakkımızda</p>
          <h1 className={`${baslikFontu.className} mt-4 text-5xl italic`}>Klip Dergi</h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-loose text-stone-600">
            Podcast&apos;lerde viral olan girişimci kliplerini bir araya getiren çevrim içi bir dergi.
            Her kişi için kısa bir biyografi, sosyal medya hesapları ve konuştukları klipler tek sayfada.
          </p>
        </div>

        {/* İlkelerimiz: solda bordo numara, sağda yazı */}
        <section className={bolum}>
          <p className={etiket}>Nasıl çalışıyoruz</p>
          <h2 className={bolumBasligi}>İlkelerimiz</h2>
          <ol className="mt-8 space-y-8">
            {ilkeler.map((ilke, sira) => (
              <li key={ilke.baslik} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className={`${baslikFontu.className} text-3xl italic text-rose-800`}>0{sira + 1}</span>
                <div>
                  <h3 className="font-medium">{ilke.baslik}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">{ilke.metin}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Künye: solda görev, sağda isim. İsim linkliyse üstüne gelince bordo */}
        <section className={bolum}>
          <p className={etiket}>Yayın bilgileri</p>
          <h2 className={bolumBasligi}>Künye</h2>
          <dl className="mt-8 divide-y divide-stone-200">
            {kunye.map((satir) => (
              <div key={satir.gorev} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <dt className="text-sm text-stone-500">{satir.gorev}</dt>
                <dd className="font-medium">
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

        {/* Kaldırma politikası: yumuşak beyaz kutu */}
        <section className={bolum}>
          <p className={etiket}>Hak sahipleri için</p>
          <h2 className={bolumBasligi}>Kaldırma politikası</h2>
          <p className="mt-6 rounded-2xl bg-white p-6 leading-relaxed text-stone-600">
            Sitemizde yer alan bir klip, biyografi ya da fotoğraf hakkında itirazınız varsa iletişim adresimizden bize yazın.
            İtiraz edilen içerik <span className="font-medium text-rose-800">24 saat içinde kaldırılır.</span>
          </p>
        </section>
      </main>
    </div>
  );
}