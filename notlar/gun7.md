# Gün 7 – 2. hafta, Perşembe: Konu filtresi ve arama

## Ne yaptım
- **Konu filtresi** Çarşamba'da bitmişti (konu düğmeleri, `?konu=` adreste).
- **Ada göre arama kutusu ekledim:** /kisiler sayfasında kutuya yazıp "Ara"ya basınca adres `/kisiler?ara=nevzat` oluyor, sadece adında o yazı geçen kişiler kalıyor.
- **Büyük/küçük harf fark etmiyor:** "NEVZAT", "Nevzat", "nevzat" hepsi Nevzat Aydın'ı buluyor.
- **Konu ve arama birlikte çalışıyor:** `/kisiler?konu=yatırım&ara=ata`. Konuya tıklayınca arama, arama yapınca konu kaybolmuyor.
- **Sonuç yoksa** "Sonuç bulunamadı" ve "Filtreleri temizle" linki çıkıyor.
- **Adresi kopyalayıp başka sekmede açınca aynı sonuç geliyor** (planın çıktısı).
- README'yi güncelledim: arama ve paylaşılabilir adresler eklendi.

## Console'da denediklerim
| Yazdığım | Sonuç | Neden |
|---|---|---|
| `"Nevzat Aydın" === "nevzat"` | false | Büyük N ve fazladan "Aydın" var |
| `"Nevzat" === "nevzat"` | false | N ile n farklı harf |
| `"nevzat" === "nevzat"` | true | Harfi harfine aynı |
| `"Nevzat".toLowerCase() === "nevzat"` | true | Küçük harfe çevirince aynı oldu |
| `"nevzat aydın".includes("nevzat")` | true | Başta geçiyor |
| `"nevzat aydın".includes("aydın")` | true | Sonda geçiyor |
| `"nevzat aydın".includes("zat")` | true | Ortada geçiyor |
| `"nevzat aydın".includes("hamdi")` | false | Hiç geçmiyor |

## Öğrendiklerim
- **`===` eşitliği:** iki yazı harfi harfine aynı olmalı. Arama için uygun değil, çünkü biri adın sadece bir kısmını ya da farklı harf büyüklüğüyle yazabilir. 🔁 **Tekrar bak**
- **`toLowerCase()`:** yazının bütün harflerini küçük yapar. "Nevzat Aydın" → "nevzat aydın".
- **`toLocaleLowerCase("tr-TR")`:** toLowerCase'in Türkçe bilen hali. Düz toLowerCase Türkçe "İ"yi yanlış çeviriyor ("İLİÇ" → "i̇li̇ç"), Türkçe hali doğru çeviriyor ("iliç"). 🔁 **Tekrar bak**
- **Hem adı hem aranan yazıyı küçültmek gerekiyor.** Biri "NEVZAT" yazarsa, aranan yazıyı da küçültmezsek "nevzat aydın" içinde "NEVZAT" bulunamaz.
- **`includes` yazıda:** yazının içinde bu parça var mı? Başta, ortada, sonda fark etmez. Dün listede kullanmıştım (`konular.includes("ekip")`), bugün yazıda. 🔁 **Tekrar bak**
- **Arama şartı:** `kisi.name.toLocaleLowerCase("tr-TR").includes(aramaKucuk)` → "kişinin adını küçült, içinde aranan yazı geçiyor mu?"
- **İki süzgeç arka arkaya:** önce konuya göre `filter`, sonra o sonucu isme göre `filter`. 🔁 **Tekrar bak**
- **`trim()`:** yazının başındaki ve sonundaki boşlukları siler ("  nevzat " → "nevzat").
- **`<form action="/kisiler">`:** Ara'ya basınca kutudaki yazıyı adrese ekleyip sayfaya gidiyor. `name="ara"` adreste `ara=` olarak görünüyor. JavaScript gerekmiyor.
- **`defaultValue`:** sayfa yenilense de yazılan yazı kutuda kalıyor.
- **`<input type="hidden">`:** görünmeyen kutu. Konu seçiliyken arama yapınca konu kaybolmasın diye forma ekledim.
- **`koşul && <...>`:** koşul doğruysa göster, değilse hiçbir şey gösterme. "Sonuç bulunamadı" yazısında kullandım. 🔁 **Tekrar bak**

## Tahmin ve sonuç
- **Tahmin:** `"Nevzat Aydın" === "nevzat"` true çıkar. **Sonuç:** false çıktı. Büyük/küçük harf ve "Aydın" fazlalığı yüzünden.
- **Tahmin:** toLowerCase'ten sonra `"Nevzat".toLowerCase() === "nevzat"` true olur. **Sonuç:** true.
- **Tahmin:** `includes` parçayı yazının her yerinde bulur. **Sonuç:** başta, ortada, sonda buldu; olmayan parçada false.

## Nerede takıldım, nasıl çözdüm
- `===` ile aramanın neden çalışmayacağını ilk başta anlamadım, true sandım. Console'da deneyince gördüm.

## JS boşluğu
- `toLowerCase` ile `toLocaleLowerCase` farkı: başka dillerde de böyle sorunlar var mı?
- `&&` ile `? :` farkı: ikisi de koşullu gösteriyor, hangisi ne zaman?
- `<form>` JavaScript olmadan nasıl çalışıyor, daha iyi anlamam lazım.

## Bugünün iki aracı (kısa özet)

| Araç | Okunuşu | Ne yapar | Örnek |
|---|---|---|---|
| `toLowerCase()` | tu-lovır-keys | Bir yazının bütün harflerini küçük yapar | `"Nevzat Aydın".toLowerCase()` → `"nevzat aydın"` |
| `toLocaleLowerCase("tr-TR")` | tu-lokıl-lovır-keys | Aynı iş, ama Türkçe harfleri (İ, I) doğru çevirir → **büyük/küçük harf farkını yok et** | `"İLİÇ".toLocaleLowerCase("tr-TR")` → `"iliç"` |
| `includes(...)` | inkluuds | **İçinde geçiyor mu?** Cevap true ya da false | `"nevzat aydın".includes("zat")` → `true` |

**includes iki yerde kullanılıyor:**
- **Listede:** `konular.includes("ekip")` → "konular listesinde ekip var mı?" (dün, konu listesini çıkarırken)
- **Yazıda:** `"nevzat aydın".includes("nevzat")` → "bu yazının içinde nevzat geçiyor mu?" (bugün, aramada)

**İkisini birleştirince arama şartı çıkıyor:**

- kisi.name.toLocaleLowerCase(“tr-TR”).includes(aramaKucuk)
**Türkçesi:** "Kişinin adını küçük harfe çevir, içinde aranan yazı geçiyor mu?"