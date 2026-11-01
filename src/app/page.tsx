import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.

// Ana sayfa: sitenin adresi "/" (localhost:3000)
export default function Home() {
  return (
    // Sayfayı ortala, genişliği sınırla, kenarlardan ve üstten boşluk ver
    <main className="mx-auto max-w-3xl p-6 mt-16">
      {/* Sitenin adı: büyük ve kalın */}
      <h1 className="text-4xl font-bold mb-4">KLİP DERGİ</h1>

      {/* Tek cümlelik açıklama: gri yazı */}
      <p className="text-lg text-gray-600 mb-8">
        Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren dergi.
      </p>

      {/* Kişiler sayfasına giden düğme: siyah zemin, beyaz yazı */}
      <Link href="/kisiler" className="inline-block rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800">
        Kişiler →
      </Link>
    </main>
  );
}