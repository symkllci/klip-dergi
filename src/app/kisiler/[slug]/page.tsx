import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir (geri dönüş linki için).
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
    // Sayfayı ortala (mx-auto), genişliği sınırla (max-w-5xl), kenarlardan boşluk (p-6)
    <main className="mx-auto max-w-5xl p-6">
      {/* Geri dönüş linki: kişiler listesine götürür. Küçük, gri; fare gelince altı çizilir. */}
      <Link href="/kisiler" className="text-sm text-gray-500 hover:underline">
        ← Tüm kişiler
      </Link>

      {/* Kişinin adı: büyük, kalın. mt-4: üstten boşluk, mb-4: alttan boşluk */}
      <h1 className="text-3xl font-bold mt-4 mb-4">{kisi.name}</h1>

      {/* Biyografinin tamamı. leading-relaxed: satır aralığı biraz geniş, rahat okunsun */}
      <p className="text-gray-700 leading-relaxed mb-8">{kisi.bio}</p>

      {/* Sosyal medya: kişinin links listesindeki her link için bir satır */}
      <h2 className="text-xl font-semibold mb-2">Sosyal Medya</h2>
      <ul className="mb-8">
        {kisi.links.map((link) => (
          // Her link düz bir yazı: hem kimlik (key), hem adres (href), hem ekranda görünen yazı
          // target="_blank": linki yeni sekmede aç, ziyaretçi bizim siteyi kaybetmesin
          // text-blue-600: mavi yazı (link olduğu anlaşılsın)
          <li key={link}>
            <a href={link} target="_blank" className="text-blue-600 hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Klipler: kişinin clips listesindeki her klip için bir kart */}
      <h2 className="text-xl font-semibold mb-4">Klipler</h2>
      {/* Klipleri yan yana diz: telefonda alt alta, orta ekranda ve üstünde 2 tane yan yana */}
      <ul className="grid gap-6 md:grid-cols-2">
        {kisi.clips.map((klip) => (
          // Her klip bir kutu (platform, url, title, topic, publishedAt)
          // key: her klipte farklı olan alan url
          <li key={klip.url}>
            {/* Klibin başlığı */}
            <h3 className="font-semibold mb-2">{klip.title}</h3>

            {/* Embed: klibi sayfanın içindeki küçük bir pencerede (iframe) oynat */}
            {/* src: embedAdresi tarifinin ürettiği adres */}
            {/* title: ekran okuyucular için pencerenin adı */}
            {/* width 320, height 570: reel dikey bir video, telefon ekranı oranına yakın boyut */}
            {/* rounded-lg border: yuvarlak köşe, ince çerçeve */}
            {/* allowFullScreen: tam ekrana izin ver */}
            <iframe
              src={embedAdresi(klip)}
              title={klip.title}
              width="320"
              height="570"
              className="rounded-lg border"
              allowFullScreen
            ></iframe>

            {/* Düz link: embed yüklenmezse ziyaretçi buradan izleyebilir. block: kendi satırında dursun */}
            <a href={klip.url} target="_blank" className="block mt-2 text-sm text-blue-600 hover:underline">
              Klibi Instagram'da izle
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}