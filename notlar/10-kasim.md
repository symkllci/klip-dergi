# 10 Kasım Salı planı · çalıştığım gün: 11 Kasım

Dal: `hafta4`

## Planın istediği

1. **Colossus kartı:** Görsel üstte olacak, altında konu, başlık, tek cümle ve kişi adı. Yazı görselin üstüne binmeyecek. Hepsi tek yerden, `KlipKarti`'den yönetilecek.
2. **Diğer kişiler:** Önce aynı konudaki kişiler gösterilecek.
3. **Vitrin:** Masaüstünde kaydırma çubuğu gizlenecek. `prefers-reduced-motion` açıksa otomatik kayma duracak.
4. **Kanca:** `Person` tipine `dek` alanı eklenecek ve 12 kişiye birer cümle yazılacak. Bio'nun ilk harfi büyük olacak (`::first-letter`).
5. **Klip tıklayınca yüklensin:** Önce kapak ve oynat düğmesi görünecek, embed tıklanınca gelecek. Kişi sayfasının Performance puanı önce ve sonra ölçülecek.
- **Çıktı:** Önce/sonra ekran görüntüleri, 12 kişinin kancası ve Performance önce/sonra puanı notta olacak.

## Durum

| # | Madde | Durum | Commit |
|---|---|---|---|
| 1 | Kart + ana sayfa dergi düzeni | ✅ | `d9f71da` |
| 2 | Diğer kişiler: önce aynı konu · tek etiket | ✅ | `b5478ac` |
| 3a | Vitrin: ortada büyük, yanlarda soluk · çubuk gizli | ✅ | `c3d6468` |
| 3b | Hareket azaltma (`prefers-reduced-motion`) | ✅ | `c385d6c` |
| 4 | Kanca (`dek`) · Mehmet bio güncel · büyük ilk harf | ✅ | `6239593` … |
| 5 | KlipOynatici + Lighthouse önce/sonra | ✅ | `44c7c61` |
| + | Slayt 11: başlık şeridi (🔍 + KİŞİLER bordo) · ana sayfa menüsü | ✅ | `dbf1344` · `f4cff36` |
| + | Ekmek kırıntısı (`Kirinti.tsx`) | ✅ | `72e3a5e` |
| + | "Tüm kişiler" hap buton | ✅ | `e86223d` |
| + | Kişi sayfası: Instagram ikonu + dergi tarzı klipler | ✅ | `8a597df` |
| + | Önce/sonra görüntüleri | ✅ | `811aeb7` |

Görüntüler: `notlar/10-kasim-kartlar-once1.png`, `once2.png`, `sonra1.png`, `sonra2.png`, `10-kasim-lighthouse-acun-once.png`, `-sonra.png`

## 1. Kart: `src/components/KlipKarti.tsx`

```
┌────────────────┐
│   [ kapak ]    │   9:16, kırpılmadan
│                │
├────────────────┤
│ HAREKETE GEÇMEK│   konu (bordo, küçük, BÜYÜK HARF)
│ Başlık (Lora)  │
│ tek cümle      │   kanca (dek)
│     ──         │   bordo çizgi
│  Elon Musk     │   italik isim
└────────────────┘
```

- **Yazıyı kapaktan çıkardım:** `absolute bottom-0` silindi. Artık yazı normal sırada, resmin **altında** (`pt-4`). Siyah gölge (`bg-gradient-to-t`) de silindi.
- **Kartın 3 bedeni (props):** Kıyafet bedeni gibi düşündüm 👕

```tsx
type Boyut = "kucuk" | "buyuk" | "yatay";
export default function KlipKarti({ kisi, klip, boyut = "kucuk" }: { kisi: Person; klip: Clip; boyut?: Boyut }) {
  const buyuk = boyut === "buyuk";
  const yatay = boyut === "yatay";
```

- **Ana sayfa düzeni (Colossus'tan esinli):** Solda 2 küçük, ortada büyük "Öne çıkan", sağda 2 küçük kart var. Altta da 2 yatay kart.

```tsx
const one = digerleri[0];            // ortadaki büyük
const sol = digerleri.slice(1, 3);   // 1 ve 2
const sag = digerleri.slice(3, 5);   // 3 ve 4
const alt = digerleri.slice(5);      // 5'ten sona
```

- Grid: `lg:grid-cols-[1fr_1.55fr_1fr]`. Büyük kart telefonda en üstte görünsün diye `order-first lg:order-none` kullandım.

**Takıldığım yerler:**
- **`const one`'ı iki kere yazdım** → `Cannot redeclare`.
- **`slice(1, 2)` yazdım ama sadece 1 kişi geldi.** Kural: ikinci sayı **son numara + 1** olur.

## 2. Diğer kişiler: önce aynı konu

```tsx
const ayniKonu = tumKisiler.filter((k) => k.slug !== kisi.slug && k.clips.some((klip) => konular.includes(klip.topic)));
const geriKalan = tumKisiler.filter((k) => k.slug !== kisi.slug && !ayniKonu.includes(k));
const digerKisiler = [...ayniKonu, ...geriKalan].slice(0, 3);   // iki treni birleştir, ilk 3
```

- **Konu nerede?** Konu kişide değil, **klipte**: `kisi.topic` ❌ yerine `klip.topic` ✅
- **Etiket sayısı:** Çoğu kişide 2 etiket vardı. Artık herkeste **tek etiket** var: `kapakKlip.topic`.
- **Test:**
  - Acun → Adnan, Elon, Mustafa ✅
  - Ata → yatırım, yatırım, girişimcilik ✅

## 3. Vitrin: `src/components/Vitrin.tsx`

- **Kaydırma çubuğu:** Çubuğu `overflow-x-auto` çıkarıyor. Tahminim `snap-x`'ti ❌. Onu silersem kaydırma da durur. Bunun yerine `globals.css` içinde çubuğu gizledim:

```css
@utility scrollbar-gizle {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
```

- **Yeni tasarım:**
  - Ortadaki kapak büyük ve net, yanlardakiler küçük ve soluk (`scale-90 opacity-40`).
  - Kapaklar ortaya oturuyor (`snap-center`).
  - İlk ve son kapak da ortaya gelebilsin diye iki yanda boşluk var: `px-[calc(50%-130px)]`.
- **Hareket azaltma:**

```tsx
const hareketAzalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (hareketAzalt) return;   // ayar açıksa alarm hiç kurulmasın
```

- **Test:** F12 → ⋮ → More tools → Rendering → `prefers-reduced-motion: reduce`. Tahminim "kayar"dı, gerçekte kaymadı ✅

**Takıldığım yerler:**
- Çubuk gitmedi, çünkü dosyayı **kaydetmemiştim** (sekmedeki ● işareti).
- Anlatım satırlarını da koda yapıştırmıştım, sonra sildim.

## 4. Kanca (`dek`) ve büyük ilk harf

- **`types.ts`:** `dek: string;` ekledim. `npx tsc --noEmit` hata vermedi, çünkü `people.ts`'teki `as Person[]` kontrolü kapatıyor. Bunu hocaya soracağım.
- **12 kanca** `people.json`'da. Taslağı Claude yazdı, ben kontrol ettim:

| Kişi | Kanca |
|---|---|
| Nevzat Aydın | Yemeksepeti'ni kurup sattıktan sonra şimdi yeni girişimlere yatırım yapıyor. |
| Hamdi Ulukaya | Kapanmış bir yoğurt fabrikasını satın alıp Chobani'ye dönüştürdü. |
| Adnan | Küçük bir atölyeyle başladı, büyümek için aile evini sattı. |
| Mustafa | Mugo'dan ikas'a uzanan yolda doğru müşteriyi bulmanın önemini anlatıyor. |
| Ata | PwC'den melek yatırımcı ağına uzanan yolda yatırım almayı evliliğe benzetiyor. |
| Acun Ilıcalı | Muhabirlikten TV8'e ve bir İngiliz futbol kulübüne uzanan yolculuk. |
| Elon Musk | PayPal'ın temelinden SpaceX'e, çılgın denilen kararların ardındaki isim. |
| Aykut | San Francisco'da kurduğu MobileAction'la Türk yetenekleri için büyük hayal kuruyor. |
| Efe | Bağdat Caddesi'ndeki ilk klinikten büyüyen DentGroup'un kurucu ortağı. |
| Mehmet Dinçerler | Gloria Jean's'i Türkiye'de 240 şubeye taşıyan grubun başındaki Gaziantepli girişimci. |
| Abdullah | Kiğılı markasından Futbol Federasyonu başkanlığına uzanan bir iş hayatı. |
| Mark Zuckerberg | Öğrenciyken kurduğu Facebook'tan Instagram ve WhatsApp'ı da içine alan Meta'ya. |

- **Bilgi kontrolü:**
  - Mehmet'in bio'sunu güncelledim: Dinçerler Group CEO'su, grup Gloria Jean's Türkiye haklarına sahip, 240 şube (CNBC-e, 22 Ekim 2026).
  - Efe'nin "YK Başkanı" unvanı için güncel kaynak bulamadım, **açık iş**.
- **Kancanın yeri:** Kartta, vitrinde ve kişi sayfasında **ismin hemen altında** (hocanın 13. slaytı).
- **Büyük ilk harf:**

```tsx
first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-none first-letter:text-rose-800
```

**Takıldığım yerler:**
- Sınıfları tırnağın **dışına** yazdım → `JSX Namespace is disabled ... page.tsx:150`.
- **Tahmin/gerçek:** "`float-left` olmasa da yazı etrafından akar" dedim. Akmadı: harf sadece ilk satırda büyük kaldı ❌

## 5. Klip tıklayınca yüklensin: `src/components/KlipOynatici.tsx`

```tsx
const [oynat, setOynat] = useState(false);       // başta kapak
if (oynat) return <iframe src={embedAdresi(klip)} ... />;   // basınca Instagram
return <button onClick={() => setOynat(true)}> kapak + bordo ▶ </button>;
```

- Kapak kutusu `aspect-[9/16] w-[320px]`, iframe ile aynı boyda. Böylece basınca sayfa kaymıyor.
- `embedAdresi` kişi sayfasından buraya taşındı.

**Lighthouse** (`/kisiler/acun-ilicali`, `npm run build` + `npm start`, gizli pencere, Mobile):

| | Performance | Accessibility | Best Practices | SEO | FCP | LCP |
|---|---|---|---|---|---|---|
| Önce | 75 | 96 | 100 | 100 | 3,6 sn | 4,3 sn |
| Sonra | **85** | 96 | 100 | 100 | **0,9 sn** | 4,0 sn |

- **Önce neden düşüktü?** Sayfa açılır açılmaz 2 Instagram iframe'i yükleniyordu.
- **Sonra neden hâlâ 90'ın altında?** LCP, yani en büyük kapak resmi, yavaş mobil bağlantıda geç geliyor.
- **"Açılmıyor" sandım.** Sebebi zamanmış: JS yüklenmeden düğme tıklamayı duymuyor, Instagram da birkaç saniyede iniyor.
- **Not:** Videoyu izlemek için **iki kez** basmak gerekiyor: önce bizim ▶, sonra Instagram'ınki. Bunu hocaya soracağım.

## Ek işler

- **Başlık şeridi (slayt 11):**
  - Sağda 🔍 var. Basınca hap şeklinde arama kutusu açılıyor: `aramaAcik` adında 4. hafıza kutusu ekledim.
  - KİŞİLER yazısı bordo oldu.
  - Esc ikisini de kapatıyor.
- **Ana sayfa menüsü:** Lora yazı tipi, bordo renk, aralarında nokta. Telefonda bölünmesin diye `whitespace-nowrap` kullandım.
- **Ekmek kırıntısı:** `Kirinti.tsx` dosyasıyla "Ana sayfa › Kişiler › Hamdi Ulukaya" satırı geldi. Bulunduğun sayfa (`href` yok) bordo görünüyor ve tıklanmıyor.
- **"Tüm kişiler" butonu:**
  - Hap şeklinde oldu.
  - Fareyle üstüne gelince bordo doluyor.
  - Ok sağa kayıyor: `group-hover:translate-x-1`.
- **Kişi sayfasındaki Instagram linki:** Yazı yerine yuvarlak ikon oldu. Ekranda yazı olmadığı için ekran okuyucuya adı `aria-label` söylüyor.
- **Klipler (dergi tarzı, B seçeneği):**

```tsx
{kisi.clips.map((klip, sira) => (
  <p className="font-serif text-5xl italic text-rose-800">0{sira + 1}</p>   // 01, 02
```

  - Tahminim "ilk `sira` 1"di ❌. Gerçekte **0** çıktı, çünkü bilgisayar 0'dan sayar. Ekrana yazarken `+1` ekledim.
  - Başlığa `min-h-14` verdim. 2 satıra taşan başlık kapağı aşağı itiyordu, şimdi bütün kapaklar aynı hizada.

## Tahmin ↔ gerçek

| Konu | Tahminim | Gerçek |
|---|---|---|
| Kartta yazı nerede? | Altında (B) | İçinde (A) ❌ |
| Acun'un diğer kişileri | Adnan, Elon | Adnan, Elon, Mustafa ✅ |
| Çubuğu ne çıkarıyor? | `snap-x` | `overflow-x-auto` ❌ |
| Hareket azaltma açıkken vitrin | Kayar | Kaymadı ❌ |
| `float-left` olmadan yazı akar mı? | Akar | Akmadı ❌ |
| Kırıntıda "Kişiler" | Gri, tıklanır | Bordo, tıklanmaz ❌ |
| KlipOynatici sonrası puan | Artar | 75 → 85 ✅ |
| İlk klibin `sira`'sı | 1 | 0 ❌ |
| `font-serif` → "Klipler" ile aynı font | Evet | Evet ✅ |



