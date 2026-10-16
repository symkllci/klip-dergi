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
      <h1>{kisi.name}</h1> {/* Kişinin adı */}
      <p>{kisi.bio}</p>    {/* Biyografinin tamamı */}
    </main>
  );
}