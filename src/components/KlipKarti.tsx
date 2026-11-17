import Image from "next/image"; // Next.js'in resim bileşeni: resmi küçültüp hızlı yükler
import Link from "next/link"; // Next.js'in link bileşeni: site içi sayfalara geçiş
import type { Person, Clip } from "@/types"; // Bizim kalıplarımız: kişi ve klip

// Bir klibi dikey kapak kartı olarak gösteren bileşen. Ana sayfa ve kişiler sayfası kullanıyor.
export default function KlipKarti({ kisi, klip }: { kisi: Person; klip: Clip }) {
  return (
    // Bütün kart bir link: tıklanınca kişinin sayfasına gider
    <Link href={`/kisiler/${kisi.slug}`} className="group block">
      {/* 9:16 kutu: resim bu kutuyu dolduracak */}
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-stone-900">
        {/* 1. katman: kapak resmi, kutuyu tamamen kaplar */}
        <Image
          src={klip.cover}
          alt={klip.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* 2. katman: alttan yukarı koyulaşan geçiş, beyaz yazı okunsun diye */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* 3. katman: başlık ve kişi adı, kartın altında */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold leading-snug">{klip.title}</h3>
          <p className="mt-1 text-sm text-white/80">{kisi.name}</p>
        </div>

        {/* 4. katman: sol üst köşede konu etiketi */}
        <span className="absolute left-3 top-3 rounded-full bg-rose-800 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
          {klip.topic}
        </span>
      </div>
    </Link>
  );
}


