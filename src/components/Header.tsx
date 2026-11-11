"use client";

import Link from "next/link";
import { Lora } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// İnce başlık: her sayfanın en üstünde
export default function Header() {
  const anaSayfa = usePathname() === "/"; // Ana sayfada mıyız?
  const [kaydi, setKaydi] = useState(false); // ⭐ Aşağı kaydırıldı mı? Başta: hayır

  // ⭐ Kulak 👂: her kaydırmada "200 pikselden fazla indik mi?" diye bak
  useEffect(() => {
    const dinle = () => setKaydi(window.scrollY > 200);
    dinle(); // Sayfa açılınca bir kere bak
    window.addEventListener("scroll", dinle); // Kulağı kur
    return () => window.removeEventListener("scroll", dinle); // Giderken kulağı kaldır
  }, []);

  const gizli = anaSayfa && !kaydi; // ⭐ Ana sayfa VE en üstte → saklan

  return (
    // ⭐ Ana sayfada fixed (sayfayı itmeden üstte belirir), diğer sayfalarda sticky
    // ⭐ gizli ise yukarı kaydırılıp saklanır (-translate-y-full), değilse yerinde
    <header
      className={`${anaSayfa ? "fixed inset-x-0" : "sticky"} top-0 z-50 grid grid-cols-3 items-center border-b border-stone-900 bg-amber-50 px-6 py-3 transition-transform duration-300 ${gizli ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* Sol: menü düğmesi */}
      <button type="button" aria-label="Menüyü aç" className="justify-self-start">
        ☰
      </button>

      {/* Orta: logo */}
      <Link href="/" className={`${baslikFontu.className} justify-self-center text-2xl font-bold italic`}>
        Klip Dergi
      </Link>

      {/* Sağ: Kişiler + arama */}
      <div className="flex items-center gap-4 justify-self-end">
   <Link href="/kisiler" className="hidden sm:inline">Kişiler</Link>

        {/* Arama: Enter → /kisiler?ara=... */}
        <form action="/kisiler" className="relative">
          {/* Büyüteç simgesi (süs) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          {/* Hap şeklinde kutu */}
          <input
            type="search"
            name="ara"
            placeholder="Ara"
            aria-label="Sitede ara"
            className="w-28 rounded-full border border-stone-300 bg-white py-1.5 pl-9 pr-3 text-sm focus:border-rose-800 focus:outline-none sm:w-48"
          />
        </form>
      </div>
    </header>
  );
}