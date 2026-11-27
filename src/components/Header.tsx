"use client";

import Link from "next/link";
import { Lora } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AramaKutusu, { type AramaKisisi } from "@/components/AramaKutusu"; // Önerili arama kutusu (combobox)
import { yol, type Dil, type Sozluk } from "@/lib/sozluk"; // Dil, sözlük ve dile göre adres

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// İnce başlık: her sayfanın en üstünde
// kisiler: arama önerileri için (ad, slug, konu). layout.tsx sunucuda hazırlayıp veriyor
// dil: "tr" ya da "en" · s: o dilin sözlüğü (yazılar buradan okunur)
export default function Header({ kisiler, dil, s }: { kisiler: AramaKisisi[]; dil: Dil; s: Sozluk }) {
  const adres = usePathname(); // Şu anki adres, ör. "/kisiler/hamdi-ulukaya" ya da "/en/kisiler/hamdi-ulukaya"
  const anaSayfa = ["/", "/tr", "/en"].includes(adres); // Ana sayfada mıyız? (Türkçe: "/" ya da sunucuda "/tr", İngilizce: "/en")
  // Dilsiz adres: baştaki /en ya da /tr'yi at (sunucuda Türkçe sayfa "/tr/..." görünür) → "/kisiler/hamdi-ulukaya"
  // ^ = baştan · (tr|en) = tr ya da en · (?=\/|$) = arkasından / gelsin ya da adres bitsin ("/entry" gibi bir adresi bozmasın)
  const dilsizAdres = adres.replace(/^\/(tr|en)(?=\/|$)/, "") || "/";
  const [kaydi, setKaydi] = useState(false); // Aşağı kaydırıldı mı?
  const [acik, setAcik] = useState(false); // Menü açık mı? Başta: kapalı
  const [aramaAcik, setAramaAcik] = useState(false); // Arama kutusu açık mı? Başta: kapalı

  // 1. kulak 👂: kaydırmayı dinle, 200 pikselden fazla indik mi?
  useEffect(() => {
    const dinle = () => setKaydi(window.scrollY > 200);
    dinle();
    window.addEventListener("scroll", dinle);
    return () => window.removeEventListener("scroll", dinle);
  }, []);

  // 2. kulak 👂: klavyeyi dinle, Esc'ye basılırsa menüyü ve aramayı kapat
  useEffect(() => {
    const dinle = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
        setAcik(false);        // menüyü kapat
        setAramaAcik(false);   // aramayı kapat
      }
    };
    window.addEventListener("keydown", dinle);
    return () => window.removeEventListener("keydown", dinle);
  }, []);

  const gizli = anaSayfa && !kaydi && !acik; // Ana sayfa + en üst + menü kapalı → saklan

  return (
    <header
      className={`${anaSayfa ? "fixed inset-x-0" : "sticky"} top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 border-b border-stone-900 bg-amber-50 px-4 py-3 sm:px-6 transition-transform duration-300 ${gizli ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* Sol: menü düğmesi + dil seçimi (TR · EN) yan yana */}
      <div className="flex items-center gap-2.5 justify-self-start sm:gap-4">
        {/* Menü düğmesi. Bas → açık/kapalı değişir (ışık düğmesi). aria-expanded: ekran okuyucuya "menü şu an açık mı" der */}
        <button
          type="button"
          onClick={() => setAcik(!acik)}
          aria-expanded={acik}
          aria-label={acik ? s.header.menuyuKapat : s.header.menuyuAc}
          className="text-xl"
        >
          {acik ? "×" : "☰"}
        </button>
        {/* TR · EN (solda, ☰ yanında: sağ taraf telefonda 🔍 + KİŞİLER ile dolu): aynı sayfanın öbür dili. Seçili dil bordo ve altı çizili (Kişiler sayfasındaki konular gibi), link değil.
            Diğer dil gri bir link: Hamdi'nin sayfasındaysan Hamdi'nin öbür dildeki sayfasına gider
            hrefLang + lang: tarayıcıya ve ekran okuyucuya "bu link İngilizce bir sayfaya gidiyor" der */}
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] sm:tracking-[0.18em]">
          {(["tr", "en"] as const).map((d, sira) => (
            <span key={d} className="flex items-center gap-1.5">
              {sira > 0 && <span aria-hidden="true" className="text-stone-300">·</span>}
              {d === dil ? (
                <span aria-current="true" className="text-rose-800 underline decoration-2 underline-offset-4">
                  {d.toUpperCase()}
                </span>
              ) : (
                <Link
                  href={yol(d, dilsizAdres)}
                  hrefLang={d}
                  lang={d}
                  aria-label={d === "en" ? "English" : "Türkçe"}
                  className="text-stone-400 transition-colors hover:text-rose-800"
                >
                  {d.toUpperCase()}
                </Link>
              )}
            </span>
          ))}
        </span>
      </div>

      {/* Orta: logo. Telefonda text-2xl, geniş ekranda text-3xl · whitespace-nowrap: "Klip Dergi" iki satıra bölünmesin */}
      <Link href={yol(dil, "/")} className={`${baslikFontu.className} justify-self-center whitespace-nowrap text-2xl font-bold italic sm:text-3xl`}>
        {s.genel.siteAdi}
      </Link>

      {/* Sağ: 🔍 (tıklayınca arama kutusu açılır) + KİŞİLER (bordo) */}
      <div className="flex items-center gap-2.5 justify-self-end sm:gap-4">
        {aramaAcik ? (
          // Açıkken: önerili arama kutusu (src/components/AramaKutusu.tsx). kapat: kutudan çıkınca / Esc ile kapansın
          <AramaKutusu kisiler={kisiler} dil={dil} s={s} kapat={() => setAramaAcik(false)} />
        ) : (
          // Kapalıyken: sadece büyüteç düğmesi
          <button
            type="button"
            onClick={() => setAramaAcik(true)}
            aria-label={s.header.aramayiAc}
            className="text-stone-700 transition-colors hover:text-rose-800"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        )}

        {/* KİŞİLER: bordo, BÜYÜK HARF, aralıklı (slayttaki gibi) */}
        <Link
          href={yol(dil, "/kisiler")}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-800 hover:underline sm:tracking-[0.18em]"
        >
          {s.genel.kisiler}
        </Link>
      </div>

      {/* Menü paneli: sadece acik true iken görünür (&& = "ise göster") */}
      {/* Colossus gibi soldan koyu panel. top-full: şeridin hemen altından başlar */}
      {acik && (
        <nav className="absolute left-0 top-full h-screen w-72 bg-stone-900 text-amber-50">
          <ul className="divide-y divide-stone-700">
            <li><Link href={yol(dil, "/")} onClick={() => setAcik(false)} className="block px-6 py-4 hover:text-rose-300">{s.genel.anaSayfa}</Link></li>
            <li><Link href={yol(dil, "/kisiler")} onClick={() => setAcik(false)} className="block px-6 py-4 hover:text-rose-300">{s.genel.kisiler}</Link></li>
            <li><Link href={yol(dil, "/hakkinda")} onClick={() => setAcik(false)} className="block px-6 py-4 hover:text-rose-300">{s.genel.hakkimizda}</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}