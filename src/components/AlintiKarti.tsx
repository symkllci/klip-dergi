import Image from "next/image"; // Next.js'in resim bileşeni
import Link from "next/link"; // Site içi sayfalara geçiş
import type { Person } from "@/types"; // Kişi kalıbı

// Alıntı duvarındaki tek kart: kişinin klipten bir cümlesi büyük ve italik,
// altında yuvarlak küçük resim + isim + klip başlığı. Tıklayınca kişi sayfası açılır.
// koyu = true → koyu zemin (duvarda bazı kartlar koyu olsun, düz görünmesin)
export default function AlintiKarti({ kisi, koyu = false }: { kisi: Person; koyu?: boolean }) {
  // Alıntısı olan ilk klip. Yoksa (Efe, Mark) ilk klip
  const alintili = kisi.clips.find((klip) => klip.quote);
  const klip = alintili ?? kisi.clips[0]; // ?? = "soldaki yoksa sağdakini al"
  // Yuvarlak resim: Wikipedia fotoğrafı varsa o, yoksa reel kapağı
  const resim = kisi.photo?.src ?? klip.cover;

  return (
    <Link
      href={`/kisiler/${kisi.slug}`}
      className={`group block rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-900/15 ${
        koyu ? "bg-stone-900 text-amber-50" : "bg-amber-100/70 text-stone-900"
      }`}
    >
      {alintili ? (
        // Alıntı VAR: büyük bordo tırnak + kişinin kendi sözü (blockquote = "bu başkasının sözü")
        <>
          <span aria-hidden="true" className="block font-serif text-5xl leading-none text-rose-600">
            “
          </span>
          <blockquote className="-mt-3 font-serif text-xl italic leading-snug">{alintili.quote}</blockquote>
        </>
      ) : (
        // Alıntı YOK: tırnak koymuyoruz (uydurma söz olmasın). Yerine klip başlığı
        <p className="font-serif text-xl font-bold leading-snug">{klip.title}</p>
      )}

      {/* Alt satır: yuvarlak resim + isim + klip başlığı / klip sayısı */}
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={resim}
            alt="" // Süs: isim hemen yanında yazıyor, ekran okuyucu iki kez okumasın
            fill
            sizes="40px"
            className="object-cover grayscale"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold transition-colors group-hover:text-rose-600">{kisi.name}</p>
          <p className={`truncate text-xs ${koyu ? "text-stone-400" : "text-stone-500"}`}>
            {alintili ? klip.title : `${kisi.clips.length} klip`}
          </p>
        </div>
      </div>
    </Link>
  );
}