import Link from "next/link"; // Site içi geçiş

// Yolun her adımı: adı ve (varsa) adresi. Adresi olmayan adım = şu an bulunduğun sayfa
type Adim = { ad: string; href?: string };

// Ekmek kırıntısı: "Ana sayfa › Kişiler › Acun Ilıcalı" gibi, nerede olduğunu gösterir
// etiket: ekran okuyucunun okuyacağı ad (sözlükten: "Konum" / "Breadcrumb")
export default function Kirinti({ adimlar, etiket }: { adimlar: Adim[]; etiket: string }) {
  return (
    // aria-label: ekran okuyucu "Konum" (İngilizcede "Breadcrumb") diye okusun
    <nav aria-label={etiket}>
      {/* Kutu yok: beyaz hap kaldırıldı, yazı doğrudan krem sayfanın üstünde (dergi gibi sade) */}
      <ol className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
        {adimlar.map((adim, sira) => (
          <li key={adim.ad} className="flex items-center gap-2">
            {/* İlk adım hariç, her adımın önüne › işareti */}
            {sira > 0 && <span className="text-stone-300">›</span>}
            {/* Adresi varsa tıklanabilir, yoksa "buradasın" (bordo) */}
            {adim.href ? (
              <Link href={adim.href} className="transition-colors hover:text-rose-800">
                {adim.ad}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-rose-800">
                {adim.ad}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}