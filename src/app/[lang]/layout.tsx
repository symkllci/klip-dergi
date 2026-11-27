import Header from "@/components/Header"; // İnce başlık, her sayfada
import Footer from "@/components/Footer"; // Alt bilgi, her sayfada
import { getAramaKisileri } from "@/lib/people"; // Arama önerileri için kişiler
import { DILLER, dilAl, getSozluk, konuAdi } from "@/lib/sozluk"; // Diller ve sözlük
import { siteAdresi } from "@/lib/site-adresi"; // Sitenin tam adresi (Vercel / localhost)
import type { Metadata } from "next"; // Sayfa başlığı ve açıklaması için Next.js'in kalıbı
import { Inter, Lora } from "next/font/google"; // Metin fontu Inter, uzun okuma fontu Lora
import "../globals.css"; // Tailwind'in bağlandığı stil dosyası (bir üst klasörde, app/ içinde)

// Inter: menü, düğme, kart gibi kısa yazılar
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
// Lora: biyografi gibi uzun okuma metinleri
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// metadata: sekme başlığı, açıklama ve paylaşım bilgisi. Bütün sayfalar için geçerli.
// Artık dile göre değiştiği için sabit değil, fonksiyon (generateMetadata): açıklama sözlükten
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const s = getSozluk(dilAl((await params).lang));
  return {
    metadataBase: siteAdresi(), // "/kapaklar/x.jpg" gibi yarım adresler bununla tam adrese çevrilir
    // default: sayfa başlık vermezse · template: %s yerine sayfanın başlığı gelir ("Hamdi Ulukaya · Klip Dergi")
    title: { default: s.genel.siteAdi, template: `%s · ${s.genel.siteAdi}` },
    description: s.genel.aciklama,
  };
}

// Sitenin dilleri (lib/sozluk.ts'te: tr ve en). Bu listede olmayan bir dil (ör. /de) 404 verir (dynamicParams = false)

// Build sırasında iki dil için de sayfalar önceden hazırlanır: /tr/... ve /en/...
export function generateStaticParams() {
  return DILLER.map((lang) => ({ lang }));
}
export const dynamicParams = false; // Listede olmayan dil → 404

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const dil = dilAl((await params).lang); // Adresteki dil: "tr" ya da "en" (başka bir şeyse 404)
  const s = getSozluk(dil); // O dilin sözlüğü
  // Arama önerileri: sadece ad, slug, konular, klip başlıkları (biyografi vb. tarayıcıya gönderilmesin, sayfa hafif kalsın)
  // Konular o dile çevrilir: İngilizcede "yatırım" yerine "investment" önerilsin
  const aramaKisileri = (await getAramaKisileri(dil)).map((kisi) => ({
    ...kisi,
    konular: kisi.konular.map((konu) => konuAdi(s, konu)),
  }));

  return (
    // lang: sayfanın dili adresten gelir (tr ya da en). Ekran okuyucu ve Google doğru dilde okusun
    <html lang={dil} className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      {/* Üstte ince başlık, ortada açılan sayfa, altta alt bilgi */}
      <body className="flex min-h-full flex-col">
        <Header kisiler={aramaKisileri} dil={dil} s={s} />
        {children}
        <Footer dil={dil} s={s} />
      </body>
    </html>
  );
}