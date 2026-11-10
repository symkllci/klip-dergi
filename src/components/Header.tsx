"use client"; // Bu bileşen tarayıcıda (masada) çalışsın: kaydırmayı ve tıklamayı duyabilsin

import Link from "next/link"; // Sayfalar arası geçiş bileşeni
import { Lora } from "next/font/google"; // Logo için serif yazı tipi

// Logo fontu: page.tsx'teki ile aynı. latin-ext Türkçe harfler için, italic eğik logo için
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// İnce başlık: layout.tsx'te çağrıldığı için her sayfanın en üstünde görünür
export default function Header() {
  return (
    // sticky top-0: kayarken en üste yapış · z-50: her şeyin üstünde dur
    // flex items-center justify-between: parçaları yan yana diz, dikeyde ortala, aralara boşluk koy
    // bg-amber-50: krem zemin (arkası görünmesin) · border-b: altta ince çizgi · px-6 py-3: iç boşluk
    <header className="sticky top-0 flex items-center justify-between z-50 bg-amber-50 border-b border-stone-900 px-6 py-3">
      {/* Solda: menü düğmesi. type="button" form göndermesin, aria-label ekran okuyucu için */}
      <button type="button" aria-label="Menüyü aç">☰</button>

      {/* Ortada: logo. Tıklayınca ana sayfaya (/) gider */}
      <Link href="/" className={`${baslikFontu.className} text-2xl font-bold italic`}>Klip Dergi</Link>

      {/* Sağda: arama ve Kişiler. Arama kutusu Kişiler sayfasında olduğu için ikisi de /kisiler */}
      <Link href="/kisiler">Ara</Link>
      <Link href="/kisiler">Kişiler</Link>
    </header>
  );
}