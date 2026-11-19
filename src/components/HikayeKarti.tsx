import Image from "next/image"; // Next.js'in resim bileşeni
import Link from "next/link"; // Site içi sayfalara geçiş
import type { Person } from "@/types"; // Kişi kalıbı

// Hikâye kartı: KUTU YOK (Colossus gibi). Üstte siyah-beyaz görsel, altında konu, isim, kanca, klip sayısı.
// 3 düzen:
//  "one"   → öne çıkan: büyük dikey görsel + altında krem panel, her şey ortalı, isim çok büyük
//  "orta"  → öne çıkanın yanındaki kolonlar: yatay (16:10) görsel, yazılar ortalı
//  "album" → Bütün hikâyeler albümü: kare görsel, yazılar sola yaslı
type Duzen = "one" | "orta" | "album";

export default function HikayeKarti({ kisi, duzen = "album" }: { kisi: Person; duzen?: Duzen }) {
  const klip = kisi.clips[0]; // Konu ve (fotoğraf yoksa) kapak için ilk klip
  // Görsel: Wikipedia fotoğrafı varsa o, yoksa reel kapağı
  const fotografVar = Boolean(kisi.photo);
  const resim = kisi.photo?.src ?? klip.cover;
  const ortali = duzen !== "album";

  // Görsel kutusunun oranı ve sizes (tarayıcıya "ekranda bu genişlikte" demek)
  const kutu = duzen === "one" ? "aspect-[6/7]" : duzen === "orta" ? "aspect-[16/10]" : "aspect-square";
  const sizes =
    duzen === "one"
      ? "(min-width: 1024px) 50vw, 100vw"
      : duzen === "orta"
        ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        : "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw";

  return (
    <Link href={`/kisiler/${kisi.slug}`} className="group block">
      {/* Görsel: siyah-beyaz (grayscale), kutuyu doldurur (object-cover).
          Fotoğraf: object-[50%_25%] = yatayda orta, dikeyde üstten %25 → portrelerde saçın üstü de sığar (Elon, Mark),
          Acun'un kalabalık fotoğrafında hem tribün hem yüzü görünür
          Reel kapağı: kenarlarında siyah/beyaz çerçeve var → biraz büyüt (scale-[1.15]) çerçeve dışarıda kalsın,
          dikeyde %40'a odaklan → kafa kesilmeden yüz sığar · kare albümde daha çok büyüt (scale-125), üstteki yazı görünmesin */}
      <div className={`relative overflow-hidden bg-stone-900 ${kutu}`}>
        <Image
          src={resim}
          alt="" // Süs: isim hemen altında yazıyor
          fill
          sizes={sizes}
          loading="lazy"
          className={`object-cover grayscale transition-transform duration-500 ${
            fotografVar
              ? "object-[50%_25%] group-hover:scale-105"
              : duzen === "album"
                ? "scale-125 group-hover:scale-[1.3]"
                : "scale-[1.15] object-[50%_40%] group-hover:scale-[1.2]"
          }`}
        />
      </div>

      {/* Yazılar. Öne çıkanda krem panel (bg-amber-100/50) */}
      <div className={`${ortali ? "text-center" : ""} ${duzen === "one" ? "bg-amber-100/50 px-6 py-10" : "pt-5"}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-800">{klip.topic}</p>
        <h3
          className={`mt-2 font-serif leading-tight transition-colors group-hover:text-rose-800 ${
            duzen === "one" ? "text-5xl sm:text-6xl" : duzen === "orta" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {kisi.name}
        </h3>
        {/* Kanca: tek cümlelik tanıtım */}
        <p className={`mt-3 leading-relaxed text-stone-600 ${duzen === "one" ? "mx-auto max-w-md text-xl" : "text-base"}`}>
          {kisi.dek}
        </p>
        {/* Ortalı düzende: ince kısa çizgi + italik klip sayısı · albümde: küçük düz yazı */}
        {ortali ? (
          <>
            <span className="mx-auto mt-5 block h-px w-16 bg-stone-300" />
            <p className="mt-3 font-serif italic text-stone-500">{kisi.clips.length} klip</p>
          </>
        ) : (
          <p className="mt-3 text-sm text-stone-500">{kisi.clips.length} klip</p>
        )}
      </div>
    </Link>
  );
}