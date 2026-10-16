# Gün 3 – Kişi sayfaları (16 Ekim 2026, Cuma)

## Ne yaptım
- **/kisiler sayfası** (`src/app/kisiler/page.tsx`): 5 kişinin kart listesi. Her kartta ad, kısa bio (bio'nun ilk cümlesi) ve klip sayısı var. Kişinin adına tıklayınca kendi sayfasına gidiyor.
- **/kisiler/[slug] sayfası** (`src/app/kisiler/[slug]/page.tsx`): Tek dosyayla 5 kişinin sayfası. Her sayfada biyografi, sosyal medya linkleri ve klipler var.
- **Klipler:** Instagram reel'lerini iframe ile sayfanın içinde gösteriyorum (embed). Platform YouTube olursa YouTube embed adresi kullanılıyor. Embed yüklenmezse altında "Klibi Instagram'da izle" düz linki var.
- **404:** Olmayan bir slug yazılırsa (ör. /kisiler/ali-veli) `notFound()` ile 404 sayfası çıkıyor.
- **generateStaticParams:** 5 kişi sayfası build sırasında önceden üretiliyor. `npm run build` çıktısında 5 sayfanın yanında ● (SSG) işaretini gördüm.
- **Tasarım:** Tailwind ile kişiler sayfasını (çerçeveli, yan yana kartlar) ve kişi sayfasını (klipler yan yana, geri dönüş linki) düzenledim.
- **Veri düzeltmeleri** (`people.json`):
  - Instagram embed'in çalışması için klip adreslerindeki `viralgirisimci/` kısmını sildim (Instagram'ın desteklediği biçim: `instagram.com/reel/KOD/`).
  - Mustafa Namoğlu ve Ata Uzunhasan'ın bio'larını yeniden yazdım.


## Öğrendiğim kavramlar
- **Klasör = adres:** `app/kisiler/page.tsx` → /kisiler. Sayfa dosyasının adı hep `page.tsx`, adresi klasörün adı belirliyor.
- **export default:** Bu dosyanın asıl sayfası bu bileşen.
- **[slug] klasörü:** Köşeli parantezli klasör "değişken" demek. /kisiler/ sonrasına ne gelirse aynı sayfa açılıyor, gelen kısım `params` ile sayfaya veriliyor.
- **async / await:** params biraz sonra geliyor (kargo gibi), `await` ile gelmesini bekliyorum.
- **map:** Listedeki her elemanı bir parçaya çeviren fabrika bandı. 5 kişi → 5 kart, 2 klip → 2 iframe.
- **key:** Her satırın kimliği. Kişide slug, linkte linkin kendisi, klipte url.
- **Nokta = içindeki:** `kisi.name`, `kisi.clips.length`.
- **.length:** Listede kaç eleman var.
- **split(". ")[0]:** Bio'yu nokta-boşluk gördüğü yerden kes, ilk parçayı al (ilk cümle).
- **Ters tırnak ve ${ }:** Sabit yazıyla değişkeni birleştirir: `` `/kisiler/${kisi.slug}` ``
- **Link ve a:** Sitenin içindeki sayfalar için `<Link>`, başka sitelere gitmek için `<a>`. `target="_blank"` yeni sekmede açar.
- **if (!kisi):** "Eğer kişi yoksa". `!` = değil / yok.
- **notFound():** 404 sayfasını gösterir, kodun devamı çalışmaz.
- **iframe:** Sayfanın içinde başka bir sitenin sayfasını gösteren pencere.
- **+ ve .replace():** `+` iki yazıyı birleştirir, `.replace(eski, yeni)` yazının bir parçasını değiştirir.
- **generateStaticParams:** Build sırasında hangi sayfaların önceden üretileceğini Next.js'e söyler (pastane benzetmesi: pastaları dükkân açılmadan vitrine koymak).
- **npm run build:** Vercel'in yayına alırken yaptığı işin aynısı. Canlıya almadan önce hata var mı diye bilgisayarımda denedim.
- **Tailwind:** className içine kısa kelimeler: `text-3xl`, `font-bold`, `p-4`, `mb-4`, `border`, `rounded-lg`, `grid`, `gap-4`, `sm:grid-cols-2`, `hover:shadow-md`.
- **JSX içinde açıklama:** `{/* açıklama */}` diye yazılır, `//` sadece JSX dışında çalışır.

## Nerede takıldım, nasıl çözdüm
- **Embed adresleri:** Bazı klip adreslerinde `viralgirisimci/` vardı, Instagram'ın embed belgesindeki biçime uymuyordu. people.json'da düzelttim.
- **Bio'lar:** Kartlarda Ata Uzunhasan'ın bio'su çok uzun ve sonunda ".." çıktı, çünkü cümleler bitişik yazılmıştı ("tamamlamıştır.günümüzde"). split kesecek yer bulamıyordu. Bio'yu yeniden yazınca düzeldi.
- **Boş commit (yine):** "Kişiler sayfasını oluştu" commit'i 0 insertions ile gitti, kaydetmemiştim. Sonraki commit'le düzeldi. `git status` ile commit'lenmemiş değişiklikleri kontrol etmeyi öğrendim.

## Claude'un yazdığından neyi değiştirdim
- Kodu Claude ile adım adım yazdım. Çoğu adımda önce boşluk doldurma ve sorularla mantığı kurdum (map, kisi.name, kisi.slug, kisi.bio, split, platform === "instagram"), sonra doğru olunca vs code geçirdim


## Dosyalar
- `src/app/kisiler/page.tsx`: Kişiler sayfası. Tüm kişileri getAllPeople ile alıp map ile karta çeviriyor.
- `src/app/kisiler/[slug]/page.tsx`: Kişi sayfası. Adresteki slug ile getPersonBySlug'dan kişiyi buluyor; bio, linkler ve klipleri gösteriyor. generateStaticParams ile 5 sayfa build'de üretiliyor.
- `src/data/people.json`: Klip adresleri ve iki bio düzeltildi.
- `notlar/gun3.md`: Bu not.

