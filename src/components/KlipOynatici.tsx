"use client"; // Tıklamayı duyacak ve useState kullanacak → tarayıcıda çalışsın

import { useState } from "react"; // Hafıza: oynatıldı mı?
import Image from "next/image"; // Kapak resmi
import type { Clip } from "@/types"; // Klip kalıbı

// Klibin embed (gömme) adresi: kişi sayfasından buraya taşındı
function embedAdresi(klip: Clip): string {
  if (klip.platform === "instagram") return klip.url + "embed"; // .../reel/KOD/embed
  return klip.url.replace("watch?v=", "embed/"); // YouTube: .../embed/KOD
}

// Klip oynatıcı: önce kapak + ▶, tıklanınca Instagram yüklenir (sayfa hızlı açılsın)
export default function KlipOynatici({ klip }: { klip: Clip }) {
  const [oynat, setOynat] = useState(false); // ⭐ Oynatıldı mı? Başta: hayır (ışık düğmesi kapalı)

  // Oynatıldıysa: gerçek Instagram penceresi (ağır, ama artık sadece istenince)
  if (oynat) {
    return (
      <iframe
        src={embedAdresi(klip)}
        title={klip.title}
        width="320"
        height="570"
        className="rounded-lg border border-stone-300 bg-white"
        allowFullScreen
      ></iframe>
    );
  }

  // Oynatılmadıysa: hafif kapak + ortada bordo ▶ düğmesi (aynı boyutta, sayfa kaymasın)
  return (
    <button
      type="button"
      onClick={() => setOynat(true)}
      aria-label={`Klibi oynat: ${klip.title}`}
      className="group relative block aspect-[9/16] w-[320px] overflow-hidden rounded-lg bg-stone-900"
    >
      <Image
        src={klip.cover}
        alt=""
        fill
        sizes="320px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* ▶ düğmesi: ortada, bordo yuvarlak, üstüne gelince büyür */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-800 text-2xl text-white shadow-xl transition-transform group-hover:scale-110">
          ▶
        </span>
      </span>
    </button>
  );
}