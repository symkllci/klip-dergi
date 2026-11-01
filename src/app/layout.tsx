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

// metadata: sekmede görünen başlık (title) ve Google'ın gösterdiği açıklama (description).
// layout bütün sayfaları sardığı için bu, her sayfanın varsayılan başlığı olur.
// Bir sayfa kendi başlığını verirse (ör. kişi sayfası) o sayfada onunki kullanılır.
export const metadata: Metadata = {
  title: "Klip Dergi",
  description: "Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren dergi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}