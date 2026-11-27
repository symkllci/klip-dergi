import fs from "node:fs"; // Dosya okuma (sunucuda, build sırasında)
import path from "node:path"; // Dosya yolunu birleştirme
import type { Metadata } from "next";
import SesliBiyografi, { type KelimeZamani } from "@/components/SesliBiyografi";

// GEÇİCİ DENEME SAYFASI (adres: /ses-deneme). Gerçek sesler gelince silinecek.
// robots noindex: Google bu sayfayı listelemesin
export const metadata: Metadata = {
  title: "Ses denemesi",
  robots: { index: false, follow: false },
};

// Örnek seste okunan metin: 12 Kasım deneme paragrafı (ses bunu okuyor)
const DENEME_METNI =
  "Hamdi Ulukaya, Chobani'nin temelini 2005 yılında kapanmış bir yoğurt fabrikasını satın alarak attı. Acun Ilıcalı muhabirlikten başlayıp TV8'i satın alacak kadar büyüdü. Abdullah Kiğılı ve Dinçerler Group'un CEO'su Mehmet Dinçerler de hikâyeleriyle Klip Dergi'de.";

export default function SesDenemeSayfasi() {
  // public/ses/deneme.json dosyasını oku → kelime zamanları listesi
  const dosya = path.join(process.cwd(), "public", "ses", "deneme.json");
  const kelimeler: KelimeZamani[] = JSON.parse(fs.readFileSync(dosya, "utf-8"));

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">Deneme · Cumartesi oynatıcısı</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Ses ve kelime vurgusu denemesi</h1>
        <p className="mt-2 text-sm text-stone-500">
          Örnek ses: 12 Kasım deneme paragrafı. Kelime zamanları ilk birkaç kelime için elle yazıldı (public/ses/deneme.json).
        </p>
        <div className="mt-8">
          <SesliBiyografi metin={DENEME_METNI} ses="/ses/deneme.mp3" kelimeler={kelimeler} zamaniGoster />
        </div>
      </main>
    </div>
  );
}