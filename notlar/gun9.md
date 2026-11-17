# Gün 9 · Salı (3 Kasım) planı · çalıştığım gün: 6 Kasım

Dal: `hafta3`

## Bugün ne yaptım

- **7 yeni kişi ekledim** (hocamın onayıyla 5 yerine 7, toplam 12 kişi): Acun Ilıcalı, Elon Musk, Aykut Karaalioğlu, Efe Çelebi, Mehmet Dinçerler, Abdullah Kiğılı, Mark Zuckerberg.
- **Klipler:** Toplam 21 klip. Mehmet, Abdullah ve Mark'ın birer klibi var, hocam bunlara da onay verdi. Aykut'un 3. klibini (`DdUOpZTg40R`) şimdilik eklemedim.
- **Bio'lar:** Her kişiye 3–4 cümle. Kaynağını bulamadığım bilgileri çıkardım.
- **Kapaklar:** Drive'daki 95 kapaktan sadece kullandığım 21'ini `public/kapaklar/`'a koydum.
- **`cover` alanı:** `types.ts`'te Clip'e `cover: string` ekledim, `people.json`'da 21 klibe `"cover": "/kapaklar/KOD.jpg"` yazdım.
- **gun4.md:** "Hocam inceleyip birleştirdi" cümlesini düzelttim, PR hâlâ açık.

## Kişiler nasıl seçildi?

Drive'daki `index.csv`'de her gönderinin linki, tarihi ve açıklamasının ilk satırı var. Açıklamada adı geçen kişileri Ctrl + F ile aradım, adı geçmeyenleri kapaklardan tanıdım. Sonra klipleri açıp konuşanın gerçekten o kişi olduğunu kontrol ettim.

| Kişi | Slug | Klip |
|---|---|---|
| Acun Ilıcalı | `acun-ilicali` | 2 |
| Elon Musk | `elon-musk` | 2 |
| Aykut Karaalioğlu | `aykut-karaalioglu` | 2 |
| Efe Çelebi | `efe-celebi` | 2 |
| Mehmet Dinçerler | `mehmet-dincerler` | 1 |
| Abdullah Kiğılı | `abdullah-kigili` | 1 |
| Mark Zuckerberg | `mark-zuckerberg` | 1 |

## Yeni klipler

| Kişi | Kod | Tarih | title | topic |
|---|---|---|---|---|
| Acun | `Del_e6VATWa` | 2026-10-17 | Zor Günde Arkadaşlığın Değeri | ekip |
| Acun | `DeWZGAnAHRu` | 2026-10-11 | Para Değil, İyi İş Kovalamak | risk almak |
| Elon | `De1SYWtxMn2` | 2026-10-23 | Korkmak Normal, Durmak Değil | harekete geçmek |
| Elon | `DeymVx5AtRG` | 2026-10-22 | Çılgın Denilen Karar | risk almak |
| Aykut | `DdOn5-QACp_` | 2026-09-13 | Türk Yetenekleri İçin Büyük Hayal | vizyon |
| Aykut | `DdRn4UcAUho` | 2026-09-14 | Zor Günde Bile Doğru Fiyat | müşteri |
| Efe | `DeFF2E8A4Ds` | 2026-10-04 | Hayal Bitince Yeni Rota | başarısızlık |
| Efe | `Dd6EHB4A-vS` | 2026-09-30 | Krizde Müşteriyi Korumak | müşteri |
| Mehmet | `DeG3DvKANMR` | 2026-10-05 | Boş Pazarı İlk Gören Kazanır | vizyon |
| Abdullah | `DeBt7G0Ao9G` | 2026-10-03 | Ortaklıkta Kâr Dengesi | yatırım |
| Mark | `DeUWdYOgdW7` | 2026-10-10 | Milyarlık Vesting Dersi | yatırım |

Konu seçerken önce mevcut 9 konuyu kullandım, filtrede tek kişilik düğme olmasın diye. Yeni açtığım tek konu **vizyon** (Aykut ve Mehmet).


## Nerede takıldım

- **CSV'den link kopyalarken `,VIDEO` da geldi.** Link `/` ile biter, sonrası bir sonraki sütun.
- **JSON hataları:** `links` içinde tırnak yoktu, `{ }` ve `[ ]` eksikti, kişiler arasında virgül yoktu. Kural: Arkasından bir şey geliyorsa virgül, sonuncuysa virgül yok.
- **Bio'larda kaynaksız bilgiler vardı.** Mehmet için "Gloria Jean's haklarını aldı" yazmıştım, ama kaynağa göre hakları babası almış. Efe için "Yeditepe mezunu" bilgisinin kaynağı yoktu. Abdullah'ta "kurduğu" yazmıştım, kaynakta "kurulan" yazıyor. "Başkan vekili" de değil, "başkan yardımcısı". Hepsini düzelttim.
- **TypeScript eksik `cover`'ları göstermedi.** `lib/people.ts`'te `return people as Person[];` yazıyor. `as` TypeScript'e "kontrol etme" diyor. `npx tsc --noEmit` hiçbir şey yazmadı.


## Kontrol komutlarım

Eksik kapakları saymak (21 → 0):

```
node -e "const d=require('./src/data/people.json'); console.log(d.flatMap(p=>p.clips).filter(c=>!c.cover).length)"
```

Her kapak doğru dosyayı gösteriyor mu:

```
node -e "const fs=require('fs'); const d=require('./src/data/people.json'); d.flatMap(p=>p.clips).forEach(c=>{const kod=c.url.split('/').filter(Boolean).pop(); if(c.cover!=='/kapaklar/'+kod+'.jpg' || !fs.existsSync('public'+c.cover)) console.log('SORUN:', c.url, c.cover)}); console.log('kontrol bitti')"
```

Klasördeki dosya sayısı: `(Get-ChildItem public\kapaklar).Count` → 21

## Öğrendiklerim

- **CSV:** Virgülle ayrılmış değerler. İlk satır sütun adları.
- **Slug:** Büyük I küçülünce ı olur, slug'da i yazılır. Adreste ı olursa `%C4%B1` gibi bozuk görünür.
- **topic ile açıklama farkı:** topic raf etiketi (1–2 kelime), açıklama kitabın arka kapağı (cümle). Açıklamayı projeye yazmıyoruz.
- **public klasörü:** `public/kapaklar/X.jpg` tarayıcıda `/kapaklar/X.jpg` olur.
- **Vesting:** Hissenin zamanla parça parça verilmesi.
- **`as`:** TypeScript'e "güven, kontrol etme" demek.
- **`flatMap`:** Kişilerin kliplerini tek listeye döker. **`!`:** "değil".

## Commit'lerim

1. `7 yeni kişi ve kliplerini ekle`
2. `Kullanılan klip kapaklarını ekle`
3. `Kliplere kapak alanı ekle` (types.ts ve people.json birlikte, ayrı olsaydı arada build bozulurdu)
4. `gun4 notundaki birleştirme bilgisini düzelt`


## Hocama sorum

> Hocam, Clip'e `cover` ekledim ama TypeScript eksikleri göstermedi. `lib/people.ts`'te `people as Person[]` yazdığı için kontrol etmiyormuş. Eksikleri `filter` ile saydım, 21 klibin hepsine kapak ekledim. `as`'ı kaldırmalı mıyım? Kaldırınca JSON'daki `"instagram"` sadece yazı sayılıyor, `"instagram" | "youtube"` ile uyuşmuyor.

> Kapak resimlerinin adları sizin direve yüklediğiniz gibi projede public kapaklar dosyasının içinde adlarını ör; acun1 , acun 2 olarak değiştirebilir miyim? böyle mi kalsın.
