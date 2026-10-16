import { notFound } from "next/navigation"; // Next.js'in "sayfa bulunamadı" aracını getir.
import { getAllPeople, getPersonBySlug } from "@/lib/people"; // İki tarifi de getir: herkesi getiren ve slug ile bulan.
import type { Clip } from "@/types"; // Klip kalıbını getir (embedAdresi tarifinin tipi için).

// Klibin embed (gömme) adresini üreten tarif.
// Klibi verirsin, sayfada iframe içinde açılacak adresi geri verir.
function embedAdresi(klip: Clip): string {
  // Instagram ise: adresin sonuna "embed" ekle.
  // https://www.instagram.com/reel/KOD/  →  https://www.instagram.com/reel/KOD/embed
  if (klip.platform === "instagram") {
    return klip.url + "embed";
  }

  // Değilse YouTube'dur: "watch?v=" kısmını "embed/" ile değiştir.
  // https://www.youtube.com/watch?v=KOD  →  https://www.youtube.com/embed/KOD
  return klip.url.replace("watch?v=", "embed/");
}

// Build sırasında hangi kişi sayfalarının önceden üretileceğini Next.js'e söyler.
// Pastane benzetmesi: dükkânı açmadan önce hangi pastaları vitrine koyacağımın listesi.
// Tüm kişileri al, her kişiden { slug: "..." } kutusu yap.
// Sonuç: [{ slug: "nevzat-aydin" }, { slug: "hamdi-ulukaya" }, ...]
// ({ }): Normal parantez "bu bir kutu, onu geri ver" demek.
export function generateStaticParams() {
  return getAllPeople().map((kisi) => ({ slug: kisi.slug }));
}

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

            {/* Embed: klibi sayfanın içindeki küçük bir pencerede (iframe) oynat */}
            {/* src: embedAdresi tarifinin ürettiği adres */}
            {/* title: ekran okuyucular için pencerenin adı */}
            {/* width 320, height 570: reel dikey bir video, telefon ekranı oranına yakın boyut */}
            {/* className: Tailwind ile köşeleri yuvarla (rounded-lg), ince çerçeve ver (border) */}
            {/* allowFullScreen: tam ekrana izin ver */}
            <iframe
              src={embedAdresi(klip)}
              title={klip.title}
              width="320"
              height="570"
              className="rounded-lg border"
              allowFullScreen
            ></iframe>

            {/* Düz link: embed yüklenmezse ziyaretçi buradan izleyebilir */}
            <a href={klip.url} target="_blank">Klibi izle</a>
          </li>
        ))}
      </ul>
    </main>
  );
}