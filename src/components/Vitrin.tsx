"use client"; // Tarayıcıda çalışsın: tıklama, kaydırma, hafıza (state), alarm

import { useEffect, useRef, useState } from "react"; // useState = hafıza · useRef = kutuyu elde tutmak · useEffect = alarm/kulak
import Link from "next/link"; // Site içi sayfalara geçiş
import Image from "next/image"; // Resmi küçültüp hızlı yükler
import type { Person } from "@/types"; // Kişi kalıbı

// Kendiliğinden kayma aralığı: 5 saniye
const KAYMA_SURESI = 5000;

// Şeridi "sira"ncı hikâyeye kaydır: hikâye şeridin TAM ORTASINA gelsin
function seridiKaydir(serit: HTMLDivElement | null, sira: number) {
  const hedef = serit?.children[sira] as HTMLElement | undefined; // Hedef hikâye kutusu
  if (serit && hedef) {
    // Ortalamak için: hedefin solu − (şerit genişliği − hikâye genişliği) / 2
    const sol = hedef.offsetLeft - (serit.clientWidth - hedef.clientWidth) / 2;
    serit.scrollTo({ left: sol, behavior: "smooth" }); // Yumuşakça kaydır
  }
}

// Vitrin: ortada büyük hikâye, yanlarda sıradakiler soluk (kayan)
export default function Vitrin({ kisiler }: { kisiler: Person[] }) {
  const [aktif, setAktif] = useState(0); // Hangi hikâye ortada? (kitap ayracı)
  const seritRef = useRef<HTMLDivElement>(null); // Şeridi elde tut

  // Kendiliğinden kayma: 5 sn'de bir sıradakine geç
  useEffect(() => {
    // Hareket azaltma: ziyaretçi cihazında "hareketi azalt" açtıysa kendiliğinden kayma olmasın
    const hareketAzalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hareketAzalt) return; // Hareket istemiyorsa alarmı kurma, çık

    const zamanlayici = setInterval(() => {
      const yeni = (aktif + 1) % kisiler.length; // Sondan sonra başa dön
      seridiKaydir(seritRef.current, yeni);
      setAktif(yeni);
    }, KAYMA_SURESI);
    return () => clearInterval(zamanlayici); // Giderken alarmı kapat
  }, [aktif, kisiler.length]);

  // Ok ve noktalar için: verilen hikâyeye git
  function git(sira: number) {
    const yeni = (sira + kisiler.length) % kisiler.length; // -1 → son, 5 → 0
    seridiKaydir(seritRef.current, yeni);
    setAktif(yeni);
  }

  // Elle kaydırınca: hangi hikâye ortada, bul (noktalar takip etsin)
  function kaydirinca() {
    const serit = seritRef.current;
    if (!serit || serit.children.length < 2) return;
    const ilk = serit.children[0] as HTMLElement;
    const ikinci = serit.children[1] as HTMLElement;
    const adim = ikinci.offsetLeft - ilk.offsetLeft; // Bir hikâyeden ötekine mesafe (genişlik + boşluk)
    setAktif(Math.round(serit.scrollLeft / adim)); // Kaç adım kaydı?
  }

  return (
    <section className="mt-10">
      {/* Şerit: yan yana, ortaya oturan (snap-center), çubuksuz.
          px-[calc(50%-...)]: ilk ve son hikâye de ortaya gelebilsin diye iki yanda boşluk */}
      <div
        ref={seritRef}
        onScroll={kaydirinca}
        className="relative flex snap-x snap-mandatory items-start gap-7 overflow-x-auto px-[calc(50%-130px)] pb-4 pt-4 scrollbar-gizle sm:px-[calc(50%-150px)]"
      >
        {kisiler.map((kisi, sira) => {
          const klip = kisi.clips[0];
          const ortada = sira === aktif; // Bu hikâye ortadaki mi?
          return (
            <Link
              key={kisi.slug}
              href={`/kisiler/${kisi.slug}`}
              // Ortadaki: tam boy, net · yandakiler: küçük (scale-90) ve soluk (opacity-40)
              className={`group w-[260px] shrink-0 snap-center text-center transition-all duration-500 sm:w-[300px] ${
                ortada ? "scale-100 opacity-100" : "scale-90 opacity-40"
              }`}
            >
              {/* Kapak: 9:16, kırpılmadan. Ortadakinin altında bordo gölge */}
              <div
                className={`relative aspect-[9/16] overflow-hidden rounded-2xl bg-stone-900 transition-shadow duration-500 ${
                  ortada ? "shadow-2xl shadow-rose-900/30" : ""
                }`}
              >
                <Image
                  src={klip.cover}
                  alt={klip.title}
                  fill
                  loading={sira === 0 ? "eager" : "lazy"} // İlk hikâye hemen yüklensin (LCP)
                  sizes="300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Yazılar: alttaki kartlarla aynı, ortalı. Sadece ortadakinde görünür */}
              <div className={`pt-5 transition-opacity duration-500 ${ortada ? "opacity-100" : "opacity-0"}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">{klip.title}</h2>
                {/* Tek cümle (kanca): 4. maddede eklenecek */}
                <span className="mx-auto mb-2 mt-3 block h-0.5 w-9 rounded bg-rose-800" />
                <p className="font-serif text-sm italic text-stone-500">{kisi.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alt satır: ← noktalar → */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => git(aktif - 1)}
          aria-label="Önceki hikâye"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-600 transition-colors hover:border-rose-800 hover:bg-rose-800 hover:text-white"
        >
          ←
        </button>

        <div className="flex gap-2">
          {kisiler.map((kisi, sira) => (
            <button
              key={kisi.slug}
              type="button"
              onClick={() => git(sira)}
              aria-label={`${sira + 1}. hikâye: ${kisi.name}`}
              className={`h-2 rounded-full transition-all ${
                sira === aktif ? "w-7 bg-rose-800" : "w-2 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => git(aktif + 1)}
          aria-label="Sonraki hikâye"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-600 transition-colors hover:border-rose-800 hover:bg-rose-800 hover:text-white"
        >
          →
        </button>
      </div>
    </section>
  );
}