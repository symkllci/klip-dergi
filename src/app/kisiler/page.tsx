import { getAllPeople } from "@/lib/people"; // Dün yazdığım tarifi bu dosyaya getir.

export default function KisilerSayfasi() { // Bu dosyanın sayfası bu bileşen.
  const kisiler = getAllPeople(); // Tarifi çalıştır, 5 kişiyi kisiler adıyla sakla.

  return ( // Ekrana bunları ver.
    <main>
      <h1>Kişiler</h1>
      <p>Podcast kliplerinde konuşan girişimcilerin biyografileri, sosyal medya hesapları ve viral klipleri.</p>

      {/* Listede kaç kişi var: 5 */}
      <p>Toplam {kisiler.length} kişi</p>

      {/* Kişilerin listesi */}
      <ul>
        {/* map: her kişiyi sırayla al, adına kisi de */}
        {kisiler.map((kisi) => (
          // key: her satırın kimliği (slug), içine kişinin adını yaz
          <li key={kisi.slug}>{kisi.name}</li>
        ))}
      </ul>
    </main>
  );
}