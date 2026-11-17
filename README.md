# Klip Dergi

Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren bir dergi sitesi. Her girişimcinin kısa biyografisini, sosyal medya hesaplarını ve Instagram'dan gömülü kliplerini tek yerde topluyorum.

Bu projeyi stajım sırasında, Next.js ve TypeScript öğrenirken adım adım geliştiriyorum.

**Canlı site:** https://klip-dergi.vercel.app

## Sayfalar

| Adres | Ne gösteriyor |
|---|---|
| `/` | Ana sayfa: dergi kapağı gibi. En üstte öne çıkan kişi, altında diğer hikâyelerin kartları |
| `/kisiler` | Bütün girişimcilerin kart listesi, konu filtresi ve arama kutusu |
| `/kisiler?konu=yatırım` | Sadece seçilen konuda klibi olan kişiler |
| `/kisiler?ara=nevzat` | Adında aranan yazı geçen kişiler |
| `/kisiler/[slug]` | Tek bir girişimcinin sayfası: biyografi, sosyal medya linkleri ve klipler |

## Özellikler

- **Dergi tarzı ana sayfa:** öne çıkan kişi büyük gösteriliyor. Başlık olarak klibin başlığı, alt başlık olarak biyografinin ilk cümlesi kullanılıyor. Her kartta konu etiketi ve "kişi · tarih" satırı var.
- **Fotoğraf yok:** kişilerin fotoğrafları telif sorunu yaratacağı için yerine baş harflerinden bir rozet kullanılıyor ("NA" gibi). Kartın üstüne gelince rozet bordo renge dönüyor.
- **Konu filtresi:** kişiler sayfasında konu düğmeleri var. Konular kliplerden otomatik çıkıyor.
- **Ada göre arama:** büyük/küçük harf fark etmiyor ("NEVZAT" da "nevzat" da bulur). Konu filtresiyle birlikte çalışıyor.
- **Paylaşılabilir adresler:** seçilen konu ve arama adreste duruyor. Sayfa yenilense ya da link başka sekmede açılsa da aynı sonuç geliyor.
- **Gömülü klipler:** Instagram klipleri sayfanın içinde oynuyor. Yüklenmezse altında platforma göre "Klibi Instagram'da izle" ya da "Klibi YouTube'da izle" linki var.
- **Sekme başlıkları:** her kişi sayfasının sekmesinde kişinin adı yazıyor (ör. "Nevzat Aydın · Klip Dergi").
- **Gezinme:** kişiler ve kişi sayfalarında "← Ana sayfa" linki var.

## Tasarım

- **Renkler:** krem zemin, koyu mürekkep, bordo vurgu (Tailwind'in `amber-50`, `stone-900`, `rose-800` renkleri).
- **Başlık fontu:** [Lora](https://fonts.google.com/specimen/Lora) (serif). Logo italik, başlıklar düz, metinler sade.

## Teknolojiler

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- Vercel (yayın)

Veri şimdilik `src/data/people.json` dosyasından geliyor, ayrı bir backend yok.

## Bilgisayarda çalıştırmak

Node.js (LTS) kurulu olmalı.

```bash
git clone https://github.com/symkllci/klip-dergi.git
cd klip-dergi
npm install
npm run dev
```

Sonra tarayıcıda http://localhost:3000 adresini aç.

## Klasör yapısı

```
src/
├─ app/
│   ├─ page.tsx               ana sayfa ( / )
│   ├─ layout.tsx             bütün sayfaları saran iskelet, sitenin genel başlığı
│   └─ kisiler/
│       ├─ page.tsx           kişiler listesi, konu filtresi ve arama ( /kisiler )
│       └─ [slug]/page.tsx    kişi sayfası ( /kisiler/nevzat-aydin gibi )
├─ data/people.json           kişilerin verisi
├─ lib/people.ts              veriyi okuyan iki fonksiyon
└─ types.ts                   Person ve Clip tipleri
notlar/                       günlük çalışma notlarım (gun1.md, gun2.md, ...)
```

## Nasıl çalışıyor?

Veri `people.json`'da duruyor. `lib/people.ts`'teki iki fonksiyon (`getAllPeople` ve `getPersonBySlug`) onu okuyor. Sayfalar bu fonksiyonlarla kişileri alıp gösteriyor.

- Kişi sayfaları `generateStaticParams` ile site yayına alınırken önceden üretiliyor.
- Sekme başlıkları `generateMetadata` ile her kişiye göre üretiliyor.
- Konu filtresi ve arama, adresteki `?konu=` ve `?ara=` bilgilerini (`searchParams`) okuyup kişileri `filter` ile süzüyor.