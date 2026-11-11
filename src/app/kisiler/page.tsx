import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { Lora } from "next/font/google"; // Ana sayfadaki serif başlık fontu (dergi hissi).
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.
import KlipKarti from "@/components/KlipKarti"; // Ortak kart bileşeni, ana sayfayla aynı

// Başlık fontu: ana sayfadakiyle aynı Lora. latin-ext: Türkçe harfler (ş, ğ, ı, İ) için.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// Renkler (ana sayfayla aynı): krem zemin amber-50 · koyu mürekkep stone-900 · bordo vurgu rose-800

// Filtre düğmelerinin ortak görünüşü: kartlardaki konu etiketiyle aynı dil (yuvarlak, BÜYÜK HARF, aralıklı)
const dugmeTemel = "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors";
// Seçili düğme: kart etiketi gibi bordo zemin, beyaz yazı
const dugmeSecili = "border-rose-800 bg-rose-800 text-white";
// Seçili olmayan: beyaz zemin, gri çerçeve; üstüne gelince bordo
const dugmeNormal = "border-stone-300 bg-white text-stone-600 hover:border-rose-800 hover:text-rose-800";

// Kişiler sayfası. searchParams: adresteki ? sonrası bilgiler.
// Örnek: /kisiler?konu=yatırım&ara=ata → { konu: "yatırım", ara: "ata" }
// params gibi o da bir Promise (kargo), o yüzden async ve await.
export default async function KisilerSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ konu?: string | string[]; ara?: string | string[] }>;
}) {
  const { konu, ara } = await searchParams; // Adreste ?konu= ve ?ara= varsa değerlerini al.
  // İkisi de bazen liste olabilir (?konu=a&konu=b). Biz sadece tek yazıyı kabul ediyoruz.
  const seciliKonu = typeof konu === "string" ? konu : undefined;
  // trim: baştaki ve sondaki boşlukları sil ("  nevzat " → "nevzat")
  const aramaMetni = typeof ara === "string" ? ara.trim() : "";

  const tumKisiler = getAllPeople(); // Bütün kişiler (şu an 12).

  // Konu listesini kliplerden çıkar, elle yazma.
  // Her kişinin her klibine bak; konusu listede yoksa (includes = içeriyor mu?) ekle.
  const konular: string[] = [];
  for (const kisi of tumKisiler) {
    for (const klip of kisi.clips) {
      if (!konular.includes(klip.topic)) {
        konular.push(klip.topic);
      }
    }
  }

  // 1. süzgeç: seçili konu varsa sadece o konuda klibi olan kişiler, yoksa hepsi.
  // filter: şarta uyan BÜTÜN elemanları getirir. some: kliplerden en az biri uyuyor mu?
  const konuyaGore = seciliKonu
    ? tumKisiler.filter((kisi) => kisi.clips.some((klip) => klip.topic === seciliKonu))
    : tumKisiler;

  // 2. süzgeç: arama metni varsa adında bu metin geçen kişiler, yoksa hepsi.
  // toLocaleLowerCase("tr-TR"): Türkçe kurallarıyla küçük harfe çevir (toLowerCase'in Türkçe bilen hali).
  // Hem kişinin adını hem aranan yazıyı küçültüyoruz: "NEVZAT", "Nevzat", "nevzat" hepsi aynı sonucu verir.
  // includes: yazının İÇİNDE bu parça geçiyor mu? "nevzat aydın".includes("zat") → true
  const aramaKucuk = aramaMetni.toLocaleLowerCase("tr-TR");
   // Kelime adında, ya da kliplerinden birinin konusunda/başlığında geçiyor mu? (|| = "ya da")
  const kisiler = aramaMetni
    ? konuyaGore.filter((kisi) => {
        const adindaVar = kisi.name.toLocaleLowerCase("tr-TR").includes(aramaKucuk);
        // some: kliplerden EN AZ BİRİNİN konusu ya da başlığı uyuyorsa true
        const klibindeVar = kisi.clips.some(
          (klip) =>
            klip.topic.toLocaleLowerCase("tr-TR").includes(aramaKucuk) ||
            klip.title.toLocaleLowerCase("tr-TR").includes(aramaKucuk)
        );
        return adindaVar || klibindeVar; // Biri bile doğruysa kişi listede kalır
      })
    : konuyaGore;

  return (
    // Bütün sayfa: ana sayfayla aynı krem zemin (amber-50) ve koyu mürekkep yazı (stone-900)
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* Ana sayfayla aynı genişlik ve boşluklar */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Geri dönüş linki: ana sayfaya götürür. Üstüne gelince bordo */}
        <Link href="/" className="text-sm text-stone-500 hover:text-rose-800">
          ← Ana sayfa
        </Link>

        {/* Başlık bölümü: ana sayfadaki logo gibi altında kalın çizgi */}
        <header className="mt-4 border-b-2 border-stone-900 pb-4">
          {/* Lora başlık: ana sayfadaki "Diğer hikâyeler" ile aynı font */}
          <h1 className={`${baslikFontu.className} text-4xl font-bold sm:text-5xl`}>Kişiler</h1>
          {/* Açıklama: sıcak gri (stone) */}
          <p className="mt-2 text-stone-600">
            Podcast kliplerinde konuşan girişimcilerin biyografileri, sosyal medya hesapları ve viral klipleri.
          </p>
        </header>

        {/* Arama kutusu */}
        {/* form action="/kisiler": Ara'ya basınca /kisiler?ara=... adresine gider */}
        {/* name="ara": kutuya yazılan, adreste ara= olarak görünür */}
        {/* defaultValue: sayfa yenilense de yazılan kutuda kalır */}
        <form action="/kisiler" className="mt-6 mb-4 flex gap-2">
          <input
            type="search"
            name="ara"
            defaultValue={aramaMetni}
            placeholder="İsme göre ara (ör. nevzat)"
            // focus: kutuya tıklayınca çerçeve bordo olsun (outline-none: tarayıcının mavi çerçevesini kapat)
            className="w-full max-w-sm rounded-full border border-stone-300 bg-white px-4 py-2 text-sm focus:border-rose-800 focus:outline-none"
          />
          {/* Konu seçiliyse aramada kaybolmasın diye gizli olarak forma ekle */}
          {seciliKonu && <input type="hidden" name="konu" value={seciliKonu} />}
          {/* Ara düğmesi: bordo vurgu rengi */}
          <button
            type="submit"
            className="rounded-full bg-rose-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-900"
          >
            Ara
          </button>
        </form>

        {/* Konu düğmeleri: "Tümü" ve kliplerden çıkan her konu */}
        {/* flex-wrap: sığmayan düğmeler alt satıra geçsin (telefonda taşmasın) */}
        <div className="mb-4 flex flex-wrap gap-2">
          {/* Tümü: konu filtresini kaldırır. Arama varsa onu korur. */}
          <Link
            href={{ pathname: "/kisiler", query: aramaMetni ? { ara: aramaMetni } : {} }}
            className={`${dugmeTemel} ${!seciliKonu ? dugmeSecili : dugmeNormal}`}
          >
            Tümü
          </Link>

          {konular.map((k) => (
            // href'i nesne olarak veriyoruz: Next.js boşluk ve Türkçe harfleri adrese kendisi uygun yazar.
            // Arama varsa konuya tıklayınca kaybolmasın diye onu da ekliyoruz.
            <Link
              key={k}
              href={{ pathname: "/kisiler", query: aramaMetni ? { konu: k, ara: aramaMetni } : { konu: k } }}
              className={`${dugmeTemel} ${seciliKonu === k ? dugmeSecili : dugmeNormal}`}
            >
              {k}
            </Link>
          ))}
        </div>

        {/* Kaç kişi gösteriliyor */}
        <p className="mb-6 text-sm text-stone-500">
          {kisiler.length} kişi
          {seciliKonu && ` · konu: "${seciliKonu}"`}
          {aramaMetni && ` · arama: "${aramaMetni}"`}
        </p>

        {/* Hiç sonuç yoksa bilgi ver */}
        {kisiler.length === 0 && (
          <p className="text-stone-600">
            Sonuç bulunamadı.{" "}
            <Link href="/kisiler" className="text-rose-800 hover:underline">
              Filtreleri temizle
            </Link>
          </p>
        )}

        {/* Kartlar: ana sayfayla aynı KlipKarti. Telefonda 1, orta ekranda 2, geniş ekranda 4 yan yana */}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {kisiler.map((kisi) => {
            // Konu seçiliyse o konudaki ilk klibi göster (find), bulamazsa (??) kişinin ilk klibini
            const klip = kisi.clips.find((c) => c.topic === seciliKonu) ?? kisi.clips[0];
            return (
              <li key={kisi.slug}>
                <KlipKarti kisi={kisi} klip={klip} />
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}