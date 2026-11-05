import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.

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

  const tumKisiler = getAllPeople(); // 5 kişinin hepsi.

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
  const kisiler = aramaMetni
    ? konuyaGore.filter((kisi) => kisi.name.toLocaleLowerCase("tr-TR").includes(aramaKucuk))
    : konuyaGore;

  return (
    // mx-auto max-w-5xl: sayfayı ortala ve genişliği sınırla. p-6: kenarlardan boşluk.
    <main className="mx-auto max-w-5xl p-6">
      {/* Geri dönüş linki: ana sayfaya götürür. */}
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Ana sayfa
      </Link>

      {/* Başlık */}
      <h1 className="text-3xl font-bold mt-4 mb-2">Kişiler</h1>

      {/* Açıklama: gri yazı */}
      <p className="text-gray-600 mb-6">
        Podcast kliplerinde konuşan girişimcilerin biyografileri, sosyal medya hesapları ve viral klipleri.
      </p>

      {/* Arama kutusu */}
      {/* form action="/kisiler": Ara'ya basınca /kisiler?ara=... adresine gider */}
      {/* name="ara": kutuya yazılan, adreste ara= olarak görünür */}
      {/* defaultValue: sayfa yenilense de yazılan kutuda kalır */}
      <form action="/kisiler" className="mb-4 flex gap-2">
        <input
          type="search"
          name="ara"
          defaultValue={aramaMetni}
          placeholder="İsme göre ara (ör. nevzat)"
          className="w-full max-w-sm rounded-lg border border-stone-300 px-4 py-2 text-sm"
        />
        {/* Konu seçiliyse aramada kaybolmasın diye gizli olarak forma ekle */}
        {seciliKonu && <input type="hidden" name="konu" value={seciliKonu} />}
        <button type="submit" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700">
          Ara
        </button>
      </form>

      {/* Konu düğmeleri: "Tümü" ve kliplerden çıkan her konu */}
      {/* flex-wrap: sığmayan düğmeler alt satıra geçsin (telefonda taşmasın) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Tümü: konu filtresini kaldırır. Arama varsa onu korur. */}
        <Link
          href={{ pathname: "/kisiler", query: aramaMetni ? { ara: aramaMetni } : {} }}
          className={`rounded-full border px-4 py-1 text-sm ${
            !seciliKonu ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 hover:border-stone-900"
          }`}
        >
          Tümü
        </Link>

        {konular.map((k) => (
          // href'i nesne olarak veriyoruz: Next.js boşluk ve Türkçe harfleri adrese kendisi uygun yazar.
          // Arama varsa konuya tıklayınca kaybolmasın diye onu da ekliyoruz.
          <Link
            key={k}
            href={{ pathname: "/kisiler", query: aramaMetni ? { konu: k, ara: aramaMetni } : { konu: k } }}
            className={`rounded-full border px-4 py-1 text-sm ${
              seciliKonu === k ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 hover:border-stone-900"
            }`}
          >
            {k}
          </Link>
        ))}
      </div>

      {/* Kaç kişi gösteriliyor */}
      <p className="text-sm text-gray-500 mb-6">
        {kisiler.length} kişi
        {seciliKonu && ` · konu: "${seciliKonu}"`}
        {aramaMetni && ` · arama: "${aramaMetni}"`}
      </p>

      {/* Hiç sonuç yoksa bilgi ver */}
      {kisiler.length === 0 && (
        <p className="text-gray-600">
          Sonuç bulunamadı.{" "}
          <Link href="/kisiler" className="text-rose-800 hover:underline">
            Filtreleri temizle
          </Link>
        </p>
      )}

      {/* Kartlar: telefonda alt alta, orta ekranda 2, geniş ekranda 3 kart yan yana */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kisiler.map((kisi) => (
          <li key={kisi.slug} className="rounded-lg border p-4 hover:shadow-md">
            {/* Kartın başlığı: kişinin adı, tıklayınca kişinin sayfasına gider */}
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/kisiler/${kisi.slug}`} className="hover:underline">
                {kisi.name}
              </Link>
            </h2>

            {/* Kısa bio: ilk cümle */}
            <p className="text-gray-700 mb-3">{kisi.bio.split(". ")[0]}.</p>

            {/* Klip sayısı */}
            <p className="text-sm text-gray-500">{kisi.clips.length} klip</p>
          </li>
        ))}
      </ul>
    </main>
  );
}