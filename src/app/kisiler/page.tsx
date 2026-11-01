import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { getAllPeople } from "@/lib/people"; // Dün yazdığım tarifi bu dosyaya getir.

export default function KisilerSayfasi() { // Bu dosyanın sayfası bu bileşen.
  const kisiler = getAllPeople(); // Tarifi çalıştır, 5 kişiyi kisiler adıyla sakla.

  return ( // Ekrana bunları ver.
    // mx-auto max-w-5xl: sayfayı ortala ve genişliği sınırla. p-6: kenarlardan boşluk.
    <main className="mx-auto max-w-5xl p-6">
      {/* Geri dönüş linki: ana sayfaya götürür. Kişi sayfasındaki "← Tüm kişiler" ile aynı görünüm. */}
      {/* href="/": ana sayfanın adresi. Küçük, gri; fare gelince altı çizilir. */}
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Ana sayfa
      </Link>

      {/* Başlık: büyük (text-3xl), kalın (font-bold). mt-4: linkten biraz aşağıda dursun, mb-2: altında küçük boşluk */}
      <h1 className="text-3xl font-bold mt-4 mb-2">Kişiler</h1>

      {/* Açıklama: gri yazı */}
      <p className="text-gray-600 mb-1">
        Podcast kliplerinde konuşan girişimcilerin biyografileri, sosyal medya hesapları ve viral klipleri.
      </p>

      {/* Listede kaç kişi var: küçük gri yazı, altında büyük boşluk (mb-6) */}
      <p className="text-sm text-gray-500 mb-6">Toplam {kisiler.length} kişi</p>

      {/* Kartlar: ızgara (grid), aralarında boşluk (gap-4) */}
      {/* Telefonda alt alta, orta ekranda 2, geniş ekranda 3 kart yan yana */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* map: her kişiyi sırayla al, adına kisi de */}
        {kisiler.map((kisi) => (
          // Kart: yuvarlak köşe, çerçeve, içeriden boşluk. Fare üstüne gelince hafif gölge.
          <li key={kisi.slug} className="rounded-lg border p-4 hover:shadow-md">
            {/* Kartın başlığı: kişinin adı, tıklayınca kişinin sayfasına gider */}
            {/* Adres: sabit /kisiler/ + değişen slug, ör. /kisiler/nevzat-aydin */}
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/kisiler/${kisi.slug}`} className="hover:underline">
                {kisi.name}
              </Link>
            </h2>

            {/* Kısa bio: bio'yu ". " gördüğün yerden kes, ilk cümleyi al. */}
            {/* split noktayı attığı için sonuna elle "." ekledim. */}
            <p className="text-gray-700 mb-3">{kisi.bio.split(". ")[0]}.</p>

            {/* Klip sayısı: küçük gri yazı */}
            <p className="text-sm text-gray-500">{kisi.clips.length} klip</p>
          </li>
        ))}
      </ul>
    </main>
  );
}