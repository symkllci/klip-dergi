"use client"; // Tarayıcıda çalışsın: tıklama, kaydırma, hafıza (state), alarm

import { useEffect, useLayoutEffect, useRef, useState } from "react"; // useLayoutEffect = ekran çizilmeden HEMEN önce çalışan useEffect
import Link from "next/link"; // Site içi sayfalara geçiş
import Image from "next/image"; // Resmi küçültüp hızlı yükler
import type { Person } from "@/types"; // Kişi kalıbı

// Kendiliğinden kayma aralığı: 5 saniye
const KAYMA_SURESI = 5000;
// Kaydırma bitti mi? Son kaydırmadan 150 ms sonra hâlâ hareket yoksa "bitti" sayıyoruz
const BEKLEME = 150;

// Şeridi "sira"ncı karta kaydır: kart şeridin TAM ORTASINA gelsin
// davranis: "smooth" = yumuşak kayma · "instant" = göz fark etmeden ışınlanma
function seridiKaydir(serit: HTMLDivElement | null, sira: number, davranis: ScrollBehavior = "smooth") {
  const hedef = serit?.children[sira] as HTMLElement | undefined; // Hedef kart
  if (serit && hedef) {
    // Ortalamak için: hedefin solu − (şerit genişliği − kart genişliği) / 2
    const sol = hedef.offsetLeft - (serit.clientWidth - hedef.clientWidth) / 2;
    serit.scrollTo({ left: sol, behavior: davranis });
  }
}

// Vitrin: ortada büyük hikâye, yanlarda sıradakiler soluk (sonsuz döngü)
export default function Vitrin({ kisiler }: { kisiler: Person[] }) {
  const adet = kisiler.length; // Gerçek kişi sayısı (5)

  // ♾️ SONSUZ DÖNGÜ: kartları 3 kez yan yana diz → [kopya] [GERÇEK] [kopya] = 15 kart
  // Şeritteki sıra (0–14) ≠ kişi sırası (0–4). Kişi sırası = şerit sırası % adet
  const dizi = [...kisiler, ...kisiler, ...kisiler];

  const [konum, setKonum] = useState(adet); // Şeritte hangi kart ortada? Başlangıç: GERÇEK grubun 1. kartı (5)
  const aktif = konum % adet; // Noktalar için kişi sırası (0–4). Örn. 7 % 5 = 2
  const seritRef = useRef<HTMLDivElement>(null); // Şeridi elde tut
  const beklemeRef = useRef<ReturnType<typeof setTimeout> | null>(null); // "Kaydırma bitti mi" zamanlayıcısı

  // İlk açılış: ekran çizilmeden önce GERÇEK grubun 1. kartını ortaya getir → iki yanı dolu görünür
  useLayoutEffect(() => {
    seridiKaydir(seritRef.current, adet, "instant");
  }, [adet]);

  // Kendiliğinden kayma: 5 sn'de bir sağdaki karta geç
  useEffect(() => {
    // Hareket azaltma: ziyaretçi cihazında "hareketi azalt" açtıysa kendiliğinden kayma olmasın
    const hareketAzalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hareketAzalt) return; // Hareket istemiyorsa alarmı kurma, çık

    const zamanlayici = setInterval(() => {
      seridiKaydir(seritRef.current, konum + 1); // Hep bir sağa (sondan sonra kopyanın 1. kartı)
      setKonum(konum + 1);
    }, KAYMA_SURESI);
    return () => clearInterval(zamanlayici); // Giderken alarmı kapat
  }, [konum]);

  // Oklar ve noktalar için: şeritteki "sira"ncı karta yumuşakça git
  function git(sira: number) {
    seridiKaydir(seritRef.current, sira);
    setKonum(sira);
  }

  // Kaydırma sırasında: hangi kart ortada, bul. Kaydırma bitince kopyadaysak GERÇEK gruba ışınlan
  function kaydirinca() {
    const serit = seritRef.current;
    if (!serit || serit.children.length < 2) return;
    const ilk = serit.children[0] as HTMLElement;
    const ikinci = serit.children[1] as HTMLElement;
    const adim = ikinci.offsetLeft - ilk.offsetLeft; // Bir karttan ötekine mesafe (genişlik + boşluk)
    // Ortadaki kart: (kaydırılan + yarım boşluk − ilk kartın solu) / adım
    const kenar = (serit.clientWidth - ilk.clientWidth) / 2;
    const ortadaki = Math.round((serit.scrollLeft + kenar - ilk.offsetLeft) / adim);
    setKonum(ortadaki); // Noktalar ve büyük kart kaydırmayı takip etsin

    // Kaydırma bitti mi? Her kaydırmada sayacı baştan kur; 150 ms sessizlik = bitti
    if (beklemeRef.current) clearTimeout(beklemeRef.current);
    beklemeRef.current = setTimeout(() => {
      // Soldaki kopyadaysak (0–4) → +5 · sağdaki kopyadaysak (10–14) → −5. Aynı kişi, GERÇEK grupta
      if (ortadaki < adet || ortadaki >= adet * 2) {
        const gercek = (ortadaki % adet) + adet; // Örn. 10 → 0 + 5 = 5 · 4 → 4 + 5 = 9
        seridiKaydir(serit, gercek, "instant"); // Işınlan: kartlar aynı, göz fark etmez
        setKonum(gercek);
      }
    }, BEKLEME);
  }

  return (
    // relative: oklar bu kutuya göre konumlansın (absolute)
    <section className="relative mt-10">
      {/* Şerit: yan yana, ortaya oturan (snap-center), çubuksuz.
          Artık iki yanda boşluk (px) yok: solda ve sağda hep kopya kartlar var */}
      <div
        ref={seritRef}
        onScroll={kaydirinca}
        className="relative flex snap-x snap-mandatory items-start gap-7 overflow-x-auto pb-4 pt-4 scrollbar-gizle"
      >
        {dizi.map((kisi, sira) => {
          const klip = kisi.clips[0];
          const ortada = sira === konum; // Bu kart ortadaki mi?
          const gercek = sira >= adet && sira < adet * 2; // GERÇEK grupta mı (5–9)?
          return (
            <Link
              key={`${sira}-${kisi.slug}`} // Aynı kişi 3 kez var → key'e şerit sırası da eklendi (benzersiz olsun)
              href={`/kisiler/${kisi.slug}`}
              // Kopyalar ekran okuyucuya ve Tab tuşuna gizli: her kişi bir kez okunsun
              aria-hidden={gercek ? undefined : true}
              tabIndex={gercek ? undefined : -1}
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
                  alt={gercek ? klip.title : ""} // Kopyada boş alt: aynı yazı 3 kez okunmasın
                  fill
                  loading={sira === adet ? "eager" : "lazy"} // İlk ortadaki kart hemen yüklensin (LCP)
                  sizes="300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Yazılar: alttaki kartlarla aynı, ortalı. Sadece ortadakinde görünür */}
              <div className={`pt-5 transition-opacity duration-500 ${ortada ? "opacity-100" : "opacity-0"}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">{klip.topic}</p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">{klip.title}</h2>
                <p className="mt-2 font-serif text-base leading-relaxed text-stone-600">{kisi.dek}</p>
                <span className="mx-auto mb-2 mt-3 block h-0.5 w-9 rounded bg-rose-800" />
                <p className="font-serif text-sm italic text-stone-500">{kisi.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Oklar: aktif kartın iki kenarında, kapağın tam ortası hizasında.
          Kart 260px (sm: 300px) → yarısı 130px (sm: 150px). Ok, kartın kenarına yarı biner (-translate-x-1/2).
          top: üst boşluk 16px + kapak yüksekliğinin yarısı (260 × 16/9 ÷ 2 ≈ 231 · 300 × 16/9 ÷ 2 ≈ 267) */}
      <button
        type="button"
        onClick={() => git(konum - 1)} // Hep bir sola: sayıyı başa sarmak yok, kopya karta geçer
        aria-label="Önceki hikâye"
        className="absolute left-[calc(50%-130px)] top-[247px] z-10 -translate-x-1/2 -translate-y-1/2 shadow-md sm:left-[calc(50%-150px)] sm:top-[283px] flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-600 transition-colors hover:border-rose-800 hover:bg-rose-800 hover:text-white"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => git(konum + 1)} // Hep bir sağa: sondan sonra kopyanın 1. kartı gelir
        aria-label="Sonraki hikâye"
        className="absolute right-[calc(50%-130px)] top-[247px] z-10 translate-x-1/2 -translate-y-1/2 shadow-md sm:right-[calc(50%-150px)] sm:top-[283px] flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-600 transition-colors hover:border-rose-800 hover:bg-rose-800 hover:text-white"
      >
        →
      </button>

      {/* Alt satır: sadece noktalar (oklar yukarı, kartın yanına taşındı) */}
      <div className="mt-2 flex justify-center gap-2">
        {kisiler.map((kisi, sira) => (
          <button
            key={kisi.slug}
            type="button"
            onClick={() => git(konum - aktif + sira)} // Aynı grup içinde o kişiye git
            aria-label={`${sira + 1}. hikâye: ${kisi.name}`}
            className={`h-2 rounded-full transition-all ${
              sira === aktif ? "w-7 bg-rose-800" : "w-2 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}