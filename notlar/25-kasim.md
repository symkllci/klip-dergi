# Gün 27 · 25 Kasım Çarşamba planı · çalıştığım gün: 27 Kasım

> 6\. haftaya 1 gün geç başladım. Salı ve Çarşamba planlarını aynı gün (27 Kasım) yaptım.

Dal: `hafta6`

## Planın istediği

- Para kazanma araştırması: sponsorluk, bülten sponsorluğu, üyelik, PDF dergi, sponsorlu profil. Her biri için örnek site, gereken kitle, kaba gelir, hukuki risk. Tek sayfa: `notlar/para-kazanma.md`, rakamların kaynağıyla
- Paylaş düğmesi: kişi sayfasında; telefonda sistem paylaş menüsü (Web Share API), bilgisayarda linki kopyalasın
- `sitemap.ts` ve `robots.ts`; sitemap iki dildeki bütün kişileri listelesin. `/klip-deneme` ve `/ses-deneme` silinsin
- Çıktı: para-kazanma.md, telefonda paylaş menüsünün ekran görüntüsü, sitemap.xml linki

📚 Kaynaklar: [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) · [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

## Yaptıklarım

| # | Ne yaptım | Commit |
|---|---|---|
| 1 | Kişi sayfasında paylaş düğmesi (`PaylasDugmesi.tsx`) | `7e070d6` |
| 2 | Deneme sayfaları silindi | `98db7ca` |
| 3 | `sitemap.ts`, `robots.ts`; site adresi ortak dosyaya (`lib/site-adresi.ts`) | `49b31b7` |
| 4 | Paylaş düğmesi ekran görüntüsü | `9e7e3d7` |
| 5 | Para kazanma araştırması | `15012a2` |

## Çıktılar

- **Araştırma:** [para-kazanma.md](para-kazanma.md)
- **sitemap.xml:** https://klip-dergi-git-hafta6-symkllcis-projects.vercel.app/sitemap.xml (30 adres: 3 sayfa × 2 dil + 12 kişi × 2 dil)
- **Paylaş ekran görüntüsü:** [25-kasim-paylas-telefon.png](25-kasim-paylas-telefon.png). Chrome DevTools iPhone SE görünümünde tam sayfa görüntüsü; PAYLAŞ düğmesi görünüyor. Açılan menü sayfanın değil sistemin penceresi olduğu için bu görüntüye girmedi; menünün açık hâlini görüşmede telefonda canlı göstereceğim.

## 1. Paylaş düğmesi

İsmin ve kancanın altında, ortada (B seçeneği: sayfa açılınca hemen görünüyor).

```ts
const dokunmatik = window.matchMedia("(pointer: coarse)").matches; // parmakla mı dokunuluyor?
if (dokunmatik && navigator.share) {                                 // telefon + paylaşmayı biliyor
  await navigator.share({ title, text, url });                       // → sistemin paylaş menüsü
  return;
}
await navigator.clipboard.writeText(url);                            // değilse → linki kopyala
```

- Windows'ta Chrome da `navigator.share`'i biliyor; plan bilgisayarda kopyalama istediği için `&&` ile "dokunmatik **ve** paylaşma desteği" ikisi birden aranıyor.
- Bilgisayarda: yazı 2 saniye yeşil "Link kopyalandı" oluyor. DevTools telefon görünümünde: Windows'un "Bağlantı paylaş" penceresi açıldı (başlık "Hamdi Ulukaya · Klip Dergi").
- Paylaş menüsü telefonda sadece **https** sitelerde çalışır; localhost'ta telefondan denenemez → Vercel önizlemesi.
- Düğme yazıları sözlükte (`paylas`, `kopyalandi`, `kopyalanamadi`).

## 2. sitemap ve robots

- `siteAdresi()` fonksiyonu `layout.tsx`'ten `src/lib/site-adresi.ts`'e taşındı; layout, sitemap ve robots aynı fonksiyonu kullanıyor.
- `sitemap.ts`: `ikiDilde("/kisiler")` her sayfa için TR ve EN satırı üretiyor, her satırda öbür dilin adresi (`alternates`). Kişi sayfalarında `lastModified` = `updatedAt`.
- `robots.ts`: bütün robotlara her yer açık + sitemap adresi.
- Vercel'de sitemap'teki adresler dal adresiyle (`klip-dergi-git-hafta6-…`) geldi → `VERCEL_BRANCH_URL` çalışıyor.

## 3. Para kazanma araştırması

Ayrı not: [para-kazanma.md](para-kazanma.md). Kısaca: her modelin ortak şartı kitle; en mantıklı ilk adım bülten; sponsorlu profil "biyografiler özgün" ilkemize en ters; PDF dergi telif açısından en riskli.

Kendim doğruladıklarım:
- Medyascope abonelik: aylık 17 TL, yıllık 85 TL, Premium 5.000 TL (Medyascope'un kendi sayfası) ✅
- Morning Brew: benim bulduğum kaynak 4,0 milyon abone ve %33 açılma diyor, taslaktaki kaynak 4,2 milyon ve %60. İkisi de Morning Brew'un kendisi değil, tahmin → notta ikisini de yazdım.
- Forbes Councils ücretinde de iki kaynak farklı → ikisini de yazdım.

