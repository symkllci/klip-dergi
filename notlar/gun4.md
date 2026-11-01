# Gün 4 – Birleştirme ve küçük düzeltmeler

## Ne yaptım
- **hafta1 → main pull request'ini açtım (PR #1).** Başlık: "Kişi listesi, dinamik kişi sayfaları ve Instagram embed desteği ekle". Açıklamaya üç günün kısa özetini yazdım. Hocam inceleyip birleştirdi.
- **hafta2 dalını açtım** ve GitHub'a gönderdim. Hocam henüz birleştirmediği için önce hafta1'den açtım, birleşince main'i hafta2'ye aldım.
- **Yeni sekmede açılan iki linke `rel="noopener noreferrer"` ekledim:** sosyal medya linki ve klip linki.
- **Klip linkinin yazısını platforma göre yaptım.** `izleYazisi` adında bir tarif ekledim: YouTube ise "Klibi YouTube'da izle", değilse "Klibi Instagram'da izle" yazıyor.
- **Beş biyografiyi geniş zamana çektim** ("kurucusudur", "mezunudur", "yatırım yapmaktadır"). Hepsini kendi cümlelerimle yeniden yazdım, 3–4 cümle.
- "Genç Ekiplerin Gücür" yazım hatasını "Genç Ekiplerin Gücü" olarak düzelttim.

## Öğrendiklerim

### Pull request (PR)
- PR, bir dalı diğerine birleştirme isteği. Müsvedde defteri (hafta1) temiz deftere (main) geçirmeden önce hocama "bakar mısınız?" demek gibi.
- **base: main ← compare: hafta1**: base, içine eklenecek dal (kahve fincanı). compare, eklenecek dal (süt).
- "Able to merge" = iki dal sorunsuz birleşebilir, çakışma yok.
- Reviewer = PR'ı inceleyecek kişi. Repoya erişimi olmayan biri reviewer olarak eklenemiyor, collaborator davetinin kabul edilmesi gerekiyor.
- Merge düğmesine ben basmıyorum, birleştirme hocamın işi.

### Dallar (branch)
- Yeni dal, açıldığı dalın o anki fotokopisi olarak başlar. main'den açsaydım 1. haftanın işleri olmazdı. hafta1'den açtığım için hepsi hafta2'de var.
- `git checkout -b hafta2`: hafta2 adında yeni dal aç ve ona geç.
- `git log --oneline -3`: son 3 commit'i gösterir. `HEAD -> hafta2, hafta1` yazısı iki dalın aynı yerde olduğunu gösteriyor.
- `git push -u origin hafta2`: dalı ilk kez GitHub'a gönder. `-u` sayesinde sonra sadece `git push` yetiyor.
- `git pull`: GitHub'daki son hali bilgisayarıma çek (push'un tersi).
- `git merge main --no-edit`: main'deki değişiklikleri bulunduğum dala ekle. `--no-edit` mesaj ekranı açılmasın diye.

### rel="noopener noreferrer"
- `target="_blank"` linki yeni sekmede açar. Açılan sayfa normalde bizim sekmemize uzanabilir ve kötü niyetliyse sayfamızı sahte bir sayfayla değiştirebilir.
- `rel="noopener noreferrer"` bu yolu kapatır. Benzetme: misafiri yolcularken arkasından kapıyı kilitlemek.
- `rel`, `href`, `target` ve `className` gibi bir özellik, aynı `<a>` etiketinin içine yazılıyor.
- Kural: `target="_blank"` olan her linke eklenir.

### izleYazisi tarifi
- embedAdresi ile aynı kalıp: bir klip alıyor, platformuna bakıyor, bir yazı geri veriyor.
- `klip: Clip` → tarife bir klip veriliyor. `: string` → tarif bir yazı geri veriyor.
- `return` tarifi bitirir. YouTube ise ilk return'de çıkar, alt satıra gelmez.
- Ekrana yazdırırken `{izleYazisi(klip)}`: süslü parantez "düz yazma, tarifin sonucunu yaz" demek.

### Biyografilerde geniş zaman
- "kurdu" → "kurucusudur", "okudu" → "mezunudur", "başladı" → "başlamıştır", "yatırım yapıyor" → "yatırım yapmaktadır".
- Kartta bio'nun ilk cümlesi göründüğü için ilk cümle kişinin kim olduğunu söylemeli.
- Bilgiyi doğrulamadan yazmıyorum. Mustafa Namoğlu'nun 2011'de kurduğu marka Mugo; ikas sonraki şirketi.

## Tahmin ve sonuç
- **Tahmin:** `rel` ekleyince linklerin görünüşü değişir mi? **Sonuç:** Hiçbir şey değişmedi. Linkler aynı görünüyor ve aynı yere gidiyor, görünmeyen bir güvenlik kilidi.
- **Tahmin:** izleYazisi tarifini yazınca sayfa değişir mi? **Sonuç:** Tarifi yazmak tek başına bir şey değiştirmedi. Ancak sabit yazının yerine `{izleYazisi(klip)}` koyunca kullanılmaya başladı. Bütün klipler Instagram olduğu için ekranda yine "Klibi Instagram'da izle" yazıyor.

## Nerede takıldım, nasıl çözdüm
- Önce yanlış dosyayı açtım: `kisiler/page.tsx` yerine `kisiler/[slug]/page.tsx` açmam gerekiyordu. İki dosyanın adı aynı, klasöre bakarak ayırt ediyorum.
- `rel="..."className` bitişik yazdım, araya boşluk gerekiyordu.
- izleYazisi'nde `return` satırlarına adres yazdım (`klip.url`, `embed`). Bu tarifin işi ekranda görünecek yazıyı vermek, adres değil.
- `npm` yerine `nmp` yazdım, "not recognized" hatası aldım.
- Biyografileri önce çok uzun (8 cümle) ve doğrulanmamış bilgilerle yazdım. Sonra 3–4 cümleye indirdim, sadece doğrulanmış bilgileri bıraktım.
- Hocam PR'ı birleştirene kadar hafta2'yi nereden açacağımı bilemedim. hafta1'den açmanın güvenli olduğunu öğrendim.

## Claude'un yazdığından neyi değiştirdim
- PR açıklamasını notlarımdan Claude ile birlikte çıkardık, okuyup gönderdim.
- `rel`'i kendim ekledim.
- izleYazisi'nin boşluklarını doldurmaya çalıştım (Clip, string, platform doğruydu). `return` kısmında takılınca Claude tamamladı, ben satır satır açıklamasını yaptım.
- Dosyanın son halini açıklama satırlarıyla Claude düzenledi, ben kontrol edip kaydettim.
- Biyografileri kendi cümlelerimle yazdım. Claude zaman, yazım ve yanlış bilgi hatalarını gösterdi (Mugo, İliç, ikas küçük harf).

## JS boşluğu
- `return` tarifi nasıl bitiriyor, `if` ile birlikte nasıl çalışıyor, daha çok örnekle görmem lazım.
- `{ }` içine ne zaman bir değer, ne zaman bir tarif çağrısı yazılıyor, karıştırıyorum.

## Sorularım
- `npm run dev` çalışırken Next.js 16.4.0'da güvenlik açığı olduğu ve 16.4.3'e güncelleme önerildiği uyarısı çıktı. Şimdilik "Skip" dedim. Güncelleyelim mi?