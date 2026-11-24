# Gün 19 · 16 Kasım Pazartesi planı · çalıştığım günler: 16 Kasım

Dal: `hafta5` (hafta4'ten açıldı)

## Planın istediği

- **PR:** PR #3'ü (hafta3 → main) kendin birleştir. Lighthouse'u ölç, hafta4 → main PR'ını aç.
- **Performance 90:** Kişi sayfasında LCP'yi yapan büyük kapağı öncelikli yükle, `sizes` değerini doğru ver, dosyayı küçült. Önce/sonra puanı PR açıklamasına yaz.
- **Düzeltmeler:** Dinçerler'in Commons fotoğrafını kaldır, Efe'nin unvanını çıkar, layout'a `metadataBase` ekle ve önizleme linkini opengraph.xyz'de dene.
- **Kalan içerik:** Kaynağı boş 4 klip; Aykut, Efe ve Mark'ın alıntıları. Bulamadığın boş kalsın.
- **Çıktı:** İki PR linki (#3 birleşmiş, hafta4 açık), Performance önce/sonra, düzeltmeler notta.

## Durum

| # | Madde | Durum | Commit |
|---|---|---|---|
| 1 | PR #3 birleştir | ✅ Merged | `9f78902` (merge) |
| 2 | hafta5 dalı | ✅ | – |
| 3 | Lighthouse ölçümü | ✅ localhost + PageSpeed | ekran görüntüleri `16950b4` · `c691ea3` |
| 4 | Performance 90 | ⚠️ Yapıldı, puan dalgalanıyor (aşağıda) | `026b7b7` · test `7f8be15` `80f7162` · geri açma `67d6b30` |
| 5a | Dinçerler fotoğrafı | ✅ | `d1264f6` · `09d488e` |
| 5b | Efe unvanı | ✅ | `94d7e66` |
| 5c | `metadataBase` + opengraph.xyz | ✅ | `76e25cc` |
| 6 | Kalan içerik | ✅ Aykut 2 alıntı · Efe, Mark alıntısız · 4 kaynak boş | `31d28f4` |
| 7 | hafta4 → main PR | ✅ | [PR #4](https://github.com/symkllci/klip-dergi/pull/4) |

## 1. PR #3 birleştirme

- "wants to merge 68 commits into main from hafta3" · All checks have passed · No conflicts → **Merge pull request** → mor "Merged".
- 68 commit içinde 1. ve 2. haftanın commit'leri de vardı (hafta3, hafta2'nin üstüne açılmıştı).
- **Tahmin/gerçek:** Merge sonrası renk mor "Merged" ✅
- #1 ve #2 hâlâ açık görünüyor, içerikleri #3 ile main'e girdi → hocaya soruldu.
- Yeşil **Open** = bekliyor · mor **Merged** = ana dala katıldı · kırmızı **Closed** = birleşmeden kapandı.

## 2. hafta5 dalı

```powershell
git checkout hafta4      # Already on 'hafta4'
git pull                 # Already up to date.
git checkout -b hafta5   # Switched to a new branch 'hafta5'
git push -u origin hafta5
```

- `-b` = yeni dal · `-u` = bundan sonra sadece `git push` yeter.
- Komutu iki kez yazınca `fatal: a branch named 'hafta5' already exists` → zararsız. `fatal` = "bu komut yapılamadı", sebebini de yazar.

## 3–4. Lighthouse ve Performance 90

**Neyi ölçtük:** Nevzat'ın sayfası (fotoğrafı yok, büyük görsel = reel kapağı), Mobil.

| Ölçüm | Perf | FCP | LCP | SI |
|---|---|---|---|---|
| localhost, önce | 88 | 0,9 | 4,0 | 0,9 |
| localhost, `fetchPriority` sonrası | 88 | 0,9 | 4,0 | – |
| localhost, `sizes` sonrası | 87 | 0,9 | 4,0 | 0,9 |
| **PSI hafta4** (önce) 19:47 / 19:57 / 20:12 | **92 / 93 / 89** | 0,9 | 3,4 / – / 3,8 | 1,8 / – / 2,1 |
| **PSI hafta5** (sonra) 19:55 / 19:59 / 19:59 / 20:18 | **88 / 87 / 87 / 88** | 0,9 | 3,8 | 3,5 |
| PSI hafta5, `fetchPriority` kapalı (test) | 87 | 0,9 | 3,8 | 3,7 |

**Yaptıklarım:**
- `fetchPriority="high"`: büyük görsele "önce beni indir". 📚 Next.js Image belgesi: "In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of `preload`." Next.js 16'da `priority` eskidi (`preload` geldi).
- `KlipKarti` `sizes`: `"(min-width: 1024px) 12vw, 50vw"` → `"(min-width: 1152px) 160px, (min-width: 640px) 16vw, calc(50vw - 45px)"`. Kapak ekranın değil kartın yarısı.

**Sonuç ve dersler:**
- `fetchPriority` Lighthouse'un "LCP istek keşfi" uyarısını kapattı ✅, ama puanı değiştirmedi. Kapatıp ölçünce de değişmedi → zararsız, geri açtım.
- `sizes` telefonda aynı dosyayı (384 px) seçtiriyor: telefon 412 px, DPR 1,75 → 161 × 1,75 = 282 → Next en yakın büyük boy 384.
- **Kontrol ölçümü:** hafta4'e hiç dokunmadan tekrar ölçünce 93 → 89 indi. Yani puan ölçümden ölçüme ±4 oynuyor.
- hafta5'te Speed Index sürekli ~3,5 sn, hafta4'te ~2 sn → **sebebi bulunamadı**, hocaya soruldu.
- **localhost ≠ gerçek site:** localhost 88 (LCP 4,0), Vercel 92 (LCP 3,4). Ölçüm, ziyaretçinin gördüğü yerde (Vercel, PageSpeed Insights) yapılmalı.
- **Tahmin/gerçek:** `fetchPriority` sonrası LCP "biraz iner" dedim → değişmedi ❌. hafta5 "yükselir" dedim → düştü ❌. `fetchPriority` kapalı "87'de kalır" → kaldı ✅.
- 3 ders: tek ölçümle karar verme · kontrol grubu tut · tek değişiklik → tek ölçüm.

**Kelimeler:** FCP (ilk görünen) · LCP (en büyük parçanın görünmesi, iyi < 2,5 sn) · TBT (donma süresi) · CLS (kayma) · Speed Index (sayfanın dolma hızı) · DPR (ekran keskinliği) · hipotez (henüz kanıtlanmamış tahmin) · medyan (ortadaki değer).

## 5. Düzeltmeler

**5a. Dinçerler fotoğrafı:** `people.json`'dan `photo` bloğu silindi, `git rm public/fotograflar/mehmet-dincerler.jpg` (`delete mode`). Sayfa kodu değişmedi: `photo?` olmayınca reel kapağı gösteriliyor. Hoca: "Benzetmek yeterli kanıt değil."

**5b. Efe:** "Bugün DentGroup'un Yönetim Kurulu Başkanıdır." → "DentalPrices'ın da kurucusudur." "Bugün" ile başlayan unvanlar zamanla eskir, güncel kaynak ister.

**5c. `metadataBase`:** Zaten vardı ama ana site adresi elle yazılıydı → önizlemede paylaşım görseli ana siteden isteniyordu. Artık ortama göre:

```tsx
function siteAdresi(): URL {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (process.env.VERCEL_BRANCH_URL) return new URL(`https://${process.env.VERCEL_BRANCH_URL}`);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
}
```

- opengraph.xyz: `og:image` = `https://klip-dergi-git-hafta5-.../kapaklar/Ddqm-BsAxNj.jpg` ✅ "Görüntü sorunsuz yükleniyor, 130 KB" ✅. Önizlemede kırık görünmesi benim bilgisayarımın `vercel.app` açamamasından.
- Uyarılar: görsel dikey (720×1280, önerilen 1200×630), açıklamalar uzun, `og:site_name` eksik.
- `process.env` = ortam değişkeni: kod aynı, çalıştığı yere göre değer değişir.
- `updatedAt` değişen kişilerde 2026-11-18 yapıldı (Mehmet, Efe, Aykut).

## 6. Kalan içerik bölümü

- **Aykut 1:** "Ben de aynısını Apple'a Türkiye için yapmak istiyorum. Gurbete giden bir Türk hikâyesini böyle hero's journey olarak en sonunda taçlandırmak istedim."
- **Aykut 2:** "Bana ne verirlerse okeyim zaten." (kendi adına söylüyor)
- **Efe ×2, Mark:** uygun cümle bulunamadı → alıntısız.
- **4 kaynak:** hocanın mesajında aday video bulunamadı → boş.
- **Elon:** İngilizce aslı bulunamadı. 2. alıntıdaki "plak şirketi" büyük ihtimalle "roket şirketi" (rocket company) → doğrulanamadı.
- Alıntı ≠ kaynak: alıntı klipteki 1 cümle, kaynak klibin kesildiği uzun video. Aday = "olabilir", kanıtlanmadan yazılmaz.

## 7. PR #4

https://github.com/symkllci/klip-dergi/pull/4: haftalık özet, kart önce/sonra, Lighthouse önce/sonra (Acun, Nevzat), ölçüm tablosu, açık kalanlar. Görseller `github.com/.../blob/<dal>/notlar/x.png?raw=true` ile.


## Kaldığım yer

Pazartesi bitti. Sıradaki: **Salı planı, ana sayfa vitrini** (tam genişlik, sonsuz döngü, oklar).