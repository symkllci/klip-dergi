# Gün 25 · 23 Kasım Pazartesi planı · çalıştığım gün: 24 Kasım

> 6\. haftaya 1 gün geç başladım (24 Kasım Salı). Sırayı bozmadan Pazartesi planından devam ettim.

Dal: `hafta6` (hafta5'ten açıldı)

## Planın istediği

- PR #4'ü (hafta4 → main) birleştir
- hafta5 için Lighthouse ölçümü, sonra hafta5 → main PR
- `ornek-api.json`: sadece tarih (saat uydurma yok), kaynağı olmayan 4 klipte `kaynak` alanı hiç olmasın
- Zod: tarih hem `2026-10-01` hem tam tarih-saat kabul edilsin, `kaynak` isteğe bağlı, `safeParse`, bozuk kayıt atlanıp terminale yazılsın
- `people.json`'da sadece reel, konu, alıntı kalsın; sayfalar veriyi yalnız `lib/people.ts` üzerinden alsın
- Çıktı: site aynı görünsün, bilerek bozduğum kaydın atlandığını gösteren log notta olsun, iki PR linki

📚 Kaynaklar: [Zod](https://zod.dev) · [Zod: safeParse](https://zod.dev/basics) · [React cache](https://react.dev/reference/react/cache)

## Yaptıklarım

| # | Ne yaptım | Commit / Link |
|---|---|---|
| 1 | PR #4 (hafta4 → main) birleştirildi | [PR #4](https://github.com/symkllci/klip-dergi/pull/4) |
| 2 | hafta5 Lighthouse ölçümü (3 ölçüm, ortanca) | aşağıda tablo |
| 3 | hafta5 → main PR açıldı | [PR #5](https://github.com/symkllci/klip-dergi/pull/5) |
| 4 | `ornek-api.json`: 21 klip, sadece gün, kaynağı olmayan 4 klipte `kaynak` yok | `373d7aa` |
| 5 | Zod projeye eklendi | `9c2fd08` |
| 6 | Zod şeması `src/lib/klip-semasi.ts` | `79c89d0` |
| 7 | Veri katmanı: `people.json`'da sadece klip notları, klipler örnek dosyadan, sayfalar `lib/people.ts`'ten (async) | `d69a3ee` |

## 1. PR #4 birleştirildi

hafta4 → main birleşti. Birleşince `/klip-deneme` 404 verdi. Tahminim yanlıştı: o sayfa hafta5'te, hafta4'te yok. `/ses-deneme` de önce 404 verdi, Vercel yayını bitince açıldı.

## 2. hafta5 Lighthouse (PageSpeed Insights, mobil)

| Ölçüm | Performance | LCP | Speed Index |
|---|---|---|---|
| Ortanca (3 ölçüm) | 88 | 3,9 sn | 0,9 sn |

- 2\. ve 3. ölçüm 13 saniye arayla yapıldı ve aynı çıktı, önbellekten gelmiş olabilir.
- LCP'nin büyük kısmı "element render delay" (780 ms).
- Erişilebilirlik 96: footer'daki yazı rengi kontrastı düşük (küçük işlere ekledim).

## 3. ornek-api.json

Gerçek API gelene kadar onun yerine geçen örnek cevap. Kendi 21 klibimden, en yeniden eskiye.

```json
{
  "reel": "Ddqm-BsAxNj",
  "url": "https://www.instagram.com/reel/Ddqm-BsAxNj/",
  "yayinTarihi": "2026-09-24",
  "baslik": "Girişimcilikte Obsesyonun Rolü",
  "kaynak": { "videoBasligi": "…", "youtubeId": "sD09TB7M7u4" },
  "kisiler": ["Nevzat Aydın"]
}
```

- Tarihte saat yok, çünkü saati bilmiyorum (uydurmuyoruz).
- Kaynağı bulunamayan 4 klipte `kaynak` alanı hiç yok: `Ddei6l8ACBg`, `DdyygKGAW5e`, `DddzrvAAzPV`, `DeG3DvKANMR`.

## 4. Zod şeması

Zod, gelen verinin kalıba uyup uymadığına bakan bir **bekçi**.

| Alan | Kural |
|---|---|
| `reel` | harf, rakam, `-` ve `_` |
| `url` | geçerli adres |
| `yayinTarihi` | `2026-10-01` **ya da** tam tarih-saat (`z.union`) |
| `baslik` | boş olamaz |
| `kaynak` | isteğe bağlı (`.optional()`); varsa YouTube kimliği 11 karakter |
| `kisiler` | en az 1 isim |

- `parse`: bozuk veride **hata fırlatır**, sayfa çöker.
- `safeParse`: hata fırlatmaz, `{ success, data }` ya da `{ success, error }` döner. Biz bunu kullandık, bozuk kayıt atlanıyor.

## 5. Veri katmanı

Önce her şey `people.json`'daydı. Şimdi iki kaynak var:

| Nereden | Ne geliyor |
|---|---|
| `ornek-api.json` (yarın gerçek API) | klipler: reel, adres, tarih, başlık, kaynak, kişiler |
| `people.json` (bizim yazdığımız) | biyografi, kanca, fotoğraf, **klip notları** (reel, konu, alıntı) |

`lib/people.ts` ikisini birleştirip sayfaya veriyor. Sayfalar dosyaları hiç görmüyor, sadece `getAllPeople()`, `getPersonBySlug()`, `getAramaKisileri()` çağırıyor. Benzetme: aşçı iki dolaptan malzeme alıyor, sayfaya hazır tabak veriyor. API gelince sadece dolap değişecek.

- Klipler kişiye **adından** bağlanıyor (`kisiler: ["Nevzat Aydın"]`), notlar klibe **reel kodundan**.
- `KLIP_API_URL` varsa oradan okuyor, yoksa örnek dosyadan.
- Veri artık "beklenen" bir şey (async) → 5 sayfaya `await` eklendi.
- `8 files changed, 158 insertions(+), 223 deletions(-)`
- `npx tsc --noEmit` hatasız. localhost'ta ana sayfa, Kişiler ve Hamdi'nin sayfası eskisiyle aynı ✅


## 6. Bozuk kayıt testi

`ornek-api.json`'da Nevzat Aydın'ın `Ddqm-BsAxNj` klibinin tarihini bilerek bozdum: `"yayinTarihi": "dün"`.

**1. deneme:** Yanlışlıkla satır sonundaki virgülü de sildim. Site çöktü (500):

```
Error: Unable to make a module from invalid JSON
expected `,` or `}` at line 168 column 7
```

Bu Zod'un hatası değil, JSON okuyucunun hatası. İki ayrı bekçi var:

| Bekçi | Neye bakar | Bozuksa |
|---|---|---|
| JSON okuyucu | virgül, tırnak, parantez (dilbilgisi) | dosya hiç okunamaz, site çöker |
| Zod | içerik: tarih gerçekten tarih mi? | sadece o kayıt atlanır, site çalışır |

**2. deneme (virgül eklendi):** Site açıldı (200), terminalde:

```
[klip-api] 14. kayıt atlandı:
✖ Invalid input
  → at yayinTarihi
```

- Ek kanıt: Next.js'in LCP uyarısındaki resim `Ddqm-BsAxNj.jpg` iken `Ddei6l8ACBg.jpg` oldu. Bozuk klip listeden düşünce sıradaki öne geçti.
- Yazı her sayfa yenilemede tekrar çıktı. `cache` sadece tek bir istek içinde hatırlıyor, her yenileme yeni istek.
- Sonra `git restore src/data/ornek-api.json` ile geri aldım, `git status` temiz.

