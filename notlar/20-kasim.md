# Gün 23 · 20 Kasım Cuma planı · çalıştığım gün: 20–21 Kasım

Repo: `turkce-asr-ozel-isim` (hocanın reposu) · Fork: `symkllci/turkce-asr-ozel-isim` · Dal: `wikidata-foto`

## Planın istediği

- **Wikidata kimliği:** Sözlükteki kişilere Q kimliği (wbsearchentities ile adla ara).
- **Fotoğraf bilgisi:** Wikidata'nın kişiye bağladığı resim (P18). Lisans ve fotoğrafçı Commons API'den.
- **4 yeni alan:** `wikidata`, `image`, `image_license`, `image_author`. P18'i olmayan kişide boş.
- **Testler:** wikidata = "Q" + rakam; image varsa lisans ve fotoğrafçı zorunlu. CONTRIBUTING.md alan tablosu.
- **Çıktı:** Fork'tan ana repoya PR, testleri yeşil.
- **Kural:** Fotoğraf **dosyası** eklenmez, yalnız **bilgisi**. Sözlük CC0, Commons fotoğrafları çoğunlukla CC BY-SA → ikisi karışmasın.

📚 Kaynaklar: [Wikidata P18](https://www.wikidata.org/wiki/Property:P18) ⭐ · [wbsearchentities](https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities) ⭐ · Commons API (imageinfo / extmetadata) · [Fork'tan PR açmak (GitHub Docs)](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) ⭐

## Durum

| # | Madde | Durum | Commit |
|---|---|---|---|
| 1 | Fork + clone + `wikidata-foto` dalı, Python kurulumu | ✅ | – |
| 2 | Wikidata Q kimliği + P18 | ✅ | `08326e4` |
| 3 | Lisans + fotoğrafçı (Commons API) | ✅ | `08326e4` |
| 4 | lexicon.json'a 4 alan | ✅ | `08326e4` |
| 5 | Testler + CONTRIBUTING.md | ✅ | `08326e4` |
| 6 | PR | ✅ açıldı | [PR #4](https://github.com/mustafayusufaksoy/turkce-asr-ozel-isim/pull/4) |

Commit: 3 dosya, **+45 / −5** (beklenenle birebir). PR'da "No conflicts with base branch".
Testler: yerelde **24 OK**. GitHub'da "1 workflow awaiting approval", yani hocanın onayını bekliyor (ilk kez katkı yapan kişide GitHub testleri onaysız çalıştırmıyor).

## Hocanın kararı (başlamadan önce sordum)

- Fork'ta `wikidata-foto` dalını aç, PR'ı oradan hocanın `main` dalına aç.
- **Elon ve Mark eklenmeyecek.** Sözlük, Whisper'ın Türkçe konuşmada yanlış yazdığı isimler için. Sırf fotoğraf için eklersek sözlüğün amacı karışır. Onların fotoğraf bilgisi Klip Dergi'nin kendi verisinde durur.

## 1. Fork ve kurulum 📚 GitHub Docs

| Kelime | Anlamı |
|---|---|
| **fork** | Başkasının reposunun benim hesabımdaki kopyası |
| **clone** | Repoyu bilgisayarıma indirmek |
| **base** | PR'ın gideceği yer → `mustafayusufaksoy/…:main` |
| **head** | PR'ın geldiği yer → `symkllci/…:wikidata-foto` |

- Python bilgisayarımda yoktu → python.org'dan 3.15.2 kuruldu ("Add python.exe to PATH" işaretli).
- `pip install -e .` → paketi "düzenlenebilir" kurar: kodu değiştirince yeniden kurmaya gerek yok.
- `python -m unittest discover -s tests` → başlangıçta **22 test OK**.

## 2. Wikidata: Q kimliği ve P18 📚 wbsearchentities + P18

Önce **Hamdi'yi elle** tarayıcıda yaptım, sonra 8 kişi için betik:

1. **Ara:** `wbsearchentities` (language=tr) → Hamdi: tek sonuç **Q12071778**, açıklama "Kürt asıllı Türk iş insanı" → doğru kişi ✓
2. **Kayıt:** `Special:EntityData/Q12071778.json` → `claims.P18` → **"Portrait of Hamdi Ulukaya.jpg"**
3. Birden fazla P18 varsa `preferred` (tercih edilen) olanı alınır.

📒 **NOT:** **Q** kimliği = kişinin Wikidata'daki nüfus numarası. İsim değişse de, iki kişi aynı adı taşısa da Q değişmez. **P18** = "resim" özelliği; Wikidata'da insanların "bu kişinin fotoğrafı budur" diye doğruladığı resim. "Pe on sekiz" diye okunur.

`\u00fc` gibi yazılar: JSON'da Türkçe harfler kaçış koduyla yazılabiliyor (`\u00fc` = ü).

## 3. Commons: lisans ve fotoğrafçı

`prop=imageinfo&iiprop=extmetadata` → üç alan:

| Alan | Ne | Örnek (Hamdi) |
|---|---|---|
| `LicenseShortName` | Lisans | CC BY-SA 3.0 |
| `Artist` | Fotoğrafçı | Michael Gonda |
| `Attribution` | Atıf satırı (bazen farklı) | Chobani |

`image_author`'a **Artist** yazıldı. Attribution farkı hocaya soruldu (PR'da).

**Betikler** (Masaüstü'nde, repoda değil, plan betik istemiyor):
- `wikidata_foto.py`: ara → P18 → Commons → `wikidata_sonuc.json`
- `sozluge_ekle.py`: sonucu lexicon.json'a yazar, dosyanın biçimini bozmadan (`indent=1`, Türkçe harf kaçışsız, sonda satır sonu yok)

## 4. Sonuç: 8 kişi

| Kişi | wikidata | Fotoğraf (P18) |
|---|---|---|
| Hamdi Ulukaya | Q12071778 | Portrait of Hamdi Ulukaya.jpg · CC BY-SA 3.0 · Michael Gonda |
| Acun Ilıcalı | Q328247 | AcunIlıcalı.jpg · CC BY-SA 3.0 · Serkan Yakın |
| Abdullah Kiğılı | Q4666021 | Abdullah Kiğılı.jpg · CC BY-SA 3.0 · Serkan Yakın |
| Nevzat Aydın | Q27652274 | P18 yok |
| Mustafa Namoğlu | kayıt yok | – |
| Aykut Karaalioğlu | kayıt yok | – |
| Efe Çelebi | kayıt yok | – |
| Mehmet Dinçerler | kayıt yok | – |

- **3 kişiye fotoğraf**, **5 kişide P18 yok**.
- Doğrulama: kaydı olmayan 4 kişinin sözlükteki `source` alanında da yalnız `youtube-title` var → tutarlı ✓
- **"Boş bırak" = alanı hiç yazmamak** (`company` gibi). `""` yazmadım.
- Abdullah'ın P18'i Klip Dergi'deki fotoğrafla **aynı** dosya. Hamdi ve Acun'unki **farklı**.

## 5. Testler: kırmızı → yeşil

**Tahmin:** Yeni alanları ekleyince testler geçer mi? → Hayır, **4 FAIL** (Abdullah, Acun, Hamdi, Nevzat).
**Neden:** `test_fields_and_values` izin verilen alanları `FIELDS` listesiyle kontrol ediyor; yeni alanlar listede yoktu.

Değişiklikler (`tests/test_lexicon.py`):

```python
FIELDS = {"name", "type", "company", "misspellings", "context_required", "source",
          "wikidata", "image", "image_license", "image_author"}
WIKIDATA_ID = re.compile(r"^Q[1-9][0-9]*$")  # "Q" + rakam, ör. Q12071778
```

- `test_wikidata_is_q_and_digits`: wikidata varsa Q ile başlamalı, sonra rakam.
- `test_image_has_license_and_author`: image varsa lisans, fotoğrafçı ve wikidata da olmalı. Image yoksa lisans/fotoğrafçı tek başına yazılmaz.
- Sonuç: **24 OK** (22 + 2 yeni).
- **Ters deneme:** Q'yu silince ve fotoğrafçıyı silince testler kırmızı oldu → testler gerçekten yakalıyor ✓

📒 **NOT:** `subTest` = her kişiyi ayrı alt test olarak çalıştırır. Biri kırmızı olunca hangi kişi olduğunu söyler, diğerlerini de denemeye devam eder. Sınıfta yoklamada bir öğrenci yoksa yoklamayı bırakmayıp devam etmek gibi.

CONTRIBUTING.md: alan tablosuna 4 satır + "neden dosya yok / neden sadece P18 / Commons API" paragrafı.

## Takıldığım yerler

- **Python bulunamadı:** kurulu değildi → python.org.
- **`No such file`:** `wikidata_foto.py` kaydedilmemişti → `code C:\Users\seyma\Desktop\wikidata_foto.py` ile açıp Ctrl+S.
- **HTTP 429 Too Many Requests:** çok hızlı istek → her istekten sonra 1 sn bekleme + `Retry-After` kadar bekleyip yeniden deneme.
- **+47/−7 yerine +45/−5:** dosya sonunda satır sonu yoktu (`\ No newline at end of file`). VS Code kaydederken son Enter'ı siliyordu → `Add-Content -Path CONTRIBUTING.md, tests\test_lexicon.py -Value ""` ile düzeldi.
- **Ders:** `git diff --stat` ile commit'ten önce satır sayısını beklenenle karşılaştırmak hatayı yakaladı.

**Kelimeler:** fork · clone · base / head · Q kimliği · P18 · wbsearchentities · extmetadata · CC0 / CC BY-SA · 429 · Retry-After · editable install (`-e`) · subTest · regex · newline (satır sonu) · workflow approval.


## Kaldığım yer

Cuma bitti (PR açık, testler hocanın onayını bekliyor). Sıradaki: **Cumartesi planı** (ornek-api.json, Zod şeması, hafta5 → main PR).