# Gün 16 · 12 Kasım Perşembe · Ses sağlayıcı karşılaştırması

Çalıştığım gün: 13 Kasım.

## Özet

- Biyografileri yapay zekâ sesiyle okutmak için 4 sağlayıcıyı aynı paragrafla karşılaştırdım.
- **Önerim: Google Chirp 3: HD.** Telaffuzu ve doğallığı en iyi, 12 biyografi ücretsiz kotada.
- **Yedek: ElevenLabs.** Kelime zamanı veriyor, kartsız denenebiliyor.
- Hiçbir yere kart girmedim, ses klonlama kullanmadım, API anahtarı almadım.

## Deneme paragrafı (262 karakter)

> Hamdi Ulukaya, Chobani'nin temelini 2005 yılında kapanmış bir yoğurt fabrikasını satın alarak attı. Acun Ilıcalı muhabirlikten başlayıp TV8'i satın alacak kadar büyüdü. Abdullah Kiğılı ve Dinçerler Group'un CEO'su Mehmet Dinçerler de hikâyeleriyle Klip Dergi'de.

- Zor kelimeler: Ulukaya, Ilıcalı, Kiğılı, Dinçerler, 2005, TV8, CEO.
- 12 biyografinin toplamı: **2.958 karakter** (yaklaşık 3 dakika ses).

## Dinleme sonuçları

| | ElevenLabs | OpenAI | Google | Azure |
|---|---|---|---|---|
| **Model / ses** | Multilingual v2 · kütüphane sesi | gpt-4o-mini-tts · Marin | Chirp 3: HD · Achernar | Denenemedi |
| **Nasıl denendi** | Ücretsiz hesap (kart yok) | openai.fm demosu | Ürün sayfası demosu | Hesap ve kart gerekiyor |
| **Telaffuz** | 3/5 · Ilıcalı → "İlıcalı", CEO → "ceosu" | 4/5 · Ilıcalı → "Ilıkalı" | **5/5** | – |
| **Doğallık** | – | Çok doğal | **5/5** | – |
| **Kelime zamanı** | ✅ Zaman damgalı uç | ❌ Yok (Whisper ile hizalama) | ⚠️ SSML `<mark>`; Chirp 3 HD'de doğrulanmalı | ✅ WordBoundary |

## Fiyat (13 Kasım 2026, resmî sayfalar, vergiler hariç)

| | ElevenLabs | OpenAI | Google | Azure |
|---|---|---|---|---|
| **Ücretsiz** | Ayda 10.000 kredi (ticari değil) | Yok | Ayda 1 milyon karakter | Ayda 0,5 milyon karakter |
| **Karakter başına** | ≈ 0,0002 $ (Starter: 6 $ / 30.000) | Token bazlı: 0,60 $ metin / 12 $ ses (1M token) | 0,00003 $ (30 $ / 1M) | 0,000015 $ (15 $ / 1M) |
| **12 profil** | Free'de 0 $ ama ticari değil · Starter 6 $/ay | API'siz kesin değil | **0 $** (kotasız ≈ 0,09 $) | **0 $** (kotasız ≈ 0,04 $) |
| **Ticari kullanım** | Free ❌ · Starter ✅ | Ücretli API | Fatura hesabı gerekli | Azure hesabı gerekli |
| **Kart** | Free'de yok | Var | Var ("You must enable billing") | Var |
| **Dikkat** | Yayında ElevenLabs'in kendi sesi seçilmeli | Model **Deprecated** (kaldırılıyor) | Ana sayfa ile fiyat sayfası çelişiyor; fiyat sayfası esas | – |

## Önerim

1. **Google Chirp 3: HD.** Koşulları: fatura hesabı açılmalı ve kelime zamanının (`<mark>`) bu seste çalıştığı doğrulanmalı. Çalışmazsa Google'ın WaveNet/Neural2 sesleri ya da ElevenLabs.
2. **Yedek: ElevenLabs.** 2 telaffuz hatası Cuma günü telaffuz sözlüğüyle düzeltilebilir. Yayın için Starter (6 $/ay) gerekebilir.
3. **OpenAI önerilmez.** Sesi doğal, ama model kaldırılıyor yazıyor  ve kelime zamanı vermiyor.



## Örnek sesler

Drive'da: (Google demosunda indirme yok, ekran kaydı). Azure yok.

## Kaynaklar

- ElevenLabs: https://elevenlabs.io/pricing
- OpenAI: https://developers.openai.com/api/docs/models/gpt-4o-mini-tts · demo: https://www.openai.fm
- Google: https://cloud.google.com/text-to-speech/pricing · kelime zamanı: https://docs.cloud.google.com/text-to-speech/docs/reference/rest/v1beta1/text/synthesize
- Azure: https://azure.microsoft.com/tr-tr/pricing/details/cognitive-services/speech-services/ · ses galerisi: https://speech.microsoft.com/portal/voicegallery
- Ses çalma (Cumartesi): https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
