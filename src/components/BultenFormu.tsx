"use client"; // Yazmayı, tıklamayı ve sunucudan gelen cevabı dinleyecek → tarayıcıda çalışsın

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { yol, type Dil, type Sozluk } from "@/lib/sozluk";

// Bülten kayıt formu: ana sayfadaki kutuda ve /bulten sayfasında AYNI bileşen
// Form → /api/bulten (POST) → cevap: { ok: true } ya da { ok: false, kod: "gecersizEposta" | "ayniEposta" | "onayYok" }
// Hata mesajları sözlükte (s.bulten[kod]): Türkçe sayfada Türkçe, İngilizce sayfada İngilizce
type Durum = { tur: "bos" } | { tur: "gonderiliyor" } | { tur: "basarili" } | { tur: "hata"; kod: HataKodu };
type HataKodu = "gecersizEposta" | "ayniEposta" | "onayYok" | "genelHata";

export default function BultenFormu({ dil, s }: { dil: Dil; s: Sozluk }) {
  const [eposta, setEposta] = useState("");
  const [onay, setOnay] = useState(false);
  const [durum, setDurum] = useState<Durum>({ tur: "bos" });

  async function gonder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Sayfa yenilenmesin, isteği kendimiz gönderelim
    setDurum({ tur: "gonderiliyor" });
    try {
      const cevap = await fetch("/api/bulten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eposta, onay, dil }),
      });
      const veri: { ok: boolean; kod?: HataKodu } = await cevap.json();
      if (veri.ok) {
        setDurum({ tur: "basarili" });
        setEposta("");
        setOnay(false);
      } else {
        setDurum({ tur: "hata", kod: veri.kod ?? "genelHata" });
      }
    } catch {
      setDurum({ tur: "hata", kod: "genelHata" }); // İnternet yok, sunucu cevap vermedi…
    }
  }

  const b = s.bulten;
  return (
    // noValidate: tarayıcının kendi İngilizce uyarı balonunu kapat, hatayı bizim sunucumuz Türkçe söylesin
    <form onSubmit={gonder} noValidate className="mx-auto max-w-md text-left">
      <label htmlFor="bulten-eposta" className="sr-only">
        {b.eposta}
      </label>
      <div className="flex items-center gap-2 border-b border-stone-400 focus-within:border-rose-800">
        <input
          id="bulten-eposta"
          type="email"
          name="eposta"
          autoComplete="email"
          placeholder={b.yerTutucu}
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
          className="w-full min-w-0 bg-transparent py-2 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={durum.tur === "gonderiliyor"}
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-rose-800 transition-colors hover:text-rose-950 disabled:opacity-50"
        >
          {durum.tur === "gonderiliyor" ? b.gonderiliyor : b.dugme}
        </button>
      </div>

      {/* Onay kutusu: işaretlenmeden kayıt olmaz (sunucu da kontrol ediyor). Başta İŞARETSİZ: onayı kullanıcı kendisi verir */}
      <label className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-stone-600">
        <input
          type="checkbox"
          checked={onay}
          onChange={(e) => setOnay(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-rose-800"
        />
        <span>{b.onayMetni}</span>
      </label>
      <p className="mt-1 pl-6 text-xs text-stone-500">
        {b.ayrintilar}{" "}
        <Link href={yol(dil, "/gizlilik")} className="text-rose-800 underline hover:text-rose-950">
          {s.gizlilik.baslik}
        </Link>
      </p>

      {/* Sonuç mesajı. aria-live: ekran okuyucu mesajı yüksek sesle söylesin */}
      <p aria-live="polite" className="mt-4 min-h-[1.5em] text-sm">
        {durum.tur === "basarili" && <span className="text-green-700">✓ {b.basarili}</span>}
        {durum.tur === "hata" && <span className="text-rose-800">{b[durum.kod]}</span>}
      </p>
    </form>
  );
}