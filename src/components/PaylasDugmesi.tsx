"use client"; // Tıklamayı dinleyecek, tarayıcının paylaş menüsünü ve panosunu kullanacak → tarayıcıda çalışsın

import { useState } from "react";

// Paylaş düğmesi (kişi sayfasında, ismin ve kancanın altında)
// 📚 MDN Web Share API: navigator.share({ title, text, url }) → telefonun kendi paylaş menüsü açılır
// Plan: telefonda sistem paylaş menüsü, bilgisayarda linki kopyala
//   Telefon mu? → (pointer: coarse) = "parmakla dokunulan ekran" (dokunmatik)
//   Not: Windows'ta Chrome'da da navigator.share var; ama plan bilgisayarda kopyalama istiyor → dokunmatik değilse kopyala
type Yazilar = { paylas: string; kopyalandi: string; kopyalanamadi: string };

export default function PaylasDugmesi({ baslik, metin, s }: { baslik: string; metin: string; s: Yazilar }) {
  // Kısa süreli durum: "kopyalandı" / "kopyalanamadı" / normal
  const [durum, setDurum] = useState<"normal" | "kopyalandi" | "hata">("normal");

  async function paylas() {
    const url = window.location.href; // Şu anki sayfanın adresi (dil dahil: /en/kisiler/... ya da /kisiler/...)
    const dokunmatik = window.matchMedia("(pointer: coarse)").matches;

    // 1) Telefon + tarayıcı paylaşmayı biliyorsa: sistemin paylaş menüsü (WhatsApp, Mesajlar, Kopyala…)
    if (dokunmatik && navigator.share) {
      try {
        await navigator.share({ title: baslik, text: metin, url });
      } catch {
        // Kullanıcı menüyü kapatırsa da buraya düşer (AbortError) → hata değil, bir şey yapma
      }
      return;
    }

    // 2) Bilgisayar: linki panoya kopyala, 2 saniye "Link kopyalandı" yaz
    try {
      await navigator.clipboard.writeText(url);
      setDurum("kopyalandi");
    } catch {
      setDurum("hata"); // Pano izni yoksa (çok nadir)
    }
    setTimeout(() => setDurum("normal"), 2000);
  }

  const yazi = durum === "kopyalandi" ? s.kopyalandi : durum === "hata" ? s.kopyalanamadi : s.paylas;

  return (
    <button
      type="button"
      onClick={paylas}
      className={`inline-flex items-center gap-2 border-b pb-0.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
        durum === "kopyalandi" ? "border-green-700 text-green-700" : "border-rose-800 text-rose-800 hover:text-rose-950"
      }`}
    >
      {/* Paylaş simgesi: kutudan yukarı çıkan ok. Süs → ekran okuyucu okumasın */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      {/* aria-live: yazı "Link kopyalandı" olunca ekran okuyucu bunu da söylesin */}
      <span aria-live="polite">{yazi}</span>
    </button>
  );
}
