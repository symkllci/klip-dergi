# 11 Kasım Çarşamba planı · çalıştığım gün: 12 Kasım

Dal: `hafta4`

## Planın istediği

- **Photo tipi:** `src`, `width`, `height`, `author`, `license`, `licenseUrl`, `sourceUrl`.
- **1. istek:** `tr.wikipedia.org/api/rest_v1/page/summary/<Ad>` adresinden sayfanın görselini bul. Türkçe sayfada yoksa en.wikipedia.org'u dene.
- **2. istek:** Commons API'den lisansı al. Fotoğrafçı `Artist` alanında, lisans `LicenseShortName` alanında. Görsel adresi `thumburl`'den alınacak, boyut uydurulmayacak.
- **İndirme:** Fotoğrafları bir kez indir ve `public/fotograflar` klasörüne koy. Her ziyarette API'ye gitme.
- **Kaynak kuralı:** Sadece Wikipedia/Commons. Lisansı yazmayan fotoğraf kullanılmayacak.
- **Görünüm:** Fotoğraflar siyah-beyaz olacak, altında atıf yazacak. Fotoğrafı olmayan kişide reel kapağı siyah-beyaz kalacak.
- **Klip kaynakları:** `Source` ve `Podcast` tipleri eklenecek. Emin olunmayan kaynak uydurulmayacak, liste hocaya gönderilecek.
- **Çıktı:** 6 kişide fotoğraf ve atıf, diğerlerinde yedek görsel, 21 klibin kaynağı.

## Durum

| # | Madde | Durum | Commit |
|---|---|---|---|
| 1 | `Photo` tipi | ✅ | `bcd474f` · licenseUrl alanını isteğe bağlı yap |
| 2–3 | Wikipedia + Commons: 6 kart | ✅ | – (araştırma) |
| 4 | 6 fotoğrafı indir + `people.json` | ✅ | 6 kişinin Wikipedia fotoğraflarını ekle · `14e3689` · `fad3e9e` |
| 5 | Siyah-beyaz + atıf | ✅ | `c496a67` |
| 6 | `Podcast` + `Source` tipleri | ✅ | `cec1564` · `046fc1d` |
| 6 | 17 klibin kaynağı (hocanın listesi) | ✅ | `e1e0695` · `99f7797` |

375px kontrolü yapıldı ✅

## 1. Photo tipi: `src/types.ts`

```ts
export type Photo = {
    src: string;          // görselin sitedeki adresi
    width: number;        // genişlik (piksel), tırnaksız = sayı
    height: number;       // yükseklik (piksel)
    author: string;       // fotoğrafçı
    license: string;      // lisans adı (CC BY 4.0 gibi)
    licenseUrl?: string;  // ? = olmayabilir (kamu malında yok)
    sourceUrl: string;    // görselin Commons sayfası
};
// Person içinde:
photo?: Photo;            // ? = 6 kişide fotoğraf yok
```

- **Tahmin/gerçek:** `width` için `string` dedim, gerçekte `number` ❌ Kural: tırnak varsa string, yoksa number.
- **Takıldığım yer:** `license` yerine `lisance` yazdım. Ayrıca `photo: string` yazdım; doğrusu `photo?: Photo`.
- **`licenseUrl?`:** Hamdi'nin fotoğrafı kamu malı ve lisans linki yok. Veri tipe uymayınca tipi düzelttik.

## 2. Wikipedia ve Commons API

- **API, garson gibi** 🍽️: Mutfağa giremezsin, adrese gidip sipariş verirsin. Gelen tabak **JSON** olur.
- **Tahmin/gerçek:** Normal bir Wikipedia sayfası göreceğimi sandım. Gerçekte `{ }` dolu bir yazı (JSON) geldi ❌

**Her kişi için tarif:**
1. `tr.wikipedia.org/api/rest_v1/page/summary/<Ad_Soyad>` → `originalimage` → `source` → adresin sonundaki **dosya adı**. `?`'den sonrası alınmaz.
2. `commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=960&format=json&titles=File:<dosya adı>` → 7 alan:

| Commons alanı | Bizim alan |
|---|---|
| `Artist` | `author` |
| `LicenseShortName` | `license` |
| `LicenseUrl` | `licenseUrl` |
| `thumburl` / `thumbwidth` / `thumbheight` | indirilecek dosya / `width` / `height` |
| `descriptionurl` | `sourceUrl` |

**Adres kodları:** `%2C` = , · `%28` = ( · `%29` = ) · `%C3%A7` = ç · `%C4%9F` = ğ · `%C4%B1` = ı

## 6 kart (hepsi slayt 14 ile aynı ✅)

| Kişi | author | license | boyut |
|---|---|---|---|
| Hamdi Ulukaya | Benjamin Applebaum | Public domain (link yok) | 960×1242 |
| Acun Ilıcalı | Zafer | CC BY 4.0 | 960×1280 |
| Elon Musk | Gage Skidmore | CC BY-SA 4.0 | 960×1262 |
| Abdullah Kiğılı | Serkan Yakın | CC BY-SA 3.0 | 960×1144 |
| Mark Zuckerberg | Jeff Sainlar | CC BY-SA 4.0 | 960×1282 |
| Mehmet Dinçerler | Mehmet Dinçerler | CC BY-SA 4.0 | 960×1440 |

- **Acun:** Dosya adında "Acun" geçmiyor (Fenerbahçe Genel Kurulu, 2024). Kategoride "Acun Ilıcalı" yazıyor, bu fotoğrafın ona ait olduğunu kanıtlıyor.
- **Mehmet:** Wikipedia sayfası yok, Commons aramasıyla bulduk (`list=search`, `srnamespace=6`). Aramada çıkan PDF'ler aynı soyadlı eski bir bakana ait. Fotoğraf "Unidentified men" (kimliği belirlenmemiş) kategorisinde. Reel kapağıyla karşılaştırdım, aynı kişi görünüyor. Hocaya sordum.
- **HTML link:** `Artist` bazen link olarak geliyor. `>` ile `<` arasındaki yazı fotoğrafçının adı (hediye paketi 🎁).
- **İstek sayısı:** yaklaşık 15, sınırın çok altında.

**Takıldığım yerler:**
- `.jp` yazdım → `"missing"` (dosya bulunamadı).
- `Kigili` yazdım → sayfa bulunamadı; doğrusu `Kiğılı`.
- Commons adresinin sonuna `.jpg` yazmayı unuttum.

## 4. İndirme ve `people.json`

- **İndirme:** `thumburl` → sağ tık → **Resmi farklı kaydet** → `public/fotograflar/<slug>.jpg`. Ekran görüntüsü kullanmadım.
- **`public` ve `notlar` farkı:** `public` vitrin gibi, içindeki her dosyanın bir adresi var: `localhost:3000/fotograflar/hamdi-ulukaya.jpg`. Notlar ise defter gibi; `public`'e taşınmaz.
- **JSON kuralları:** Alan adı da tırnaklı yazılır (`"src"`), yorum yazılamaz, son satırdan sonra virgül olmaz.
- **Hata:** Mehmet'in `"author": "???"` alanı boş kalmıştı. Düzeltmeseydim atıf "Fotoğraf: ???" çıkardı ve CC BY-SA kuralı çiğnenmiş olurdu.

## 5. Siyah-beyaz + atıf: `kisiler/[slug]/page.tsx`

```tsx
<figure className="mx-auto w-full max-w-xs md:mx-0">
  {kisi.photo ? (
    <Image src={kisi.photo.src} width={kisi.photo.width} height={kisi.photo.height}
           className="h-auto w-full rounded-lg grayscale" ... />
  ) : (
    <div className="relative aspect-[9/16] ..."><Image src={kapakKlip.cover} fill className="object-cover grayscale" /></div>
  )}
  {kisi.photo && (
    <figcaption>Fotoğraf: {kisi.photo.author} · {licenseUrl ? <a>lisans</a> : lisans} · <a>Wikimedia Commons</a> · siyah-beyaz yapıldı</figcaption>
  )}
</figure>
```

| Sayfa | Sonuç |
|---|---|
| Hamdi | Fotoğraf; "Public domain" link değil (lisans linki yok) |
| Acun | Fotoğraf; "CC BY 4.0" link |
| Nevzat | Reel kapağı siyah-beyaz, atıf yok |

- **Hata:** Elon'un fotoğrafı görünmüyordu. Adresi açınca **404** çıktı, dosya adı `elon-musk..jpg` olarak kaydedilmişti. Kendim buldum ve düzelttim ✅
- **Tahmin/gerçek:** `grayscale` siyah-beyaz yapar → ✅

## 6. Klip kaynakları

```ts
export type Podcast = { slug: string; name: string; host: string; url: string; platforms: string[] };
export type Source = {
    podcastSlug?: string;  // bilinmiyorsa olmayabilir
    episodeTitle: string;
    episodeUrl: string;
    timestamp?: string;    // "12:34" → içinde ":" var, string. Hoca vermedi.
};
// Clip içinde: source?: Source;
```

- **Tahmin/gerçek:** `platforms` için "liste" dedim ✅ ama kodda `string` yazdım; doğrusu `string[]`.
- **Araştırma:** 21 klibin hiçbirinin Instagram açıklamasında kaynak yoktu.
  - Videolarda bazı ipuçları buldum: kırmızı perdeli stüdyo, **XBLACK** yazısı, **dentalPrices** logosu.
  - İnternette aradım ama hiçbir klibi bir bölümle eşleştiremedim. Uydurmadım, hocaya WhatsApp'tan yazdım.
- **Hocanın cevabı:** "Uydurmayıp boş bırakman doğruydu." 17 klibin kaynağını gönderdi, ipuçlarım da doğru çıktı. XBLACK, Startup Grind İstanbul sahnesiymiş.
- **Listede olmayan 4 klip boş kaldı:** Nevzat "Vazgeçmek", Adnan'ın 2 klibi, Mehmet.

```tsx
{klip.source && (
  <p>Kaynak: <a href={klip.source.episodeUrl}>{klip.source.episodeTitle}</a> ↗</p>
)}
```

- **Tahmin/gerçek:** Adnan'da kaynak satırı çıkmaz dedim, çünkü veri yok → ✅

## Tahmin ↔ gerçek

| Konu | Tahminim | Gerçek |
|---|---|---|
| `width` türü | string | number ❌ |
| Kirinti'de `href?` | olmayabilir | ✅ |
| `photo?` sonrası tsc hata verir mi? | hayır | ✅ |
| API adresi açılınca | normal sayfa | JSON ❌ |
| Hamdi'nin lisansı | kamu malı | Public domain ✅ |
| `Abdullah_Kigili` bulunur mu? | bulunur | bulunmadı ❌ |
| `grayscale` | siyah-beyaz | ✅ |
| `platforms` | liste | ✅ |
| Adnan'da "Kaynak:" | yok | yok ✅ |

## Öğrendiğim hata ayıklama yolları

- **Cevapta `missing`, sayfa 404 ya da "bulunamadı" çıkıyorsa** → adı harf harf kontrol et (`.jp`, `Kigili`, `..jpg`).
- **Resim görünmüyorsa** → önce adresini tarayıcıda aç.
- **Kod değişmemiş gibi görünüyorsa** → VS Code'da Ctrl + F ile yeni bir kelime ara (`figure`).
- **Komutlar küçük harfle yazılır:** `NPM RUN DEV` → `Unknown command`.

