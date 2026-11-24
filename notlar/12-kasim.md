# 12 Kasım Perşembe planı · çalıştığım günler: 13–14 Kasım

Dal: `hafta4`

## Planın istediği

- **Ses denemesi:** Dört sağlayıcıyı aynı paragrafla dene: OpenAI (gpt-4o-mini-tts), ElevenLabs (Multilingual v2), Google Cloud TTS (tr-TR), Azure AI Speech (tr-TR).
- **Paragraf:** Özel isim (Ulukaya, Ilıcalı, Kiğılı, Dinçerler), sayı/tarih (2005), kısaltma (TV8, CEO) olsun.
- **Tablo:** `notlar/ses-karsilastirma.md`: telaffuz, doğallık, karakter başına ücret, 12 profilin maliyeti, ticari kullanım, kelime zamanı. Fiyatlar güncel resmî sayfadan, linkiyle.
- **Akşam:** Sağlayıcı önerisini hocaya yaz.
- **Güvenlik:** API anahtarı `.env.local`'de, repoya girmesin (`.gitignore`). Kendi kartınla ödeme yok.
- **Kurallar:** Ses klonlama yok. Okunacak metin kendi yazdığımız biyografi.
- **Alıntı:** Her kişiye klipten 1–2 cümle, tırnak içinde, hangi klipten olduğu yazılı. Klibi dinleyerek yaz, uydurma.
- **Editör satırı:** Kişi sayfasına `updatedAt` ve `editor`.
- **Çıktı:** Tablo + dört örnek ses; her kişide en az bir alıntı.

## Durum

| # | Madde | Durum | Commit |
|---|---|---|---|
| 1 | 4 sağlayıcı denemesi | ✅ 3'ü denendi · Azure hesap istediği için denenemedi | – (araştırma) |
| 2 | Deneme paragrafı (262 karakter) | ✅ | – |
| 3 | `notlar/ses-karsilastirma.md` | ✅ | Ses sağlayıcı karşılaştırmasını ekle |
| 4 | Kelime zamanı araştırması | ✅ | – |
| 5 | Akşam önerisi | ✅ Mesaj hazırlandı ve gönderildi | – |
| 6 | `.gitignore` kontrolü | ✅ `.env*` satırı var, değişiklik gerekmedi | – |
| 7 | Klon yok, kendi metnimiz | ✅ | – |
| 8 | Alıntılar | ⚠️ 9 kişide 16 alıntı · Aykut, Efe, Mark hocaya soruldu | `de6a4be` |
| 9 | Editör satırı | ✅ | `06b7b09` · `2145827` |
| + | Kişi sayfası: gazete düzeni (hocanın seçtiği Maket E, sade) | ✅ | Kişi sayfasını gazete düzenine geçir |

375px kontrolü yapıldı ✅

## 1. Ses denemesi

**Deneme paragrafı (262 karakter):**

> Hamdi Ulukaya, Chobani'nin temelini 2005 yılında kapanmış bir yoğurt fabrikasını satın alarak attı. Acun Ilıcalı muhabirlikten başlayıp TV8'i satın alacak kadar büyüdü. Abdullah Kiğılı ve Dinçerler Group'un CEO'su Mehmet Dinçerler de hikâyeleriyle Klip Dergi'de.

**12 biyografinin toplamı:** 2.958 karakter (≈ 3 dakika ses). Sadece `bio` alanı sayıldı.

| | ElevenLabs | OpenAI | Google | Azure |
|---|---|---|---|---|
| Nasıl denendi | Ücretsiz hesap (kart yok) | openai.fm demosu | Ürün sayfası demosu | Hesap + kart → denenemedi |
| Telaffuz | 3/5 · Ilıcalı → "İlıcalı", CEO → "ceosu" | 4/5 · Ilıcalı → "Ilıkalı" | **5/5** | – |
| Doğallık | – | Çok doğal | **5/5** | – |
| 12 profil | Free 0 $ (ticari değil) · Starter 6 $/ay | Token bazlı, kesin değil | **0 $** (kotada) | **0 $** (kotada) |
| Kelime zamanı | ✅ zaman damgalı uç | ❌ Whisper ile hizalama | ⚠️ SSML `<mark>`, doğrulanmalı | ✅ WordBoundary |

**Önerim:** Google Chirp 3: HD. Yedek: ElevenLabs. OpenAI önerilmez (Deprecated + kelime zamanı yok).

- **Tahmin/gerçek:** Bir blog ElevenLabs Starter'ı 5 $ yazıyordu, resmî sayfada 6 $ çıktı ❌ Kural: fiyat resmî sayfadan alınır.
- **Takıldığım yer:** ElevenLabs'te dinlediğim ses "Steve Rogers" adlı kütüphane sesiydi. Taklit riski yüzünden yayında kullanılmayacak.
- **Google:** Ana sayfa ile fiyat sayfası WaveNet kotasında çelişiyor (1M ↔ 4M). Fiyat sayfası esas alındı.
- Ayrıntılar: `notlar/ses-karsilastirma.md`. Rapor ve örnek sesler Drive'da.

## 2. `.gitignore` kontrolü

```
# env files (can opt-in for committing if needed)
.env*
```

- `*` = "devamı ne olursa". `.env.local` dahil hiçbir `.env` dosyası GitHub'a gitmez.
- Next.js bu satırı kurulumda kendisi eklemiş. Cuma günü API anahtarı buraya gelecek.

## 3. Alıntılar

**Tip (`src/types.ts`, `Clip` içinde):**

```ts
quote?: string; // klipten alıntı, kişinin kendi sözü. ? = bulamadıklarımızda olmayabilir (Aykut, Efe, Mark)
```

- **Neden `Clip`'e?** Alıntı klibe ait. Klibin içinde durunca "hangi klipten" bilgisi kendiliğinden gelir (fotoğrafın arkasına not yazmak gibi).
- **Tahmin/gerçek:** JSON'da henüz `quote` yokken `tsc` hata verir mi → vermez dedim ✅ (`?` = olmayabilir).

**Yöntem:** Instagram klibini dinledim, kişinin söylediğini kelimesi kelimesine yazdım. Sadece yazım hataları düzeltildi ve noktalama eklendi. Dolgu kelimeler ("yani") atılabilir, kelime eklenmez.

| Kişi | Klip | Alıntı |
|---|---|---|
| Nevzat | 01 Obsesyon | "Yaratıcı olmam gereken bir çocukluk yaşadım. Bende obsesyon var…" |
| Nevzat | 02 Vazgeçmek | "Sosyal çevresinde başarısız olmuş görünmeden bir korku var bizde." |
| Hamdi | 01 Sorunlar | "…Bunların hiçbirisi oturduğumuz yerden çözülmez, bizim yola çıkmamız lazım." |
| Hamdi | 02 Başlamak | "Her şeyi en başta bilmemize gerek yok. Ben de bilmiyordum, kimse de bilmiyordu." |
| Adnan | 01 Cesur kararlar | "1979 yılında ilk atölyemizi açtık, Bayrampaşa'da…" |
| Adnan | 02 Kalite | "Daha çok müşteri sizi şekillendiriyor, kartopu gibi büyüyorsunuz." |
| Mustafa | 01 ICP | "…bu yatırımda ICP diye sana soracak: Kimdir senin ICP?" |
| Mustafa | 02 Genç ekipler | "Yöneticilerin çoğu 95'li." |
| Ata | 01 Evlilik | "Yatırım almak evlilik gibi…" |
| Ata | 02 Pazarlama | "Yatırımın en çok aranma nedeni pazarlama olacak." |
| Acun | 01 Arkadaşlık | "Arkadaşlıktan daha fazla ruhu doyuran bir şey yok." |
| Acun | 02 İyi iş | "Ben bir, mutlu olmayı kovaladım; iki, yaptığım işi daha iyi yapmayı kovaladım." |
| Elon | 01 Korku | "Olasılıkları kabul edersen korku azalır." |
| Elon | 02 Çılgın karar | "En iyi risk düzeltilmiş getiriyi elde etmek amaçsa bir plak şirketi kurmak delilik olur." |
| Mehmet | 01 Boş pazar | "Burada iyi bir marka…" |
| Abdullah | 01 Kâr dengesi | "Bir miktar bizde ettiğimiz kârdan nasibimizi alalım." |

- **Bulunamayanlar:** Aykut (2 klip), Efe (2 klip), Mark (1 klip). Uydurulmadı, hocaya soruldu.
- **Mustafa 02:** Kapakta "Yöneticilerimizin çoğu 95'li" yazıyor. Tekrar dinledim: "Yöneticilerin" diyor. Ekran yazısı ≠ söz, esas olan ses.
- **Elon:** İngilizce konuşuyor, cümleler Türkçe altyazıdan olabilir → hocaya not.

**Sayfada:** `klip.quote && (...)` = alıntı varsa göster. `<blockquote>` = "bu başkasının sözü" diyen etiket.

## 4. Editör satırı

```ts
// Person içinde
updatedAt: string; // "2026-11-14". ? yok: 12 kişide de var
editor: string;    // biyografiyi hazırlayan. Bütün sayfaya ait → Person'da
```

```tsx
Editör: {kisi.editor} · Güncellendi:{" "}
<time dateTime={kisi.updatedAt}>
  {new Date(kisi.updatedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
</time>
```

- **Tahmin/gerçek:** Editör `Clip`'e mi `Person`'a mı → `Clip` dedim ❌ Kural: "Bu bilgi kimin hakkında?" Sayfanın tamamı hakkındaysa `Person`.
- `<time>`: `dateTime` makine için ("2026-11-14"), içindeki yazı insan için ("14 Kasım 2026").
- **Takıldığım yer:** İlk commit'te "2 files changed" çıktı: `page.tsx` yapıştırılmamıştı. Ayrı commit'le düzelttim (`2145827`, 1 file, 9 satır). Ders: "files changed" sayısı beklenenden azsa bir dosya kaydedilmemiştir.

## 5. Kişi sayfası: gazete düzeni

- Hoca 6 maketten **E (gazete)** düzenini seçti.
- İlk deneme kötü oldu: klipler dar sağ sütuna sığmayıp üst üste bindi, sayfada 8 çizgi vardı.
- Sadeleştirdim: üstte tek künye çizgisi, ortada dev isim, solda fotoğraf, sağda bio + alıntılar + editör, klipler aşağıda tam genişlik.
- 3 modern seçenek daha hazırlandı (sade / alıntı bandı / büyük fotoğraf). Şimdilik sade kaldı.
- **Ders:** Az çizgi. Boşluk da bölücüdür. Modern tasarımda tek bir güçlü vurgu olur.




