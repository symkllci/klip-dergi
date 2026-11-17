# Gün 8 · Pazartesi (2 Kasım) planı · çalıştığım gün: 5 Kasım

Dal: `hafta3`

## Bugün ne yaptım

- **PR ve yeni dal:** hafta2 → main PR'ı açık bıraktım (birleştirmeyi hocam yapacak). `git checkout -b hafta3` ile yeni dalı açıp `git push -u origin hafta3` ile GitHub'a gönderdim.
- **Sayfa dili:** `layout.tsx`'te `<html lang="en">` yerine `lang="tr"` yazdım. Artık `uppercase` olan etiketlerde "i" harfi "İ" oluyor (GİRİŞİMCİLİK). Ekran okuyucular da sayfayı Türkçe okuyor.
- **Koyu mod:** Windows koyu moddayken kişi sayfasında yazılar okunmuyordu. Sorun `globals.css`'teki `@media (prefers-color-scheme: dark)` bloğuymuş, arka planı siyah yapıyordu. Bloğu sildim, site artık hep açık renkte açılıyor.
- **Next.js güncellemesi:** 16.4.0 → 16.4.5. İlk denemelerde `npm install` takıldı. Sonunda çalıştı, `npm ls next` ve `npm run build` hatasız.
- **Ölü menü:** Ana sayfa menüsünde tıklanınca hiçbir şey olmayan iki madde vardı. İkisini link yaptım:
  - "Girişimci hikâyeleri" → `href="#hikayeler"`, aynı sayfadaki "Diğer hikâyeler" bölümüne iniyor.
  - "Podcast klipleri" → @viralgirisimci Instagram hesabı, yeni sekmede (`target="_blank"`, `rel="noopener noreferrer"`).
- **Console alıştırması:** Tarayıcı Console'unda `filter`, `find` ve `some`'ı denedim.

## Nerede takıldım

- **npm install bitmiyordu.** Takıldığı yer hep `@next/swc-win32-x64-msvc` (Next'in büyük derleyici dosyası). Denediklerim:
  1. VS Code'u kapatmak, `npm cache clean --force`, `node_modules`'ı silip baştan kurmak → olmadı.
  2. Hocamın önerisiyle `curl.exe` ile hız testi: 34,48 MB 5 dakikada indi. Sorun yavaş internetmiş.
  3. Proje klasörünü Windows Defender'ın dışlamalarına ekledim.
  4. Kurulum `ECONNRESET` hatasıyla durdu (bağlantı koptu).
  5. npm'in tekrar deneme ayarlarını artırdım:
```
     npm config set fetch-retries 5
     npm config set fetch-timeout 600000
     npm config set fetch-retry-maxtimeout 120000
```
     İkinci denemede kurulum 2 dakikada bitti. Küçük paketler önbellekte olduğu için sadece büyük dosyayı indirmesi gerekti.
- **İlk `<a>` satırında `href`'e sınıf adı yazdım** (`href="text-stone-500"`). `href` adresti, `className` görünüm. Düzelttim.
- `Diğer hikâyeler` başlığının üstünde `<section>` yoktu, `<div>` vardı. `id="hikayeler"`'i div'e verdim.

## Console: filter / find / some

Console'u açmak: `localhost:3000` açıkken **F12 → Console**. İlk yapıştırmada Chrome `allow pasting` yazmamı istedi. **↑** tuşu son satırı geri getiriyor.

### Üç araç ne yapıyor?

| Araç | Sorduğu soru | Ne döndürür |
|---|---|---|
| `filter` | Şarta uyanların **hepsi** kim? | Liste `[ ]` |
| `find` | Şarta uyan **ilk** kişi kim? | Tek kişi `{ }` |
| `some` | Şarta uyan **en az bir** kişi var mı? | `true` / `false` |

**Benzetme:** Kutuda yatırımcı arıyorum.
- `filter` → "Yatırımcıları poşete koy." Tek kişi olsa da poşeti verir. Kimse yoksa boş poşet verir.
- `find` → "İlk yatırımcıyı getir." Ata'yı elinden tutup getirir. Kimse yoksa eli boş döner (`undefined`).
- `some` → "Hiç yatırımcı var mı?" Sadece evet/hayır der.

### Şartı okumak: `k => k.konu === "yatırım"`

- `k` → listedeki her kişi, sırayla
- `=>` → "şunu kontrol et"
- `k.konu` → o kişinin konusu
- `=== "yatırım"` → tam olarak "yatırım" mı?

### Denediğim liste

```js
const kisiler = [
  { ad: "Nevzat", konu: "girişimcilik" },
  { ad: "Hamdi", konu: "harekete geçmek" },
  { ad: "Adnan", konu: "risk almak" },
  { ad: "Mustafa", konu: "müşteri" },
  { ad: "Ata", konu: "yatırım" }
];
```

| Komut | "yatırım" ile | "spor" ile (kimse yok) |
|---|---|---|
| `kisiler.filter(k => k.konu === "...")` | `[{ad: 'Ata', ...}]` liste | `[]` boş liste |
| `kisiler.find(k => k.konu === "...")` | `{ad: 'Ata', ...}` tek kişi | `undefined` |
| `kisiler.some(k => k.konu === "...")` | `true` | `false` |

Tahminlerim: "spor" için `[]`, "boş döner", `false` dedim. Üçü de doğruydu. `find`'ın "boş dönmesi" Console'da `undefined` olarak görünüyor.

### Ekranda nasıl ayırt ettim?

- `[ ]` köşeli parantez → liste (Array). `filter`'da `length: 1` yazıyordu.
- `{ }` süslü parantez → tek kişi (Object). `find`'da `length` yoktu.
- `0:` → listenin 0. elemanı. Saymaya 0'dan başlanıyor.
- `▸` üçgene tıklayınca kapalı `{…}` açılıyor.

### Projemde nerede?

| Araç | Dosya | Ne yapıyor |
|---|---|---|
| `filter` | `app/kisiler/page.tsx` | Konu filtresi ve arama, uyan kişilerin hepsi |
| `some` | `app/kisiler/page.tsx` | "Kişinin kliplerinden en az birinin konusu seçili konu mu?" |
| `find` | `lib/people.ts` → `getPersonBySlug` | Slug'a uyan tek kişi |

```js
// kisiler/page.tsx'teki fikir: filter ile some birlikte
const konuyaGore = tumKisiler.filter(k =>
  k.clips.some(c => c.topic === seciliKonu)
);
// "Seçili konudan EN AZ BİR klibi olan kişilerin HEPSİ"
```

`find` `undefined` dönünce kişi sayfası `notFound()` ile 404 gösteriyor (örnek: `/kisiler/ali-veli`).

## Öğrendiklerim

- `Link` site içindeki sayfalar için, dış adresler ve sayfa içi atlama (`#...`) için düz `<a>`.
- `id` bir yere isim takmak gibi. `href="#isim"` o isimli yere götürüyor.
- `npm ls next`'te `invalid` görürsem kurulum yarım kalmış demek.
- `npm audit fix --force` yazmamalıyım, paketleri büyük sürümlere atlatıp projeyi bozabilir.

## Commit'lerim

1. `Sayfa dilini Türkçe yap`
2. `globals.css'teki koyu mod bloğunu kaldır`
3. `Next.js'i 16.4.5'e güncelle`
4. `Menüdeki ölü maddeleri linke çevir`



## Detaylı notlar Drive dosyasında hafta3 klasöründe oalcak.

