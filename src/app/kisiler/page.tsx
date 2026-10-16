import { getAllPeople } from "@/lib/people"; // Dün yazdığım tarifi bu dosyaya getir.

export default function KisilerSayfasi() { // Bu dosyanın sayfası bu bileşen.
  const kisiler = getAllPeople(); // Tarifi çalıştır, 5 kişiyi kisiler adıyla sakla.

  return ( // Ekrana bunları ver.
    <main>
      <h1>Kişiler</h1>
      <p>Podcast kliplerinde konuşan girişimcilerin biyografileri, sosyal medya hesapları ve viral klipleri.</p>

      {/* Listede kaç kişi var: 5 */}
      <p>Toplam {kisiler.length} kişi</p>

      {/* Kişilerin listesi: her kişi bir kart */}
      <ul>
        {/* map: her kişiyi sırayla al, adına kisi de */}
        {kisiler.map((kisi) => (
          // key: her kartın kimliği (slug)
          <li key={kisi.slug}>
            {/* Kartın başlığı: kişinin adı */}
            <h2>{kisi.name}</h2>

            {/* Kısa bio: bio'yu ". " gördüğün yerden kes, ilk cümleyi al. */}
            {/* split noktayı attığı için sonuna elle "." ekledim. */}
            <p>{kisi.bio.split(". ")[0]}.</p>

            {/* Klip sayısı: kişinin klip listesinde kaç klip var (bilgisayar sayar) */}
            <p>{kisi.clips.length} klip</p>
          </li>
        ))}
      </ul>
    </main>
  );
}