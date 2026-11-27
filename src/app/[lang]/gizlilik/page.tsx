import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Kirinti from "@/components/Kirinti";
import { dilAdresleri, dilAl, getSozluk, yol } from "@/lib/sozluk";

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// robots noindex: TASLAK metin, Google'da çıkmasın. Hukukçu okuyunca kaldırılacak
export async function generateMetadata({ params }: PageProps<"/[lang]/gizlilik">): Promise<Metadata> {
  const dil = dilAl((await params).lang);
  const s = getSozluk(dil);
  return {
    title: s.gizlilik.baslik,
    description: s.gizlilik.aciklama,
    alternates: dilAdresleri(dil, "/gizlilik"),
    robots: { index: false, follow: true },
  };
}

// Bölüm başlığı: Hakkımızda sayfasındaki gibi küçük BÜYÜK HARF, üstünde çizgi
const bolumBasligi = "mt-10 border-t border-stone-300 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500";

// GİZLİLİK (adres: /gizlilik). KVKK aydınlatma metni TASLAĞI.
// 📚 6698 sayılı KVKK m.10 (aydınlatma yükümlülüğü), m.11 (ilgili kişinin hakları) · 6563 sayılı Kanun (ticari elektronik ileti onayı)
// Metin şimdilik sadece Türkçe; İngilizce sayfada bunu söyleyen bir not var
export default async function GizlilikSayfasi({ params }: PageProps<"/[lang]/gizlilik">) {
  const dil = dilAl((await params).lang);
  const s = getSozluk(dil);
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main className="mx-auto max-w-3xl px-6 pb-10 pt-6">
        <header className="pb-6 text-center">
          <div className="flex justify-center">
            <Kirinti etiket={s.kirinti.etiket} adimlar={[{ ad: s.genel.anaSayfa, href: yol(dil, "/") }, { ad: s.gizlilik.baslik }]} />
          </div>
          <h1 className={`${baslikFontu.className} mt-3 text-4xl font-bold sm:text-5xl`}>{s.gizlilik.baslik}</h1>
        </header>

        {/* TASLAK NOTU: planın istediği, en başta ve göze çarpan */}
        <div role="note" className="border-l-4 border-rose-800 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-950">
          <strong>TASLAK.</strong> Bu metin bir taslaktır ve henüz bir hukukçu tarafından incelenmemiştir. Bülten şu an
          gerçek e-posta toplamıyor; yayında gerçek e-posta toplamadan önce metin bir hukukçuya okutulacak.
          {dil === "en" && <span className="mt-2 block">{s.gizlilik.sadeceTurkce}</span>}
        </div>

        <article lang="tr" className="mt-8 font-serif text-lg leading-relaxed text-stone-700">
          <h2 className={`${baslikFontu.className} text-2xl font-bold text-stone-900`}>
            Bülten için Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni
          </h2>
          <p className="mt-4">
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (KVKK) 10. maddesi uyarınca, Klip Dergi
            bültenine kayıt olurken paylaştığınız kişisel verilerin nasıl işlendiği hakkında sizi bilgilendirmek için
            hazırlanmıştır.
          </p>

          <h3 className={bolumBasligi}>1. Veri sorumlusu</h3>
          <p className="mt-3">
            Klip Dergi. <em>[Taslak: veri sorumlusunun unvanı ve adresi belirlenecek.]</em> İletişim: info@klipdergi.com
          </p>

          <h3 className={bolumBasligi}>2. İşlenen kişisel veriler</h3>
          <ul className="mt-3 list-disc pl-6">
            <li>E-posta adresiniz</li>
            <li>Onay kutusunu işaretlediğinizde gösterilen onay metni ve onayı verdiğiniz tarih ve saat</li>
            <li>Formu hangi dilde doldurduğunuz (Türkçe ya da İngilizce)</li>
          </ul>

          <h3 className={bolumBasligi}>3. İşleme amacı</h3>
          <p className="mt-3">
            Size Klip Dergi bültenini e-posta ile göndermek ve onayınızı verdiğinizi gösterebilmek. Verileriniz başka bir
            amaçla kullanılmaz.
          </p>

          <h3 className={bolumBasligi}>4. Hukuki sebep</h3>
          <p className="mt-3">
            Açık rızanız (KVKK m.5/1). Bülten e-postaları ticari elektronik ileti sayılabileceği için, 6563 sayılı
            Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca ayrıca önceden onayınız alınır. Onay kutusu
            işaretlenmeden kayıt yapılmaz.
          </p>

          <h3 className={bolumBasligi}>5. Aktarım</h3>
          <p className="mt-3">
            <em>[Taslak: e-postaların saklanacağı yer ve e-posta gönderim hizmeti henüz belirlenmedi. Bir hizmet
            sağlayıcıya ya da yurt dışına aktarım olacaksa burada açıkça yazılacak.]</em>
          </p>

          <h3 className={bolumBasligi}>6. Saklama süresi</h3>
          <p className="mt-3">
            Verileriniz, bülten aboneliğiniz devam ettiği sürece saklanır. Aboneliğinizden ayrıldığınızda ya da onayınızı
            geri aldığınızda silinir. <em>[Taslak: onay kaydının ispat için ne kadar tutulacağı hukukçuya sorulacak.]</em>
          </p>

          <h3 className={bolumBasligi}>7. Haklarınız</h3>
          <p className="mt-3">
            KVKK&apos;nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi isteme,
            amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme, eksik ya da yanlışsa
            düzeltilmesini, silinmesini isteme ve itiraz etme haklarına sahipsiniz. Onayınızı istediğiniz zaman, hiçbir
            gerekçe göstermeden geri alabilir ve bültenden ayrılabilirsiniz.
          </p>

          <h3 className={bolumBasligi}>8. Başvuru</h3>
          <p className="mt-3">Taleplerinizi info@klipdergi.com adresine iletebilirsiniz.</p>
        </article>
      </main>
    </div>
  );
}