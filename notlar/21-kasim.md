# Gün 24 · 21 Kasım Cumartesi planı · çalıştığım gün: 21 Kasım

> ⚠️ **21 Kasım Cumartesi planını yetiştiremedim, yapamadım.** Planı (API'ye hazırlık: `ornek-api.json`, Zod şeması, `lib/people.ts`) tam anlayamadım. Anlamadığım yerlerle ilgili sorularım Drive'da (5. hafta klasörü).
>
> Onun yerine görüşmede kâğıda aldığım notlardaki düzeltmeleri yaptım. Aşağıda **"Ek olarak yaptıklarım"** var.

Dal: `hafta5`

## Planın istediği (yapılmadı)

- Kendi 21 klibimden `src/data/ornek-api.json` (hocanın taslak biçiminde)
- Zod ile şema: bozuk kayıt sayfayı çökertmesin, atlansın ve konsola yazılsın
- Sayfalar veriyi yalnız `lib/people.ts` üzerinden alsın; API adresi yoksa örnek dosyadan okusun
- Akşam: hafta5 → main PR (önce/sonra)

📚 Kaynak: [Zod](https://zod.dev)

## Ek olarak yaptıklarım (görüşme notlarımdan)

| # | Ne yaptım | Commit |
|---|---|---|
| 1 | Beyaz arka planlar kalktı: vitrin okları krem, konu düğmeleri, arama kutusu ve Instagram düğmesi şeffaf, ekmek kırıntısındaki beyaz kutu kalktı | `2b9fb5f` |
| 2 | Kişiler sayfası gazete düzeni (Maket B): ortalı başlık, altı çizgili önerili arama, konular iki ince çizgi arasında noktalarla; kişi sayfasında "Tüm kişiler →" oku kalktı | `a291abc` |
| 3 | Kişiler başlığı yukarıda, ekmek kırıntısı başlığın üstünde ortada, başlık boyutu "Diğer hikâyeler" gibi | `7131329` |
| 4 | Aramada isim + konu + klip adı: üst menüdeki ve Kişiler sayfasındaki arama aynı listeyi kullanıyor, önerinin altında neden çıktığı yazıyor | `cb67abc` |
| 5 | Kişiler kartlarında klip kapağı yerine kişi fotoğrafı (ana sayfadaki "Bütün hikâyeler" kartı); ana sayfada "Tüm kişiler" oku kalktı | `1137ce1` |
| 6 | Kart yazıları hizalı: isme 2 satır yer, "N klip" en altta | `6d7f929` |
| 7 | Kişi sayfasında künye şeridi (çizgi + PROFİL · KLİP DERGİ · konu) kalktı, üstte sadece ekmek kırıntısı | `206d36f` |
| 8 | Hakkımızda sayfası gazete künyesi düzeni (Maket A): ilkeler 3 sütun, ortalı künye, kaldırma politikası koyu bant | `23d704e` |

375 px ve geniş ekranda baktım ✅

## 1. Beyaz arka planlar

| Nerede | Önce | Sonra |
|---|---|---|
| Vitrin okları | `bg-white` | `bg-amber-50` (krem; şeffaf olsa fotoğrafın üstünde kaybolurdu) |
| Konu düğmeleri, arama kutusu | `bg-white` | `bg-transparent` |
| Kişi sayfası Instagram düğmesi | `bg-white` | `bg-transparent` |
| Ekmek kırıntısı | beyaz hap kutu | kutu yok, düz yazı |

📒 **NOT:** `bg-transparent` = arka plan şeffaf, arkadan sayfanın krem rengi görünür. Cam düğme gibi.

## 2. Kişiler sayfası: gazete düzeni

3 maket gördüm (A dizin, B gazete künyesi, C yan sütun) → **B**'yi seçtim.

- Ekmek kırıntısı + büyük "Kişiler" (Lora, kalın) + italik açıklama, hepsi ortada
- Arama: kapsül değil, **altı çizgili tek satır**, sağında bordo "ARA"
- Konular: kutusuz, iki ince çizgi arasında, aralarında `·`; seçili konu bordo ve altı çizili
- Künye şeridini (DİZİN · KLİP DERGİ · 12 KİŞİ) ve `→` oklarını kaldırdım (Kişiler "Ara", ana sayfa ve kişi sayfası "Tüm kişiler"). Footer'daki "Başa dön ↑" oku kaldı.

## 3. Arama: isim + konu + klip adı

| Yazınca | Öneri |
|---|---|
| ulu | Hamdi Ulukaya / HAREKETE GEÇMEK |
| ekip | Mustafa Namoğlu, Acun Ilıcalı / EKİP |
| vizyon | Aykut Karaalioğlu, Mehmet Dinçerler / VİZYON |
| vest | Mark Zuckerberg / MİLYARLIK VESTİNG DERSİ |

- Yeni tarif: `lib/people.ts` → `getAramaKisileri()`: ad, slug, konular, klip başlıkları (biyografi yok → tarayıcıya az veri)
- `AramaKutusu.tsx` iki yerde kullanılıyor: üst menü (küçük) ve Kişiler sayfası (`buyuk`)
- Önerinin alt satırında **neden** çıktığı yazıyor (konu ya da klip adı)

## 4. Kişi fotoğrafları

Kişiler kartları artık ana sayfadaki "Bütün hikâyeler" kartıyla aynı (`HikayeKarti`, album): kişi fotoğrafı, siyah-beyaz, kutusuz.
7 kişide Wikipedia/Commons fotoğrafı yok (Nevzat, Adnan, Mustafa, Ata, Aykut, Efe, Mehmet) → onlarda reel kapağı kaldı.

**Kart hizası:** uzun isimler ("Mustafa Namoğlu", "Aykut Karaalioğlu") 2 satıra kayınca alttaki yazılar kayıyordu.
- İsme her kartta 2 satırlık yer: `min-h-[2lh]` (`lh` = bir satır yüksekliği)
- Kart satırdaki en uzun kart kadar uzar (`flex h-full flex-col`), "N klip" en alta iner (`mt-auto`)
- Aynı kart ana sayfada da var → iki sayfa birden düzeldi

📒 **NOT:** Defterde her isme iki satır ayırmak gibi: kısa isim tek satırı kullanır ama alttaki yazı hep aynı satırdan başlar.

## 5. Kişi sayfası

Üstteki künye şeridini kaldırdım; sayfa artık ekmek kırıntısı (Ana sayfa › Kişiler › Nevzat Aydın) ve doğrudan fotoğrafla başlıyor.

## 6. Hakkımızda sayfası

2 maket gördüm (A gazete künyesi, B manifesto) → **A**.

| Bölüm | Önce | Sonra |
|---|---|---|
| Giriş | italik ince başlık, dar sütun | ortada kırıntı + kalın Lora "Hakkımızda" (Kişiler gibi) |
| İlkelerimiz | alt alta küçük | yan yana 3 sütun, büyük bordo 01 · 02 · 03 |
| Künye | solda görev, sağda isim | ortalı: küçük görev, altında büyük isim (basılı dergi künyesi gibi) |
| Kaldırma politikası | beyaz kutu | koyu bant (ana sayfadaki alıntı bandı gibi) |

## Takıldığım yerler

- `git add` komutu iki satıra bölündü → 2 dosya dışarıda kaldı → `git commit --amend --no-edit` ile ekledim (push'tan önce).
- Yeni kodu Ctrl+A yapmadan yapıştırdım → dosyada iki kopya (+168) → `git restore` ile geri alıp tekrar.
- `Type '{ ad, slug, konu }' is missing … konular, basliklar`: arama kutusunun kalıbı değişti ama Kişiler sayfası eski listeyi gönderiyordu → `getAramaKisileri()`.
- `src/app/page.tsx`'in içini yanlışlıkla sildim → yeniden yapıştırdım (`git restore` de olurdu).
- Bazı commit'lerde satır sayısı beklenenden ±1 çıktı (satır sonu farkı), sayfayı etkilemedi.

**Kelimeler:** bg-transparent · breadcrumb (ekmek kırıntısı) · --amend · git restore · tsc --noEmit · combobox · getAramaKisileri · HikayeKarti · min-h-[2lh] · mt-auto · flex-col

## Kaldığım yer

Cumartesi planı (API hazırlığı + Zod) yapılmadı; sorularımın cevabı gelince yapacağım. hafta5 → main PR açılmadı.