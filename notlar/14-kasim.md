# Gün 18 · 14 Kasım Cumartesi planı · çalıştığım gün: 15 Kasım · YARIM

Dal: `hafta4`

## Planın istediği

- **Oynatıcı:** `"use client"` bileşen, `audio` etiketi. Oynat/duraklat, hız (1×, 1,25×, 1,5×, 2×), 10 sn geri/ileri, ilerleme çizgisi, süre. Krem zemin, üstte ve altta ince çizgi, bordo yuvarlak oynat düğmesi.
- **Etiket:** "Yapay zekâ ile seslendirildi".
- **Kelime vurgusu:** Biyografiyi kelime kelime `span`'lere böl, `currentTime`'a göre okunan kelimeyi json'dan bul, sarı zeminle vurgula. Okunmuşlar koyu, sıradakiler gri. Hız değişince de doğru kelimede kalsın.
- **Erişilebilirlik:** Düğmeler klavyeyle çalışsın, `aria-label` olsun, telefonda taşma olmasın.
- **Lighthouse:** Puanları nota yaz, 90'ın altını sebebiyle not et.
- **PR:** `hafta4 → main`, önce/sonra ekran görüntüleriyle.

## Hocanın notu (14 Kasım)

Cuma'yı (ses üretimi) şimdilik bırak, sağlayıcı ve fatura kararını Pazar birlikte vereceğiz. Oynatıcıya örnek sesle başla, ilk birkaç kelimenin zamanını elle yazdığın küçük bir json ile dene. Yetişmezse yarım diye push'la.

## Durum

| Madde | Durum |
|---|---|
| Oynatıcı bileşeni (`SesliBiyografi.tsx`) | ✅ |
| Hız, ±10 sn, ilerleme çizgisi, süre | ✅ |
| "Yapay zekâ ile seslendirildi" | ✅ |
| Kelime vurgusu (sarı / koyu / gri) | ✅ İlk 6 kelimeyle çalışıyor |
| `aria-label`, klavye | ✅ |
| Gerçek ses + tam json | ⏳ Cuma'nın sağlayıcı kararına bağlı |
| Kişi sayfasına taşıma | ⏳ Gerçek sesler gelince |
| Lighthouse | ❌ Yapılmadı |
| PR | ❌ Açılmadı |

## Ne yaptım

- `public/ses/deneme.mp3`: Örnek ses (OpenAI, 12 Kasım deneme paragrafı, 19 sn).
- `public/ses/deneme.json`: İlk 6 kelimenin zamanı (`kelime`, `baslangic`, `bitis`).
- `src/components/SesliBiyografi.tsx`: Oynatıcı + kelime vurgusu.
- `src/app/ses-deneme/page.tsx`: Geçici deneme sayfası (`noindex`). Ses deneme paragrafını okuduğu için kişi sayfasına değil buraya koydum. Gerçek sesler gelince silinecek.

## Doğru kelimeyi nasıl buluyorum

```tsx
const okunanSira = kelimeler.findLastIndex((k) => k.baslangic <= simdi);
const okunuyor = okunanSira >= 0 && simdi < kelimeler[okunanSira].bitis;
```

- `findLastIndex`: Başlangıç saniyesi geçmiş **son** kelimeyi bulur, okunan kelime odur. Saate bakıp "şu an hangi ders?" demek gibi: başlama saati geçmiş son ders.
- `simdi < bitis`: Kelime hâlâ okunuyorsa sarı.
- Hız değişince kaymaz: `currentTime` sesin kendi saniyesi, saat saniyesi değil.
- Saniye `requestAnimationFrame` ile okunuyor (saniyede ~60 kez). `timeupdate` saniyede ~4 kez geldiği için vurgu atlıyordu.

## Takıldığım yer

- **Saniyeyi elle bulmak:** Önce oynatıcıdaki `0:01` yazısından okudum. O tam saniye gösteriyor, iki kelime aynı sayıya düştü. Doğrusu: "Şu an: 4.45 sn" yazan bordo satır (ondalıklı). Json şimdilik tahmini değerlerle.
- **Örnek ses "Ilıkalı" diyor:** OpenAI'ın Perşembe'de bulduğumuz telaffuz hatası. Cuma'nın telaffuz sözlüğü düzeltecek.
- **Vercel:** Bilgisayarımda `ERR_SSL_PROTOCOL_ERROR` çıkıyor. Telefonda mobil veriyle açılıyor, yani sorun ağımda.

## Kaldığım yer

1. Görüşmede: sağlayıcı ve fatura kararı → Cuma (`scripts/seslendir.ts`).
2. Gerçek mp3 + json gelince oynatıcıyı kişi sayfasına taşı, deneme sayfasını sil.
3. Lighthouse puanları ve `hafta4 → main` PR.