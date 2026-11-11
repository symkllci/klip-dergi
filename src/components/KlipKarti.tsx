import Image from "next/image"; // Next.js'in resim bileşeni
import Link from "next/link"; // Site içi sayfalara geçiş
import type { Person, Clip } from "@/types"; // Kişi ve klip kalıpları

// Kartın 3 bedeni: küçük (varsayılan), büyük (öne çıkan), yatay (kapak solda, yazı sağda)
type Boyut = "kucuk" | "buyuk" | "yatay";

// boyut = "kucuk": beden söylenmezse küçük giysin
export default function KlipKarti({ kisi, klip, boyut = "kucuk" }: { kisi: Person; klip: Clip; boyut?: Boyut }) {
  const buyuk = boyut === "buyuk"; // Büyük mü?
  const yatay = boyut === "yatay"; // Yatay mı?

  return (
    // Kutu: yuvarlak, ince çerçeve. Fare gelince hafif kalkar ve bordo gölge
    <Link
      href={`/kisiler/${kisi.slug}`}
      className={`group flex h-full rounded-3xl border border-amber-200/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-900/15 ${
        buyuk ? "bg-amber-100/60" : "bg-white/70"
      } ${yatay ? "items-center gap-5 text-left" : "flex-col justify-center text-center"}`}
    >
      {/* Sadece büyük kartta: "Öne çıkan" rozeti */}
      {buyuk && (
        <span className="mb-4 self-center rounded-full bg-rose-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          Öne çıkan
        </span>
      )}

      {/* Kapak: 9:16, kırpılmadan. Genişliği bedene göre */}
      <div
        className={`relative aspect-[9/16] shrink-0 overflow-hidden rounded-2xl bg-stone-900 ${
          yatay ? "w-28" : buyuk ? "mx-auto w-3/5" : "mx-auto w-1/2"
        }`}
      >
        <Image
          src={klip.cover}
          alt={klip.title}
          fill
          sizes={buyuk ? "(min-width: 1024px) 22vw, 60vw" : yatay ? "112px" : "(min-width: 1024px) 12vw, 50vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Yazılar */}
      <div className={yatay ? "" : "pt-4"}>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</p>
        <h3
          className={`mt-2 font-serif font-bold leading-tight transition-colors group-hover:text-rose-800 ${
            buyuk ? "text-3xl sm:text-4xl" : "text-xl"
          }`}
        >
          {klip.title}
        </h3>
        {/* Tek cümle (kanca): 4. maddede eklenecek */}
        {/* Bordo kısa çizgi + italik isim */}
        <span className={`mb-2 mt-3 block h-0.5 w-9 rounded bg-rose-800 ${yatay ? "" : "mx-auto"}`} />
        <p className="font-serif text-sm italic text-stone-500">{kisi.name}</p>
      </div>
    </Link>
  );
}