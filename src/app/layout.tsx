import Header from "@/components/Header"; // İnce başlık, her sayfada
import Footer from "@/components/Footer"; // Alt bilgi, her sayfada
import { getAllPeople } from "@/lib/people"; // Arama önerileri için kişiler
import type { Metadata } from "next"; // Sayfa başlığı ve açıklaması için Next.js'in kalıbı
import { Inter, Lora } from "next/font/google"; // Metin fontu Inter, uzun okuma fontu Lora
import "./globals.css"; // Tailwind'in bağlandığı stil dosyası

// Inter: menü, düğme, kart gibi kısa yazılar
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
// Lora: biyografi gibi uzun okuma metinleri
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// ⭐ Sitenin tam adresi: paylaşım görseli (WhatsApp kapağı) için gerekli.
// Vercel her ortamda bize kendi adresini "ortam değişkeni" (process.env) olarak verir:
// - Ana sitede (production): VERCEL_PROJECT_PRODUCTION_URL → klip-dergi.vercel.app
// - Önizlemede (preview, ör. hafta5): VERCEL_BRANCH_URL → klip-dergi-git-hafta5-....vercel.app
// - Kendi bilgisayarımda: hiçbiri yok → localhost
// Eskiden ana site adresi elle yazılıydı; önizlemede görsel ana siteden isteniyordu, yeni kapaklar orada olmadığı için görünmüyordu.
function siteAdresi(): URL {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_BRANCH_URL) {
    return new URL(`https://${process.env.VERCEL_BRANCH_URL}`);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

// metadata: sekme başlığı, açıklama ve paylaşım bilgisi. Bütün sayfalar için geçerli.
export const metadata: Metadata = {
  metadataBase: siteAdresi(), // "/kapaklar/x.jpg" gibi yarım adresler bununla tam adrese çevrilir
  // default: sayfa başlık vermezse · template: %s yerine sayfanın başlığı gelir ("Hamdi Ulukaya · Klip Dergi")
  title: { default: "Klip Dergi", template: "%s · Klip Dergi" },
  description: "Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren dergi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Arama önerileri: sadece ad, slug ve ilk klibin konusu (biyografi vb. tarayıcıya gönderilmesin, sayfa hafif kalsın)
  const aramaKisileri = getAllPeople().map((kisi) => ({ ad: kisi.name, slug: kisi.slug, konu: kisi.clips[0].topic }));

  return (
    // lang="tr": sayfanın dili Türkçe (i → İ doğru çevrilsin)
    <html lang="tr" className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      {/* Üstte ince başlık, ortada açılan sayfa, altta alt bilgi */}
      <body className="flex min-h-full flex-col">
        <Header kisiler={aramaKisileri} />
        {children}
        <Footer />
      </body>
    </html>
  );
}