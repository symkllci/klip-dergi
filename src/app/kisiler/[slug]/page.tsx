import { notFound } from "next/navigation"; // Next.js'in "sayfa bulunamadı" aracını getir.
import { getPersonBySlug } from "@/lib/people"; // Dün yazdığım "slug ile kişiyi bul" tarifini getir.

// Kişi sayfası: /kisiler/nevzat-aydin gibi adreslerde açılır.
// params: adresten gelen bilgi. Klasör adı [slug] olduğu için içinde slug var.
// async: bu bileşen bir şey bekleyecek (params biraz sonra geliyor).
export default async function KisiSayfasi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // params gelene kadar bekle, içinden slug'ı çıkar.
  const kisi = getPersonBySlug(slug); // Slug ile kişiyi bul. Bulamazsa undefined döner.

  // Kişi yoksa (ör. /kisiler/ali-veli) 404 sayfasını göster ve burada dur.
  if (!kisi) {
    notFound();
  }

  return (
    <main>
      {/* Kişinin adı */}
      <h1>{kisi.name}</h1>

      {/* Biyografinin tamamı */}
      <p>{kisi.bio}</p>

      {/* Sosyal medya: kişinin links listesindeki her link için bir satır */}
      <h2>Sosyal Medya</h2>
      <ul>
        {kisi.links.map((link) => (
          // Her link düz bir yazı: hem kimlik (key), hem adres (href), hem ekranda görünen yazı
          // target="_blank": linki yeni sekmede aç, ziyaretçi bizim siteyi kaybetmesin
          <li key={link}>
            <a href={link} target="_blank">{link}</a>
          </li>
        ))}
      </ul>

      {/* Klipler: kişinin clips listesindeki her klip için bir satır */}
      <h2>Klipler</h2>
      <ul>
        {kisi.clips.map((klip) => (
          // Her klip bir kutu (platform, url, title, topic, publishedAt)
          // key: her klipte farklı olan alan url
          <li key={klip.url}>
            {/* Klibin başlığı */}
            <h3>{klip.title}</h3>

            {/* Düz link: embed yüklenmezse ziyaretçi buradan izleyebilir */}
            <a href={klip.url} target="_blank">Klibi izle</a>
          </li>
        ))}
      </ul>
    </main>
  );
}