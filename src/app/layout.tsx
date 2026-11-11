import Header from "@/components/Header"; // İnce başlık, her sayfada
import type { Metadata } from "next"; // Sayfa başlığı ve açıklaması için Next.js'in kalıbı
import { Geist, Geist_Mono } from "next/font/google"; // Kurulumla gelen yazı tipleri
import "./globals.css"; // Tailwind'in bağlandığı stil dosyası

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata: sekme başlığı, açıklama ve paylaşım bilgisi. Bütün sayfalar için geçerli.
export const metadata: Metadata = {
  metadataBase: new URL("https://klip-dergi.vercel.app"), // ⭐ Paylaşım resimleri için sitenin gerçek adresi
  // ⭐ default: sayfa başlık vermezse · template: %s yerine sayfanın başlığı gelir ("Hamdi Ulukaya · Klip Dergi")
  title: { default: "Klip Dergi", template: "%s · Klip Dergi" },
  description: "Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren dergi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang="tr": sayfanın dili Türkçe (i → İ doğru çevrilsin)
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* Önce ince başlık, sonra açılan sayfa */}
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}