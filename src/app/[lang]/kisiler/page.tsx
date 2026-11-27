import Link from "next/link"; // Next.js'in sayfalar arası geçiş bileşenini getir.
import { Lora } from "next/font/google"; // Ana sayfadaki serif başlık fontu (dergi hissi).
import { getAllPeople, getAramaKisileri } from "@/lib/people"; // Bütün kişiler + arama önerileri için kişiler
import HikayeKarti from "@/components/HikayeKarti"; // Kişi kartı: ana sayfadaki "Bütün hikâyeler" albümüyle aynı (kişi fotoğrafı, siyah-beyaz, kutusuz)
import Kirinti from "@/components/Kirinti"; // ⭐ Ekmek kırıntısı: nerede olduğunu gösterir
import AramaKutusu from "@/components/AramaKutusu"; // Önerili arama kutusu (üst menüdekiyle aynı, burada büyük hâli)
import { dilAl, getSozluk, konuAdi, yol } from "@/lib/sozluk"; // Dil, sözlük, konunun o dildeki adı, adres

// Başlık fontu: ana sayfadakiyle aynı Lora. latin-ext: Türkçe harfler (ş, ğ, ı, İ) için.
const baslikFontu = Lora({ subsets: ["latin", "latin-ext"] });

// Renkler (ana sayfayla aynı): krem zemin amber-50 · koyu mürekkep stone-900 · bordo vurgu rose-800

// Konu bağlantıları: kutu/kapsül YOK, gazete gibi düz yazı (BÜYÜK HARF, aralıklı), aralarında nokta
const konuTemel = "text-xs font-semibold uppercase tracking-[0.2em] transition-colors";
// Seçili konu: bordo ve altı çizili
const konuSecili = "text-rose-800 underline decoration-2 underline-offset-4";
// Seçili olmayan: gri, üstüne gelince bordo
const konuNormal = "text-stone-500 hover:text-rose-800";

// Kişiler sayfası. searchParams: adresteki ? sonrası bilgiler.
// Örnek: /kisiler?konu=yatırım&ara=ata → { konu: "yatırım", ara: "ata" }
// params gibi o da bir Promise (kargo), o yüzden async ve await.
export default async function KisilerSayfasi({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ konu?: string | string[]; ara?: string | string[] }>;
}) {
  const dil = dilAl((await params).lang); // Adresteki dil: "tr" ya da "en"
  const s = getSozluk(dil); // O dilin sözlüğü
  const sayfa = yol(dil, "/kisiler"); // Bu sayfanın adresi: /kisiler ya da /en/kisiler
  const { konu, ara } = await searchParams; // Adreste ?konu= ve ?ara= varsa değerlerini al.
  // İkisi de bazen liste olabilir (?konu=a&konu=b). Biz sadece tek yazıyı kabul ediyoruz.
  const seciliKonu = typeof konu === "string" ? konu : undefined;
  // trim: baştaki ve sondaki boşlukları sil ("  nevzat " → "nevzat")
  const aramaMetni = typeof ara === "string" ? ara.trim() : "";

  const tumKisiler = await getAllPeople(); // Bütün kişiler (şu an 12).
  // Öneri listesi için ad, konular, klip başlıkları (üst menüdeki aramayla aynı liste, lib/people.ts'ten)
  // Konular o dile çevrilir (layout.tsx'teki gibi)
  const aramaKisileri = (await getAramaKisileri()).map((kisi) => ({
    ...kisi,
    konular: kisi.konular.map((konu) => konuAdi(s, konu)),
  }));

  // Konu listesini kliplerden çıkar, elle yazma.
  // Her kişinin her klibine bak; konusu listede yoksa (includes = içeriyor mu?) ekle.
  const konular: string[] = [];
  for (const kisi of tumKisiler) {
    for (const klip of kisi.clips) {
      if (!konular.includes(klip.topic)) {
        konular.push(klip.topic);
      }
    }
  }

  // 1. süzgeç: seçili konu varsa sadece o konuda klibi olan kişiler, yoksa hepsi.
  // filter: şarta uyan BÜTÜN elemanları getirir. some: kliplerden en az biri uyuyor mu?
  const konuyaGore = seciliKonu
    ? tumKisiler.filter((kisi) => kisi.clips.some((klip) => klip.topic === seciliKonu))
    : tumKisiler;

  // 2. süzgeç: arama metni varsa adında, konusunda ya da klip başlığında bu metin geçen kişiler, yoksa hepsi.
  // toLocaleLowerCase(s.genel.yerel): o dilin kurallarıyla küçük harfe çevir (Türkçede "tr-TR", İngilizcede "en-GB").
  // Hem bakılan yazıyı hem aranan yazıyı küçültüyoruz: "NEVZAT", "Nevzat", "nevzat" hepsi aynı sonucu verir.
  // includes: yazının İÇİNDE bu parça geçiyor mu? "nevzat aydın".includes("zat") → true
  const kucult = (yazi: string) => yazi.toLocaleLowerCase(s.genel.yerel);
  const aramaKucuk = kucult(aramaMetni);
  // Kelime adında, ya da kliplerinden birinin konusunda/başlığında geçiyor mu? (|| = "ya da")
  const kisiler = aramaMetni
    ? konuyaGore.filter((kisi) => {
        const adindaVar = kucult(kisi.name).includes(aramaKucuk);
        // some: kliplerden EN AZ BİRİNİN konusu ya da başlığı uyuyorsa true
        const klibindeVar = kisi.clips.some(
          (klip) =>
            // Konunun o dildeki adı: İngilizcede "investment" yazılınca da bulunsun
            kucult(konuAdi(s, klip.topic)).includes(aramaKucuk) ||
            kucult(klip.title).includes(aramaKucuk)
        );
        return adindaVar || klibindeVar; // Biri bile doğruysa kişi listede kalır
      })
    : konuyaGore;

  return (
    // Bütün sayfa: ana sayfayla aynı krem zemin (amber-50) ve koyu mürekkep yazı (stone-900)
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* pt-6: üstte az boşluk → başlık yukarıda */}
      <main className="mx-auto max-w-6xl px-6 pb-10 pt-6">
        {/* ===== GAZETE DÜZENİ (Maket B): her şey ortalı =====
            Manşet: ekmek kırıntısı + büyük başlık + italik açıklama, hepsi ortada (künye şeridi kaldırıldı) */}
        <header className="pb-10 text-center">
          {/* Ekmek kırıntısı: başlığın hemen üstünde, ortada (flex justify-center: kırıntıyı ortaya al) */}
          <div className="flex justify-center">
            <Kirinti etiket={s.kirinti.etiket} adimlar={[{ ad: s.genel.anaSayfa, href: yol(dil, "/") }, { ad: s.genel.kisiler }]} />
          </div>
          <h1 className={`${baslikFontu.className} mt-3 text-4xl font-bold sm:text-5xl`}>{s.genel.kisiler}</h1>
          <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic leading-relaxed text-stone-600">
            {s.kisilerSayfasi.aciklama}
          </p>
        </header>

        {/* Arama: ortada, altı çizgili tek satır (AramaKutusu, buyuk). Yazınca en fazla 5 kişi önerir.
            Öneri seçilirse kişinin sayfasına gider · seçilmeden Enter ya da "Ara" → /kisiler?ara=... */}
        <div className="mx-auto max-w-sm">
          <AramaKutusu kisiler={aramaKisileri} dil={dil} s={s} buyuk ilkYazi={aramaMetni} konu={seciliKonu} />
        </div>

        {/* Konular: iki ince çizgi arasında, ortalı tek akış, aralarında · (gazetedeki bölüm listesi gibi) */}
        <nav aria-label={s.kisilerSayfasi.konular} className="mt-8 border-y border-stone-300 py-3">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-stone-300">
            {/* Tümü: konu filtresini kaldırır. Arama varsa onu korur. */}
            <li>
              <Link
                href={{ pathname: sayfa, query: aramaMetni ? { ara: aramaMetni } : {} }}
                aria-current={!seciliKonu ? "page" : undefined}
                className={`${konuTemel} ${!seciliKonu ? konuSecili : konuNormal}`}
              >
                {s.kisilerSayfasi.tumu}
              </Link>
            </li>
            {konular.map((k) => (
              // href'i nesne olarak veriyoruz: Next.js boşluk ve Türkçe harfleri adrese kendisi uygun yazar.
              // Arama varsa konuya tıklayınca kaybolmasın diye onu da ekliyoruz.
              // Önündeki · süs: ekran okuyucu okumasın (aria-hidden)
              <li key={k} className="flex items-center gap-x-3">
                <span aria-hidden="true">·</span>
                <Link
                  href={{ pathname: sayfa, query: aramaMetni ? { konu: k, ara: aramaMetni } : { konu: k } }}
                  aria-current={seciliKonu === k ? "page" : undefined}
                  className={`${konuTemel} ${seciliKonu === k ? konuSecili : konuNormal}`}
                >
                  {/* Adreste Türkçe konu kalır (?konu=yatırım), ekranda o dildeki adı yazar */}
                  {konuAdi(s, k)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Süzgeç varsa ne seçildiğini yaz (yoksa hiç çıkmaz) */}
        {(seciliKonu || aramaMetni) && (
          <p className="mt-6 text-center text-sm text-stone-500">
            {seciliKonu && `${s.kisilerSayfasi.konu}: "${konuAdi(s, seciliKonu)}"`}
            {seciliKonu && aramaMetni && " · "}
            {aramaMetni && `${s.kisilerSayfasi.arama}: "${aramaMetni}"`}
            {" · "}
            <Link href={sayfa} className="text-rose-800 hover:underline">
              {s.kisilerSayfasi.temizle}
            </Link>
          </p>
        )}

        {/* Hiç sonuç yoksa bilgi ver */}
        {kisiler.length === 0 && <p className="mt-10 text-center text-stone-600">{s.kisilerSayfasi.sonucYok}</p>}

        {/* Kartlar: klip kapağı yerine KİŞİ FOTOĞRAFI (Wikipedia/Commons, siyah-beyaz). Fotoğrafı olmayanda reel kapağı.
            Ana sayfadaki "Bütün hikâyeler" ile aynı kart (HikayeKarti, album) ve aynı ızgara:
            📚 MDN CSS Grid · auto-fill = sığdığı kadar sütun · minmax = her kart en az 230px */}
        <ul className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))] gap-x-12 gap-y-14">
          {kisiler.map((kisi) => (
            <li key={kisi.slug}>
              <HikayeKarti kisi={kisi} duzen="album" dil={dil} s={s} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}