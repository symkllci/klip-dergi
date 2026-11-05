# Gün 2 – Veri modeli ve 5 kişi (15 Ekim 2026, Perşembe)

## Ne yaptım
- src/data/people.json: 5 kişinin verisini types.ts'deki Person kalıbına göre girdim.
  - Nevzat Aydın, Hamdi Ulukaya, Adnan Şahin, Ata Uzunhasan, Mustafa Namoğlu
  - Her kişi için slug, ad, biyografi (3-5 cümle), sosyal medya linkleri ve 2 klip
  - Klip linklerindeki takip kodlarını (? ve sonrası) temizledim, konuları 1-2 kelimelik etiketlere çevirdim
- src/lib/people.ts: Veriyi getiren iki fonksiyon yazdım:
  - getAllPeople: tüm kişileri getirir (/kisiler sayfası kullanacak)
  - getPersonBySlug: slug ile tek bir kişiyi bulur (/kisiler/ata-uzunhasan gibi kişi sayfası kullanacak)
- Gün 1 notuma eksikleri ekledim.

## Öğrendiğim kavramlar

### JSON
- JSON, bilgiyi bilgisayarın okuyabileceği düzende yazma biçimi. types.ts boş form, people.json doldurulmuş formlar.
- `"etiket": "değer"` → tek bilgi. Etiket ile değer arasında her zaman iki nokta (:) var.
- `{ }` süslü parantez → bir şeyin etiketli bilgileri (bir kişi, bir klip). Kimlik kartı gibi.
- `[ ]` köşeli parantez → birden fazla şeyin listesi (linkler, klipler, kişiler). Sıra gibi, etiket yok.
- Parantezler koli gibi: bir grubun nerede başlayıp nerede bittiğini gösterir. Her açılan parantez bir yerde kapanır.
- Alanlar arasına virgül konur, son alandan sonra virgül olmaz.
- Bir kutuda aynı etiket iki kere olamaz; bütün klipler tek "clips" listesinde durur.
- Bilgi yoksa boş liste: Adnan Şahin'in sosyal medyası yok → `"links": []`
- Tırnak içindeki boşluk değerin parçası: " instagram" ile "instagram" farklı.
- JSON'a // ile açıklama yazılamaz, dosya bozulur.

### Fonksiyonlar ve people.ts
- lib = library (kütüphane): yardımcı tarifler. Sayfalar veriye doğrudan değil, bu tariflerle ulaşır. Veri ileride veritabanından gelirse sadece bu dosya değişir.
- import = başka dosyadan getir, export = başka dosyalar kullanabilsin. @/ = src klasöründen başla.
- Fonksiyon = tarif. Bir kere yazılır, istendiği kadar kullanılır. return = teslim et.
- `(slug: string)` → tarife verilen bilgi: adı slug, türü yazı.
- `: Person[]` → tarifin ne tür bir şey getireceği. İki noktadan sonra her zaman tür yazılır.
- Person = kalıp (tür), people = gerçek veri (5 kişilik liste).
- `as Person[]` → "bunun Person listesi olduğunu garanti ediyorum" etiketi.
- `Person | undefined` → ya bir kişi ya hiçbir şey.
- find: listede şarta uyan ilk elemanı bulur, bulamazsa undefined döner.
- `===` → "eşit mi?"
- `=>` (ok fonksiyonu) → küçük isimsiz tarif, "şunu yap" diye okunur.
- `person.slug` → nokta "içindeki" demek: kişinin içindeki slug.

### Git ve terminal
- git commit --amend: push etmeden önce son commit'i düzeltir. Push'tan sonra kullanılmaz.
- "nothing to commit, working tree clean" → son commit'ten beri değişiklik yok (ya da dosyayı kaydetmedim).
- git log --oneline -5 → son 5 commit. origin/hafta1 yazan satır GitHub'daki son hal.
- git show --stat <commit> → o commit'te hangi dosyaların değiştiğini gösterir.


## Nerede takıldım, nasıl çözdüm
- **JavaScript temeli:** Fonksiyonları ilk kez görünce zorlandım. Kurs okumak yerine adım adım soru-cevapla ilerledim, sonra kendi cümlelerimle anlattım.
- **İç içe kişiler:** JSON'da her yeni kişiyi bir önceki kişinin klip listesinin içine yazmışım. Claude düzeltti. Ders: yeni kişi, önceki kişinin kutusu kapandıktan sonra virgülle eklenir.
- **JSON hataları:** "clips" ile [ arasındaki iki noktayı unuttum. Tırnakların içinde fazladan boşluk bırakmışım (" instagram"). Tek klip için `"clips": {}` yazmışım, doğrusu `"clips": [ { } ]`.
- **Kişi değişikliği:** Mehmet Dinçerler ve Acun Ilıcalı'nın sadece 1'er klibini bulabildim, plan kişi başına en az 2 klip istiyor. Yerlerine 2 klibi olan Ata Uzunhasan ve Mustafa Namoğlu'yu koydum.
- **Doğrulama:** Biyografilerde iki güvenilir kaynakta göremediğim bilgileri yazmadım (ör. Mustafa Namoğlu'nun doğum yeri ve okulu).

## Claude'un yazdığından neyi değiştirdim
- people.ts'yi Claude ile adım adım yazdım. İlk fonksiyonu kendim denedim, hatalarımı düzelttim. Açıklama yorumlarını ekledim.

## Dosyalar
- src/data/people.json: 5 kişinin verisi. types.ts'deki Person kalıbına göre doldurdum.
- src/lib/people.ts: Veriyi getiren iki fonksiyon. Sayfalar kişilere bunlarla ulaşacak.
- notlar/gun2.md: Bu not.

## Yarın ilk iş
- /kisiler sayfası: kişi kartlarının listesi
- /kisiler/[slug] sayfası: her kişinin kendi sayfası, klipler embed olarak