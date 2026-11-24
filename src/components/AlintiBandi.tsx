import Image from "next/image"; // Next.js'in resim bileşeni
import type { Person } from "@/types"; // Kişi kalıbı

// Alıntı bandı: ekranın iki kenarına kadar uzanan koyu bant. Sayfada BİR alıntı, büyük.
// Solda yuvarlak siyah-beyaz görsel · ortada kişinin klipteki sözü (italik Lora) · sağda isim, klip başlığı, "Klibi izle"
// Alıntısı olmayan kişi gelirse hiç çizilmez (uydurma söz yok)
export default function AlintiBandi({ kisi }: { kisi: Person }) {
  const klip = kisi.clips.find((k) => k.quote); // Alıntısı olan ilk klip
  if (!klip) return null; // Alıntı yoksa bant yok
  const resim = kisi.photo?.src ?? klip.cover; // Fotoğraf yoksa reel kapağı

  return (
    <section className="mt-20 bg-stone-900 px-[clamp(16px,3.2vw,56px)] py-16 text-amber-50">
      {/* Telefonda alt alta, geniş ekranda 3 parça yan yana (görsel · alıntı · künye) */}
      <figure className="flex flex-col gap-8 md:flex-row md:items-center md:gap-14">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full md:h-44 md:w-44">
          <Image src={resim} alt="" fill sizes="176px" className="object-cover grayscale" />
        </div>

        {/* blockquote = "bu başkasının sözü". Tırnak süs (aria-hidden) */}
        <blockquote className="flex-1 font-serif text-3xl italic leading-tight sm:text-5xl lg:text-6xl">
          <span aria-hidden="true" className="text-rose-300">
            “
          </span>
          {klip.quote}
        </blockquote>

        {/* Künye: kim söyledi, hangi klipte. Sağa yaslı (geniş ekranda) */}
        <figcaption className="shrink-0 md:text-right">
          <p className="text-lg font-semibold">{kisi.name}</p>
          <p className="mt-1 text-stone-300">{klip.title}</p>
          <a
            href={klip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block border-b border-amber-50/60 pb-0.5 transition-colors hover:border-rose-300 hover:text-rose-300"
          >
            Klibi izle
          </a>
        </figcaption>
      </figure>
    </section>
  );
}