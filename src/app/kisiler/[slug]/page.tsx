// Kişi sayfası: /kisiler/nevzat-aydin gibi adreslerde açılır.
// params: Next.js'in adresten aldığı bilgi. Klasör adı [slug] olduğu için içinde slug var.
// async: bu bileşen bir şey bekleyecek (params biraz sonra geliyor).
export default async function KisiSayfasi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // params gelene kadar bekle, içinden slug'ı çıkar.

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  );
}