import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.

// Ana sayfa: sitenin ilk açılan sayfası (/)
export default function Home() {
  return (
    // Sayfayı ortala (mx-auto), genişliği sınırla (max-w-3xl), kenarlardan boşluk (p-6)
    // mt-16: üstten büyük boşluk, içerik sayfanın tepesine yapışmasın
    <main className="mx-auto max-w-3xl p-6 mt-16">
      {/* Site adı: çok büyük (text-4xl), kalın */}
      <h1 className="text-4xl font-bold mb-4">KLİP DERGİ</h1>

      {/* Tek cümlelik açıklama: biraz büyük (text-lg), gri */}
      <p className="text-lg text-gray-600 mb-8">
        Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren dergi.
      </p>

      {/* Kişiler linki: düğme gibi görünsün */}
      {/* inline-block: düğme şekli alsın. px-5 py-3: yanlardan ve üst-alttan boşluk */}
      {/* bg-black text-white: siyah zemin, beyaz yazı. rounded-lg: yuvarlak köşe */}
      {/* hover:bg-gray-800: fare gelince biraz açılsın */}
      <Link
        href="/kisiler"
        className="inline-block rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
      >
        Kişiler →
      </Link>
    </main>
  );
}