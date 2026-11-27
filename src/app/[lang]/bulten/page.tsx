import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Kirinti from "@/components/Kirinti";
import BultenFormu from "@/components/BultenFormu"; // Ana sayfadaki kutuyla AYNI form
import { dilAdresleri, dilAl, getSozluk, yol } from "@/lib/sozluk";

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// Sekme başlığı: "Bülten · Klip Dergi" / "Newsletter · Klip Dergi" + hreflang
export async function generateMetadata({ params }: PageProps<"/[lang]/bulten">): Promise<Metadata> {
  const dil = dilAl((await params).lang);
  const s = getSozluk(dil);
  return { title: s.bulten.baslik, description: s.bulten.aciklama, alternates: dilAdresleri(dil, "/bulten") };
}

// Bülten sayfası (adres: /bulten ve /en/bulten). Kişiler ve Hakkımızda ile aynı giriş: ortada kırıntı + kalın başlık
export default async function BultenSayfasi({ params }: PageProps<"/[lang]/bulten">) {
  const dil = dilAl((await params).lang);
  const s = getSozluk(dil);
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main className="mx-auto max-w-3xl px-6 pb-10 pt-6">
        <header className="pb-10 text-center">
          <div className="flex justify-center">
            <Kirinti etiket={s.kirinti.etiket} adimlar={[{ ad: s.genel.anaSayfa, href: yol(dil, "/") }, { ad: s.bulten.baslik }]} />
          </div>
          <h1 className={`${baslikFontu.className} mt-3 text-4xl font-bold sm:text-5xl`}>{s.bulten.kutuBaslik}</h1>
          <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic leading-relaxed text-stone-600">{s.bulten.aciklama}</p>
        </header>
        <BultenFormu dil={dil} s={s} />
      </main>
    </div>
  );
}