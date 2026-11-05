## Ne yaptım
- **layout.tsx'te sitenin genel başlığını ve açıklamasını yazdım.** Sekmede "Create Next App" yerine artık "Klip Dergi" yazıyor.
- **Kişi sayfasına generateMetadata ekledim.** Her kişinin sekmesinde kendi adı görünüyor: "Nevzat Aydın · Klip Dergi". Açıklama olarak biyografinin ilk cümlesi kullanılıyor. Olmayan kişide (ör. /kisiler/ali-veli) sekmede "Kişi bulunamadı · Klip Dergi" yazıyor.
- **Kişiler sayfasına ve kişi sayfasına "← Ana sayfa" linki ekledim** (planda yoktu, hocamın isteğiyle). Kişi sayfasında "← Ana sayfa" ve "← Tüm kişiler" yan yana duruyor.

## Öğrendiklerim

### metadata
- Metadata, sayfanın "kimlik bilgisi": sekmede görünen başlık (title) ve Google'ın arama sonucunda gösterdiği açıklama (description). Ekranın içinde görünmez.
- SEO için önemli: Google sayfanın ne hakkında olduğunu buradan anlıyor.
- layout.tsx'teki metadata bütün sayfaların varsayılanı. Bir sayfa kendi başlığını vermezse bu kullanılıyor.

### generateMetadata
- Her kişinin başlığı farklı olduğu için sabit bir metadata yazamıyorum. generateMetadata, başlığı adresteki slug'a göre üretiyor.
- Kişi sayfasının kendisine çok benziyor: `await params` ile slug'ı alıyor, `getPersonBySlug` ile kişiyi buluyor.
- Adı tam olarak `generateMetadata` olmalı. Next.js bu adı arıyor, tıpkı `generateStaticParams` gibi.
- Başlık: `${kisi.name} · Klip Dergi`. Açıklama: `kisi.bio.split(". ")[0] + "."`.
- `import type { Metadata } from "next"`: Next.js'in metadata kalıbını getiriyor, Person kalıbı gibi.

### Linkleri yan yana dizmek
- `<div className="flex gap-4">` içine iki link koydum. `flex` içindekileri yan yana diziyor, `gap-4` aralarına boşluk bırakıyor.
- `href="/"` ana sayfanın adresi.

### README
- README, GitHub'da repoyu açan herkesin ilk gördüğü sayfa. Projenin vitrini.
- `.md` = Markdown. `#` başlık, `-` madde, `**` kalın yazı, ``` ``` ``` kod bloğu, `|` tablo.
- VS Code'da **Ctrl + Shift + V** ile README'nin nasıl görüneceğine bakabiliyorum.

## Kaynak
- generateMetadata'yı Next.js Metadata belgesindeki "Generated metadata" örneğiyle karşılaştırdım. Fark: belgede veri fetch ile internetten geliyor, bizde getPersonBySlug ile people.json'dan.

## Tahmin ve sonuç
- **Tahminim:** layout.tsx'te başlığı değiştirince bütün sekmelerde "Klip Dergi" yazar. **Sonuç:** Ana sayfada ve kişiler sayfasında "Klip Dergi" yazıyor. Kişi sayfasında ise generateMetadata'nın verdiği başlık ("Nevzat Aydın · Klip Dergi") öne geçiyor.
- **Tahminim:** Ana sayfa linkini eklemek tek satırlık iş. **Sonuç:** Öyleydi, ama kişi sayfasında iki linki yan yana dizmek için `flex` gerekti.


## JS boşluğu
- `generateMetadata` neden `async`, neden `Promise<Metadata>` döndürüyor? Kişi sayfasındaki params mantığıyla aynı mı, daha iyi anlamam lazım. tekrar bak
- `flex` ile `grid` farkı: ikisi de dizmek için, hangisi ne zaman kullanılıyor?

## Sorularım
- Next.js 16.4.0'da güvenlik açığı uyarısı çıkıyor, 16.4.3'e güncelleyelim mi?
- Ana sayfa ve /kisiler de kendi başlıklarını alsın mı? Şu an ikisinde de "Klip Dergi" yazıyor.

