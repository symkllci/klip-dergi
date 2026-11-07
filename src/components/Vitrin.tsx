"use client"; // Bu bileşen tarayıcıda (istemcide) da çalışsın: tıklamayı duyacak, hafıza (state) tutacak, alarm kuracak

import { useEffect, useRef, useState } from "react"; // React'ten üç araç: useState = hafıza · useRef = kutuyu elde tutmak · useEffect = ekrana çıkınca/giderken iş (YENİ)
import Link from "next/link"; // Next.js'in link bileşeni: site içi sayfalara geçiş
import Image from "next/image"; // Next.js'in resim bileşeni: resmi küçültüp hızlı yükler
import { Lora } from "next/font/google"; // Google Fonts'tan Lora yazı tipi (ana sayfayla aynı)
import type { Person } from "@/types"; // Bizim kişi kalıbımız (types.ts'ten)

// Başlık fontu: ana sayfadakiyle aynı Lora. latin-ext: Türkçe harfler (ş, ğ, ı, İ) için
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// Kendiliğinden kayma aralığı: 5000 milisaniye = 5 saniye (YENİ)
const KAYMA_SURESI = 5000;

// Tarihi Türkçe uzun biçime çeviren tarif: "2026-09-24" → "24 Eylül 2026"
function tarihYaz(tarih: string): string { // tarih: "2026-09-24" gibi bir yazı alır, yazı döndürür
  return new Date(tarih).toLocaleDateString("tr-TR", { // Yazıyı tarihe çevir, Türkçe kurallarla yaz
    day: "numeric", // gün: sayı olarak (24)
    month: "long", // ay: uzun adıyla (Eylül)
    year: "numeric", // yıl: sayı olarak (2026)
  });
}

// YENİ: Şeridi "sira"ncı hikâyeye yumuşakça kaydıran yardımcı tarif.
// Bileşenin dışında, çünkü hem oklar (git) hem alarm (useEffect) kullanıyor: kodu iki kere yazmayalım (kurabiye kalıbı)
function seridiKaydir(serit: HTMLDivElement | null, sira: number) { // serit: kaydırılacak kutu (yoksa null) · sira: hedef hikâye
  const hedef = serit?.children[sira] as HTMLElement | undefined; // Şeridin içindeki "sira"ncı hikâye kutusu. ?. = şerit yoksa hata verme
  if (serit && hedef) { // Hem şerit hem hedef varsa
    serit.scrollTo({ left: hedef.offsetLeft, behavior: "smooth" }); // Hedefin sol kenarına kadar yumuşakça kaydır
  }
}

// Vitrin bileşeni: 5 hikâye yan yana kayan şerit + oklar + noktalar + kendiliğinden kayma
// { kisiler }: sayfadan gelen props. Person[] = Person listesi (köşeli parantez = liste)
export default function Vitrin({ kisiler }: { kisiler: Person[] }) {
  // Hafıza kutusu (state): şu an kaçıncı hikâyedeyiz? Başlangıçta 0 (ilk hikâye). Kitap ayracı gibi.
  // aktif = kutudaki değer · setAktif = değeri değiştiren ve ekranı yeniden çizdiren fonksiyon
  const [aktif, setAktif] = useState(0);
  // Şeridi elimizde tutuyoruz (ref). Başta boş (null), ekrana çizilince dolar.
  const seritRef = useRef<HTMLDivElement>(null);

  // YENİ: Kendiliğinden kayma. useEffect = bileşen ekrandayken alarm kur, giderken kapat.
  useEffect(() => {
    // setInterval: tekrarlayan alarm. Her KAYMA_SURESI'nde (5 sn) içindeki kod çalışır
    const zamanlayici = setInterval(() => {
      const yeni = (aktif + 1) % kisiler.length; // Sıradaki hikâye. % sayesinde sondan sonra başa döner
      seridiKaydir(seritRef.current, yeni); // Şeridi oraya kaydır
      setAktif(yeni); // Hafızayı güncelle: bordo nokta ilerlesin
    }, KAYMA_SURESI);
    // Temizlik: alarmı kapat. Kapatmazsak her değişiklikte yeni alarm birikir (iki alarm aynı anda çalar)
    return () => clearInterval(zamanlayici);
  }, [aktif, kisiler.length]); // aktif değişince eski alarmı kapat, yenisini kur (oka basınca 5 sn baştan sayar)

  // git: verilen sıradaki hikâyeye kay. Oklar ve noktalar bunu çağırıyor.
  function git(sira: number) { // sira: gitmek istediğimiz hikâyenin numarası (bazen -1 ya da 5 gelebilir)
    // % (mod, kalan): saat gibi, sondan sonra başa döner. +kisiler.length: eksi sayı olmasın diye
    const yeni = (sira + kisiler.length) % kisiler.length; // -1 → 4 (sona), 5 → 0 (başa), 2 → 2
    seridiKaydir(seritRef.current, yeni); // Şeridi oraya kaydır (YENİ: ortak tarifi kullanıyor)
    setAktif(yeni); // Hafızayı güncelle: React ekranı yeniden çizer, bordo nokta yerini değiştirir
  }

  // kaydirinca: ziyaretçi parmakla ya da fareyle kaydırınca çalışır, noktalar da takip etsin
  function kaydirinca() {
    const serit = seritRef.current; // Elimizdeki şerit
    if (!serit) return; // Şerit yoksa hiçbir şey yapma, çık
    // scrollLeft = ne kadar sağa kaydı · clientWidth = bir hikâyenin genişliği · Math.round = en yakın tam sayıya yuvarla
    setAktif(Math.round(serit.scrollLeft / serit.clientWidth)); // Örnek: 2 hikâye genişliği kaydıysa → 2
  }

  return ( // Ekranda gösterilecekler
    <section className="mt-10"> {/* Vitrin bölümü. mt-10: üstten boşluk (logodan ayrılsın) */}
      {/* Kayan şerit */}
      <div
        ref={seritRef} // Bu şerit, seritRef'in tuttuğu kutu
        onScroll={kaydirinca} // Kaydırılınca kaydirinca'yı çalıştır
        // relative: hikâyelerin konumu (offsetLeft) şeride göre ölçülsün
        // flex: yan yana diz · snap-x snap-mandatory: her kaydırmada bir hikâyeye otur
        // gap-4: aralarında boşluk · overflow-x-auto: yatayda kaydırma çubuğu · pb-4: çubuk kutuya yapışmasın
         className="relative flex items-start snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
      >
        {kisiler.map((kisi, sira) => { // Her kişi için bir hikâye. sira: kaçıncı (0, 1, 2...)
          const klip = kisi.clips[0]; // Bu hikâyede kişinin ilk klibini gösteriyoruz
          return ( // Bu kişinin hikâye kutusu
            <Link
              key={kisi.slug} // React'in her kutuyu tanıması için tekil ad
              href={`/kisiler/${kisi.slug}`} // Tıklanınca kişinin sayfasına git
              // group: üstüne gelince içerideki group-hover'lar çalışsın · grid: ızgara düzen
              // w-full: şeridin tam genişliği (ekranda tek hikâye) · shrink-0: küçülme · snap-start: sol kenarı şeride otursun
              // overflow-hidden: büyüyen resim taşmasın · rounded-lg: yuvarlak köşe · border: çerçeve
              // bg-white: beyaz zemin · md:grid-cols-2: orta ekranda iki sütun (solda resim, sağda yazı)
              className="group grid w-full shrink-0 snap-start overflow-hidden rounded-lg border border-stone-900 bg-white md:grid-cols-2"
            >
              {/* Büyük kapak kutusu: relative (resim buna yapışsın) · h-80: telefonda yükseklik · md:min-h-80: büyük ekranda en az bu kadar */}
              <div className="relative h-80 overflow-hidden bg-stone-900 md:h-auto md:min-h-80">
                <Image
                  src={klip.cover} // Resmin adresi: /kapaklar/KOD.jpg
                  alt={klip.title} // Resim yüklenemezse görünen yazı, ekran okuyucu da bunu okur
                  fill // Saran kutuyu doldur (su ve bardak)
                  loading={sira === 0 ? "eager" : "lazy"} // İlk hikâye hemen (eager), diğerleri tembel (lazy) yüklensin (LCP)
                  sizes="(min-width: 768px) 50vw, 100vw" // Büyük ekranda ekranın yarısı, telefonda tamamı kadar resim indir
                  // object-cover: ezmeden doldur · transition-transform duration-500: yarım saniyede yumuşak · group-hover:scale-105: %5 büyü
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Yazı kutusu: flex flex-col: alt alta · justify-center: dikeyde ortala · p-8: iç boşluk */}
              <div className="flex flex-col justify-center p-8">
                {/* Üst etiket: küçük, kalın, BÜYÜK HARF, aralıklı, bordo */}
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-800">
                  Öne çıkan · {klip.topic} {/* Klibin konusu, ör. "girişimcilik" */}
                </p>
                {/* Hikâye anlatan büyük başlık: Lora fontu, büyük, kalın */}
                <h2 className={`${baslikFontu.className} mt-3 text-4xl font-bold leading-tight lg:text-5xl`}>
                  {klip.title} {/* Klibin başlığı */}
                </h2>
                {/* Bir cümlelik alt başlık: bio'yu ". " işaretlerinden böl, ilk cümleyi al, sonuna nokta koy */}
                <p className="mt-4 text-lg text-stone-600">{kisi.bio.split(". ")[0]}.</p>
                {/* Kişi · tarih satırı: küçük, gri */}
                <p className="mt-4 text-sm text-stone-500">
                  {kisi.name} · {tarihYaz(klip.publishedAt)} {/* Ör. "Nevzat Aydın · 24 Eylül 2026" */}
                </p>
                {/* Kişi sayfasına link yazısı: kartın üstüne gelince bordo */}
                <p className="mt-6 text-sm font-semibold uppercase tracking-wider transition-colors group-hover:text-rose-800">
                  Hikâyeyi oku →
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alt satır: sol ok · noktalar · sağ ok. flex: yan yana · items-center: dikeyde ortala · justify-center: yatayda ortala · gap-4: aralık */}
      <div className="mt-2 flex items-center justify-center gap-4">
        {/* Sol ok düğmesi */}
        <button
          type="button" // Düğme. type="button": bir formun içinde olsa bile formu göndermesin
          onClick={() => git(aktif - 1)} // Tıklanınca bir önceki hikâyeye git (0'daysa % sayesinde sona gider)
          aria-label="Önceki hikâye" // Ekran okuyucu için açıklama (düğmede sadece ← var)
          // Yuvarlak, gri çerçeveli beyaz düğme. Üstüne gelince çerçeve ve ok bordo olsun
          className="rounded-full border border-stone-300 bg-white px-3 py-1 text-stone-600 hover:border-rose-800 hover:text-rose-800"
        >
          ←
        </button>

        {/* Noktalar: her hikâye için bir nokta. flex gap-2: yan yana, aralıklı */}
        <div className="flex gap-2">
          {kisiler.map((kisi, sira) => ( // Her kişi için bir nokta
            <button
              key={kisi.slug} // React'in her noktayı tanıması için tekil ad
              type="button" // Formu göndermesin
              onClick={() => git(sira)} // Tıklanınca doğrudan o hikâyeye git
              aria-label={`${sira + 1}. hikâye: ${kisi.name}`} // Ekran okuyucu: "3. hikâye: Adnan Şahin" (sira 0'dan başladığı için +1)
              // h-2 rounded-full: küçük yuvarlak · transition-all: genişlik ve renk yumuşakça değişsin
              // Aktif nokta (sira === aktif): w-6 uzun + bordo · diğerleri: w-2 yuvarlak + gri, üstüne gelince biraz koyu
              className={`h-2 rounded-full transition-all ${
                sira === aktif ? "w-6 bg-rose-800" : "w-2 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>

        {/* Sağ ok düğmesi */}
        <button
          type="button" // Formu göndermesin
          onClick={() => git(aktif + 1)} // Tıklanınca bir sonraki hikâyeye git (sondaysa % sayesinde başa döner)
          aria-label="Sonraki hikâye" // Ekran okuyucu için açıklama
          // Sol okla aynı görünüş
          className="rounded-full border border-stone-300 bg-white px-3 py-1 text-stone-600 hover:border-rose-800 hover:text-rose-800"
        >
          →
        </button>
      </div>
    </section>
  );
}