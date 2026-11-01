import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { getAllPeople } from "@/lib/people"; // Bütün kişileri getiren tarif.

// Kişiler sayfası. searchParams: adresteki ? sonrası bilgiler (ör. /kisiler?konu=yatırım).
// params gibi o da bir Promise (kargo), o yüzden async ve await.
export default async function KisilerSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ konu?: string | string[] }>;
}) {
  const { konu } = await searchParams; // Adreste ?konu= varsa değerini al.
  // konu bazen liste olabilir (?konu=a&konu=b). Biz sadece tek yazıyı kabul ediyoruz.
  const seciliKonu = typeof konu === "string" ? konu : undefined;

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

  // Seçili konu varsa sadece o konuda klibi olan kişileri göster, yoksa hepsini.
  // filter: şarta uyan BÜTÜN elemanları getirir (find sadece ilkini getiriyordu).
  // some: kişinin kliplerinden en az biri şarta uyuyor mu?
  const kisiler = seciliKonu
    ? tumKisiler.filter((kisi) => kisi.clips.some((klip) => klip.topic === seciliKonu))
    : tumKisiler;

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

      {/* Konu düğmeleri: "Tümü" ve kliplerden çıkan her konu */}
      {/* flex-wrap: sığmayan düğmeler alt satıra geçsin (telefonda taşmasın) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Tümü: filtreyi kaldırır, adres /kisiler olur. Konu seçili değilse koyu görünür. */}
        <Link
          href="/kisiler"
          className={`rounded-full border px-4 py-1 text-sm ${
            !seciliKonu ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 hover:border-stone-900"
          }`}
        >
          Tümü
        </Link>

        {konular.map((k) => (
          // href'i nesne olarak veriyoruz: Next.js boşluk ve Türkçe harfleri adrese kendisi uygun yazar.
          // Seçili konu koyu, diğerleri çerçeveli.
          <Link
            key={k}
            href={{ pathname: "/kisiler", query: { konu: k } }}
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
        {seciliKonu ? `"${seciliKonu}" konusunda ${kisiler.length} kişi` : `Toplam ${kisiler.length} kişi`}
      </p>

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