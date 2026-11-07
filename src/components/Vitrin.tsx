"use client"; // Bu bileşen tarayıcıda da çalışsın: ileride oklar ve otomatik kayma için state kullanacağız

import Link from "next/link"; // Site içi sayfalara geçiş
import Image from "next/image"; // Kapak resimleri için Next.js'in resim bileşeni
import { Lora } from "next/font/google"; // Başlık fontu, ana sayfayla aynı
import type { Person } from "@/types"; // Kişi kalıbı

// Başlık fontu: ana sayfadakiyle aynı Lora (sayfadan buraya taşındı)
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// Tarihi Türkçe uzun biçime çeviren tarif: "2026-09-24" → "24 Eylül 2026" (sayfadan buraya taşındı)
function tarihYaz(tarih: string): string {
  return new Date(tarih).toLocaleDateString("tr-TR", {
    day: "numeric", // gün: 24
    month: "long", // ay: Eylül
    year: "numeric", // yıl: 2026
  });
}

// Vitrin: 5 hikâye yan yana, yatay kayan şerit. kisiler: vitrinde gösterilecek kişiler
export default function Vitrin({ kisiler }: { kisiler: Person[] }) {
  return (
    <section className="mt-10">
      {/* flex: yan yana diz · overflow-x-auto: yatayda kaydır · snap-x snap-mandatory: her kaydırmada bir hikâyeye otur */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {kisiler.map((kisi, sira) => {
          const klip = kisi.clips[0]; // Bu hikâyede kişinin ilk klibi
          return (
            // w-full shrink-0: her hikâye şeridin tam genişliği kadar, küçülmesin · snap-start: sol kenarı şeride otursun
            <Link
              key={kisi.slug}
              href={`/kisiler/${kisi.slug}`}
              className="group grid w-full shrink-0 snap-start overflow-hidden rounded-lg border border-stone-900 bg-white md:grid-cols-2"
            >
              {/* Büyük kapak: kutuyu doldurur, üstüne gelince hafifçe büyür */}
              <div className="relative h-80 overflow-hidden bg-stone-900 md:h-auto md:min-h-80">
                <Image
                  src={klip.cover}
                  alt={klip.title}
                  fill
                  // Sadece ilk hikâye ilk ekranda: o hemen (eager), diğerleri tembel (lazy) yüklensin (LCP)
                  loading={sira === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">
                  Öne çıkan · {klip.topic}
                </p>
                {/* Hikâye anlatan büyük başlık */}
                <h2 className={`${baslikFontu.className} mt-3 text-4xl font-bold leading-tight lg:text-5xl`}>
                  {klip.title}
                </h2>
                {/* Bir cümlelik alt başlık */}
                <p className="mt-4 text-lg text-stone-600">{kisi.bio.split(". ")[0]}.</p>
                {/* Kişi · tarih satırı */}
                <p className="mt-4 text-sm text-stone-500">
                  {kisi.name} · {tarihYaz(klip.publishedAt)}
                </p>
                {/* Kişi sayfasına link yazısı */}
                <p className="mt-6 text-sm font-semibold uppercase tracking-wider transition-colors group-hover:text-rose-800">
                  Hikâyeyi oku →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}