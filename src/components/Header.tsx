"use client";

import Link from "next/link";
import { Lora } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// İnce başlık: her sayfanın en üstünde
export default function Header() {
  const anaSayfa = usePathname() === "/"; // Ana sayfada mıyız?
  const [kaydi, setKaydi] = useState(false); // Aşağı kaydırıldı mı?
  const [acik, setAcik] = useState(false); // Menü açık mı? Başta: kapalı

  // 1. kulak 👂: kaydırmayı dinle, 200 pikselden fazla indik mi?
  useEffect(() => {
    const dinle = () => setKaydi(window.scrollY > 200);
    dinle();
    window.addEventListener("scroll", dinle);
    return () => window.removeEventListener("scroll", dinle);
  }, []);

  // 2. kulak 👂: klavyeyi dinle, Esc'ye basılırsa menüyü kapat
  useEffect(() => {
    const dinle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAcik(false);
    };
    window.addEventListener("keydown", dinle);
    return () => window.removeEventListener("keydown", dinle);
  }, []);

  const gizli = anaSayfa && !kaydi && !acik; // Ana sayfa + en üst + menü kapalı → saklan

  return (
    <header
      className={`${anaSayfa ? "fixed inset-x-0" : "sticky"} top-0 z-50 grid grid-cols-3 items-center border-b border-stone-900 bg-amber-50 px-6 py-3 transition-transform duration-300 ${gizli ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* ⭐ Sol: menü düğmesi. Bas → açık/kapalı değişir (ışık düğmesi) */}
      {/* aria-expanded: ekran okuyucuya "menü şu an açık mı" der */}
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        aria-expanded={acik}
        aria-label={acik ? "Menüyü kapat" : "Menüyü aç"}
        className="justify-self-start text-xl"
      >
        {acik ? "×" : "☰"}
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
          <input
            type="search"
            name="ara"
            placeholder="Ara"
            aria-label="Sitede ara"
            className="w-28 rounded-full border border-stone-300 bg-white py-1.5 pl-9 pr-3 text-sm focus:border-rose-800 focus:outline-none sm:w-48"
          />
        </form>
      </div>

      {/* ⭐ Menü paneli: sadece acik true iken görünür (&& = "ise göster") */}
      {/* Colossus gibi soldan koyu panel. top-full: şeridin hemen altından başlar */}
      {acik && (
        <nav className="absolute left-0 top-full h-screen w-72 bg-stone-900 text-amber-50">
          <ul className="divide-y divide-stone-700">
            <li><Link href="/" onClick={() => setAcik(false)} className="block px-6 py-4 hover:text-rose-300">Ana sayfa</Link></li>
            <li><Link href="/kisiler" onClick={() => setAcik(false)} className="block px-6 py-4 hover:text-rose-300">Kişiler</Link></li>
            <li><Link href="/hakkinda" onClick={() => setAcik(false)} className="block px-6 py-4 hover:text-rose-300">Hakkında</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}