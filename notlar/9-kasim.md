# 9 Kasım Pazartesi planı · çalıştığım günler: 10–11 Kasım

Dal: `hafta4` (hafta3'ten açıldı)

## Planın istediği

- **İnce başlık:** `Header` bileşeni, `layout.tsx`'ten her sayfada aynı. Solda ☰ menü, ortada logo, sağda arama ve Kişiler. Aşağı inince üstte kalır. Örnek: Colossus.
- **☰ menü:** `useState` ile açılıp kapansın. Klavyeyle de çalışsın, Esc kapatsın, düğmede `aria-expanded` olsun.
- **Kayıp sekme başlığı:** `kisiler/[slug]/page.tsx`'e `generateMetadata`. Sekmede "Hamdi Ulukaya · Klip Dergi", açıklama ve paylaşım görseli.
- **Yazı tipi:** metin fontu Geist yerine Inter, uzun okuma metni Lora (`next/font`).
- **Alt bilgi:** Hakkında, İletişim, Instagram ve YouTube hesapları, telif notu.
- **/hakkinda:** proje ne, ilkelerimiz, künye, kaldırma politikası (24 saat).
- **Çıktı:** Üç sayfada aynı başlık, kişi sekmesinde kişinin adı, WhatsApp'ta paylaşınca kapak görünüyor, her sayfanın altında alt bilgi.

## Durum

| # | Madde | Durum | Commit |
|---|---|---|---|
| 0 | `hafta4` dalı | ✅ | – |
| 1 | İnce başlık (Header) | ✅ | `f0c85ee` (yarım) · `a120ea4` |
| 2 | ☰ menü, Esc, `aria-expanded` | ✅ | Menüyü açılıp kapanır yap |
| 3 | Sekme başlığı + paylaşım görseli | ✅ (WhatsApp kapağı: birleştirmeden sonra) | `109b8d8` |
| 4 | Inter + Lora | ✅ | Metin fontunu Inter, biyografiyi Lora yap |
| 5 | Alt bilgi | ✅ (e-posta, X, YouTube **demo**) | `d2cd318` |
| 6 | Hakkımızda sayfası | ✅ | `e6fbfb4` |
| + | Arama: ad + konu + klip başlığı | ✅ | Aramayı konu ve klip başlığını da kapsayacak şekilde genişlet |


## 0. hafta4 dalı

```powershell
cd Desktop\klip-dergi      # git sadece proje klasöründe çalışır
git checkout hafta3
git pull
git checkout -b hafta4     # -b: yeni dal oluştur + ona geç
git branch                 # bütün dallar, * = buradasın
```

- İlk deneme `C:\Users\seyma` içindeydi ve şu hatayı verdi: `fatal: not a git repository`. Git kendi kayıt defterini (`.git`) bulamadı.
- Tahminim B şıkkıydı (`hafta1, hafta2, hafta3, * hafta4, main`). Aynen çıktı ✅

## 1. İnce başlık: `src/components/Header.tsx`

```
☰                 Klip Dergi                 Kişiler  (🔍 Ara)
──────────────────────────────────────────────────────────────
```

| Ne | Nasıl |
|---|---|
| Her sayfada | `layout.tsx`: `<Header />{children}<Footer />` |
| 3 eşit sütun, logo tam ortada | `grid grid-cols-3` + `justify-self-start / center / end` |
| Kayarken üstte kalsın | `sticky top-0 z-50 bg-amber-50` |
| Ana sayfada en üstte saklansın | `usePathname() === "/"` + kaydırma kulağı (`scrollY > 200`) |
| Saklanma | ana sayfada `fixed` + `-translate-y-full` (perde yukarı), `transition-transform` |
| Arama kutusu | `<form action="/kisiler">` + `<input name="ara">` → `/kisiler?ara=acun` |
| Büyüteç | `svg` (daire + çizgi), `aria-hidden`, `absolute left-3` |
| Telefonda | Kişiler linki `hidden sm:inline` (yoksa logonun üstüne biniyordu) |

```tsx
const anaSayfa = usePathname() === "/";          // Ana sayfada mıyız?
const [kaydi, setKaydi] = useState(false);       // Aşağı kaydırıldı mı?

useEffect(() => {                                // Kulak 👂: kaydırmayı dinle
  const dinle = () => setKaydi(window.scrollY > 200);
  dinle();
  window.addEventListener("scroll", dinle);
  return () => window.removeEventListener("scroll", dinle);
}, []);

const gizli = anaSayfa && !kaydi && !acik;       // Ana sayfa + en üst + menü kapalı → saklan
```

**Takıldığım yerler:**
- **Fonksiyon adını "layout" yazdım.** Kural: Bileşenin adı dosyanın adıyla aynı olur ve **büyük harfle** başlar (`Header`).
- **Düğmeyi `{<button>}` diye yazdım.** `{ }` sadece JavaScript için kullanılır, burada gereksizdi.
- **Logonun adresini "page" sandım.** Dosya ile adres farklı şeyler: Ana sayfanın adresi `/`.
- **`import Header`'ı Header.tsx'in kendi içine yazdım.** Sonra `<Header>` ile `<body>`'yi sardım. Doğrusu: `<body><Header />{children}</body>`.
- **`<div></div>`'i boş yazdım.** Linkler kutunun dışında kaldı.
- **`usePathname`'i fonksiyonun dışına yazdım.** Hata şuydu: `Invalid hook call ... Header.tsx:3:29`. Hook'lar (`use...`) sadece fonksiyonun içinde çalışır.

## 2. ☰ menü

```tsx
const [acik, setAcik] = useState(false);         // Başta kapalı (hoca: "kapalı gelir")

<button
  type="button"
  onClick={() => setAcik(!acik)}                 // ! = tersi → ışık düğmesi 💡
  aria-expanded={acik}                           // Ekran okuyucu: menü açık mı?
  aria-label={acik ? "Menüyü kapat" : "Menüyü aç"}
>
  {acik ? "×" : "☰"}
</button>

{acik && ( <nav> Ana sayfa · Kişiler · Hakkımızda </nav> )}   // Açıksa göster
```

Esc için ikinci kulak:

```tsx
useEffect(() => {
  const dinle = (e: KeyboardEvent) => { if (e.key === "Escape") setAcik(false); };
  window.addEventListener("keydown", dinle);
  return () => window.removeEventListener("keydown", dinle);
}, []);
```

- **Klavye:** `<button>` kendiliğinden Tab ile seçilir, Enter ile basılır.
- **Esc ilk denemede çalışmadı:**
  - Önce bloğu kopyalamıştım ama değiştirmemiştim. Bilgisayar sadece yazanı yapar.
  - Sonra kod doğru olduğu hâlde yine çalışmadı. Tarayıcı eski kodu tutuyordu, **Ctrl + F5** ile düzeldi.

## 3. Sekme başlığı ve paylaşım görseli

`layout.tsx`:

```tsx
metadataBase: new URL("https://klip-dergi.vercel.app"),          // Paylaşım resmi için gerçek adres
title: { default: "Klip Dergi", template: "%s · Klip Dergi" },    // %s = sayfanın başlığı
```

`kisiler/[slug]/page.tsx`:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kisi = getPersonBySlug(slug);
  if (!kisi) return {};
  const kapak = kisi.clips[0]?.cover;
  return {
    title: kisi.name,                                             // → "Hamdi Ulukaya · Klip Dergi"
    description: kisi.bio,
    openGraph: { title: `${kisi.name} · Klip Dergi`, description: kisi.bio, images: kapak ? [kapak] : [] },
  };
}
```

**Nasıl kontrol ettim?**
- Console'a `document.title` yazdım, çıkan sonuç: `'Hamdi Ulukaya · Klip Dergi'` ✅
- **Ctrl + U** ile sayfa kaynağını açtım:
  - `og:title` = "Hamdi Ulukaya · Klip Dergi" ✅
  - `og:image` = `https://klip-dergi.vercel.app/kapaklar/DeEQ_nGgm0G.jpg` ✅
- `metadataBase` uyarısı (`using "http://localhost:3000"`) kayboldu ✅

**WhatsApp:** Önizlemede sadece alan adı çıktı, resim gelmedi. Kod doğru ama iki sebep var:
1. Resim adresi ana siteyi gösteriyor ve ana sitede kapaklar henüz yok (PR'lar birleşmedi).
2. Vercel önizleme sitesi korumalı, WhatsApp içeri giremiyor. Bilgisayarımda da `ERR_SSL_PROTOCOL_ERROR` verdi.

➡️ Birleştirmeden sonra tekrar denenecek.

## 4. Yazı tipi: Inter + Lora

- Bir şey buldum 🔍 `globals.css`'te `body { font-family: Arial }` yazıyordu. Geist yükleniyordu ama **hiç kullanılmıyordu**, yani site haftalardır Arial'mış.
- `layout.tsx`: `Inter` (`--font-inter`) ve `Lora` (`--font-lora`) eklendi, Geist silindi.
- `globals.css` (aşağıdaki kod) ve beyaz şerit düzeltmesi: `--background: var(--color-amber-50)`

```css
@theme inline {
  --font-sans: var(--font-inter);   /* font-sans = Inter */
  --font-serif: var(--font-lora);   /* font-serif = Lora */
}
body { font-family: var(--font-inter), Arial, sans-serif; }
```

- Kişi sayfasındaki bio artık `font-serif`, yani Lora. Geçen haftadan kalan "bio serif değil" işi kapandı ✅

## 5. Alt bilgi: `src/components/Footer.tsx`

```
                    Klip Dergi
     Viral olan girişimcilerin podcast kliplerini...
   ──────────────────────────────────────────────
      DERGİ          İLETİŞİM           BİZİ TAKİP EDİN
    Hakkımızda   info@klipdergi.com    (IG) (X) (YT)
     Kişiler
   ──────────────────────────────────────────────
   © 2026 Klip Dergi. Klipler ve görseller sahiplerine aittir.   Başa dön ↑
```

- **Görünüş:** Bordo zemin (`bg-rose-800`) ve beyaz yazı. Logo ortada, Lora italik.
- **Tasarım yolculuğu:** Önce koyu zemin ve dev logo vardı. Beğenmedim: Logo çok büyüktü, p ve g harfleri kesilmişti. Sonra krem zemini denedim, en son bordoda karar kıldım.
- **Sabitler:** `sutunBasligi` ve `simgeDugmesi`. Aynı className'i 3 kere yazmamak için kalıp yaptım.
- **Görünmeme sorunu:** Footer ilk eklendiğinde görünmedi. `npm run dev` yeniden başlatınca düzeldi (yeni dosya).
- **"Unknown at rule @theme" uyarısı:** Zararsız. VS Code, Tailwind'in kuralını tanımıyor.

## 6. Hakkımızda: `src/app/hakkinda/page.tsx`

- **Adres** `/hakkinda`, **görünen yazı** "Hakkımızda". Menü ve alt bilgi de böyle.
- **Bölümler:**
  - Giriş
  - İlkelerimiz (01–03)
  - Künye (`map` ile liste)
  - Kaldırma politikası (**24 saat içinde kaldırılır**)
- **Künye:**
  - Şeyma Kelleci · Tasarım · Yazılım geliştirici
  - Mustafa Yusuf Aksoy · Proje yöneticisi · Yazılım geliştirici
  - İsimler Instagram'a gidiyor. Linklerdeki `?xtok=...` takip kodlarını temizledim.
- **Sekme başlığı:** `metadata.title = "Hakkımızda"`, sekmede "Hakkımızda · Klip Dergi" yazıyor.
- **Kısa if:** `satir.link ? <a>...</a> : satir.isim`. Anlamı: Linki varsa tıklanabilir yap, yoksa düz yazı.

## Ek: Arama genişletme

```tsx
const adindaVar = kisi.name.toLocaleLowerCase("tr-TR").includes(aramaKucuk);
const klibindeVar = kisi.clips.some(
  (klip) =>
    klip.topic.toLocaleLowerCase("tr-TR").includes(aramaKucuk) ||
    klip.title.toLocaleLowerCase("tr-TR").includes(aramaKucuk)
);
return adindaVar || klibindeVar;   // || = "ya da"
```

- Önce: "ekip" araması **0** sonuç veriyordu, çünkü kod sadece ada bakıyordu. Şimdi **2** sonuç ✅
- Bio'yu bilerek aramaya katmadım, çok fazla sonuç çıkarırdı.
- Başlıktaki 🔍 kutusu da aynı arama motorunu kullanıyor. Tek düzeltme iki yeri birden düzeltti.

## Tahmin ↔ gerçek

| Konu | Tahminim | Gerçek |
|---|---|---|
| `git branch` çıktısı | B | B ✅ |
| Header layout'ta nerede görünür? | Bütün sayfalarda | ✅ |
| 4 parça + `justify-between` | Logo ortada değil (B) | ✅ |
| `anaSayfa` Kişiler'de | false | false ✅ (`console.log` ile kanıt) |
| Menü başta | Kapalı | ✅ |
| Sitede font | Arial | Arial ✅ |
| "ekip" araması (eski kod) | 2 | 0 ❌ (sadece ada bakıyordu) |
| "ekip" araması (yeni kod) | kaç tane ekip varsa | 2 ✅ |

## Öğrendiğim hata ayıklama yolları

- **Hata mesajı nereyi gösteriyor?** `Header.tsx:3:29` = dosya, satır, karakter.
- **Tahmini kanıtla:** `console.log("Ana sayfa mı?", anaSayfa)` → F12 → Console.
- **Görünmeyen şeyi kontrol et:** `document.title`, **Ctrl + U** (sayfa kaynağı) + **Ctrl + F**.
- **Kod doğru ama ekran eski:** **Ctrl + F5**.
- **Yeni dosya görünmüyor:** `npm run dev`'i yeniden başlat.
- **F12 açıkken** Esc gibi tuşlar Console'a gidebilir.

## Açık işler

- [ ] WhatsApp kapağını birleştirmeden sonra test et
- [ ] Gerçek e-posta ve YouTube/X hesapları gelince alt bilgiyi ve künyeyi güncelle (şimdilik DEMO)
- [ ] Hocaya: `as Person[]` sorusu (gun9'dan)

## Hocaya sorularım

1. Büyük logo yalnız ana sayfada, diğer sayfalarda baştan ince şerit var. Böyle mi istiyordunuz?
2. Arama Kişiler sayfasında çalışıyor (ad, konu ve klip başlığında). Ayrı bir arama sayfası gerekir mi?
3. Alt bilgideki demo e-posta ile X ve YouTube linkleri ne zaman gerçeğiyle değişecek?
4. İnce şerit ana sayfada 200 piksel kaydırınca iniyor. Bu sayıyı elle mi yazmalıyım, yoksa büyük logonun yüksekliğine göre mi ayarlanmalı?
5. Konuya göre arama yapınca kartta kişinin ilk klibi görünüyor, aranan klip değil. Eşleşen klibi göstermeli miyim?
6. Telefonda başlıktaki “Kişiler” linkini gizledim, çünkü logonun üstüne biniyordu. Menüde var. Bu yeterli mi?