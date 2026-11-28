# Gün 28 · 26 Kasım Perşembe planı · çalıştığım gün: 27–28 Kasım

> 6\. haftaya 1 gün geç başladım. Perşembe planını 27 Kasım gecesi başlayıp 28 Kasım öğlen bitirdim.

Dal: `hafta6`

## Planın istediği

- Kayıt formu (ana sayfada bülten kutusu ve `/bulten`) ve formu karşılayan sunucu ucu (route handler, POST)
- Geçersiz e-posta ve aynı e-postanın ikinci kez kaydı Türkçe hata mesajıyla reddedilsin
- `/gizlilik`: KVKK aydınlatma metni, taslak olarak, başında "taslak" notu
- Onay kutusu işaretlenmeden kayıt olmasın; onay metni ve zamanı kayıtla birlikte saklansın
- Kayıt gerçek bir yere yazılmasın, yalnız terminale. Gerçek kişilerin e-postası toplanmıyor
- Çıktı: üç durumun ekran görüntüsü (başarılı kayıt, geçersiz e-posta, onaysız kayıt)

📚 Kaynaklar: [Zod: Basic usage, safeParse](https://zod.dev/basics) · [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

## Yaptıklarım

| # | Ne yaptım | Commit |
|---|---|---|
| 1 | Sözlüğe bülten ve gizlilik yazıları, `/api/bulten` sunucu ucu, `/bulten` sayfası | `9c49639` |
| 2 | Form bileşeni `BultenFormu.tsx` (1. commit'te unutulmuştu) | `cc5c534` |
| 3 | `/gizlilik` KVKK aydınlatma metni TASLAK | `266aa72` |
| 4 | Ana sayfaya bülten kutusu, footer'a Bülten ve Gizlilik, sitemap'e `/bulten` | `4bd26e8` |
| 5 | ☰ menüye Bülten | `ae6fd9b` |
| 6 | 4 ekran görüntüsü | `5e43cdb` |

## Çıktılar

- [26-kasim-bulten-onaysiz.png](26-kasim-bulten-onaysiz.png): "Kayıt için onay kutusunu işaretlemelisin."
- [26-kasim-bulten-gecersiz.png](26-kasim-bulten-gecersiz.png): "Geçerli bir e-posta adresi yaz."
- [26-kasim-bulten-basarili.png](26-kasim-bulten-basarili.png): "✓ Teşekkürler! Kaydın alındı."
- [26-kasim-bulten-kayitli.png](26-kasim-bulten-kayitli.png): "Bu e-posta adresi zaten kayıtlı." (planın 3 görüntüsüne ek olarak aynı e-posta durumu)

## 1. Nasıl çalışıyor?

```
Form (tarayıcı)  ──POST──►  /api/bulten (sunucu)  ──►  terminal (console.log)
BultenFormu.tsx              route.ts
      ▲                         │
      └───── cevap ─────────────┘   { ok: true }  ya da  { ok: false, kod: "onayYok" }
```

```ts
const KayitSemasi = z.object({
  eposta: z.email(),      // geçerli e-posta mı?
  onay: z.literal(true),  // kutu işaretli mi? (z.boolean() olsaydı false da geçerdi)
  dil: z.enum(["tr", "en"]),
});
const sonuc = KayitSemasi.safeParse(govde); // çökmeden kontrol: sonuc.success
```

- Hata mesajları sözlükte (`s.bulten[kod]`): Türkçe sayfada Türkçe, İngilizce sayfada İngilizce.
- `noValidate`: tarayıcının kendi (çoğu zaman İngilizce) uyarı balonu kapalı, kontrol sunucuda.
- Onay hem formda hem sunucuda: formu atlayıp doğrudan `/api/bulten`'e istek atan olabilir, asıl kapı sunucu.
- Aynı e-posta: `Set` (tekrarsız liste). Büyük-küçük harf ve boşluk farkı aynı adres sayılıyor. Sunucu yeniden başlayınca sıfırlanıyor, gerçek veritabanı değil.
- Onay metni formdan değil sözlükten alınıyor: kullanıcının ekranda gördüğü cümlenin aynısı.
- Ana sayfa kutusu ve `/bulten` aynı bileşen, aynı `/api/bulten`: ana sayfadan kaydolan adres `/bulten`'de "zaten kayıtlı" diyor.

Terminalde görünen kayıt:

```
[bulten] yeni kayıt (sadece terminal, hiçbir yere yazılmadı): {
  eposta: 'deneme@ornek.com',
  onay: true,
  onayMetni: 'Klip Dergi bülteninin e-posta adresime gönderilmesine onay veriyorum.',
  onayZamani: '2026-11-27T21:19:17.675Z',
  dil: 'tr'
}
POST /api/bulten 400 · 400 · 201 · 409   (onaysız · geçersiz · başarılı · aynı)
```

`onayZamani` UTC (sondaki Z): Türkiye saatinden 3 saat geri.

## 2. /gizlilik

- Başta kırmızı çizgili TASLAK kutusu: hukukçu incelemedi, gerçek e-posta toplanmıyor.
- Bölümler: veri sorumlusu, işlenen veriler, amaç, hukuki sebep (açık rıza KVKK m.5/1 + 6563 onayı), aktarım, saklama süresi, haklar (KVKK m.11), başvuru.
- Bilmediğimiz yerler `[Taslak: … belirlenecek]` diye bırakıldı, uydurulmadı.
- `robots: noindex`: taslak Google'da çıkmasın. Bu yüzden sitemap'e de konmadı.
- İngilizce sayfada metin Türkçe, üstte "available in Turkish only" notu. Hukuki metin hukukçu onayından önce çevrilmiyor. `<article lang="tr">`: ekran okuyucu metni Türkçe okusun.

## 3. Tasarım kararları

- Ana sayfa kutusu: A (ince çizgili) seçildi, B (koyu kutu) değil. Görsel karşılaştırmayı görüp seçtim: koyu kutu footer'ın kırmızı şeridiyle üst üste ağır duruyordu, sayfada zaten koyu bir alıntı bandı var.
- Telefonda başlık "e-" / "postanda" diye bölünüyordu → `text-balance text-2xl sm:text-4xl`.
- ☰ menüye Bülten'i ben önerdim. Gizlilik menüye konmadı, footer'da ve formun altında.
- Sitemap 30 → 32 adres (`/bulten` TR + EN).

