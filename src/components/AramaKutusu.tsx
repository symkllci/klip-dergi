"use client"; // Yazmayı, tuşları ve tıklamayı dinleyecek → tarayıcıda çalışsın

import { useId, useState, type KeyboardEvent } from "react"; // useId = benzersiz kimlik (id) · useState = hafıza · KeyboardEvent = tuş olayının tipi
import { useRouter } from "next/navigation"; // Kod içinden sayfa değiştirmek için (Enter ile kişiye git)

// Öneri listesinde bir kişi: sadece gereken 3 bilgi (biyografi vb. tarayıcıya gönderilmez)
export type AramaKisisi = { ad: string; slug: string; konu: string };

// Türkçe küçük harf: toLocaleLowerCase("tr-TR") → "I" → "ı", "İ" → "i"
// (Sadece toLowerCase() deseydik "ILICALI" → "ilicali" olurdu, "ılıcalı" aramasıyla eşleşmezdi)
const kucult = (yazi: string) => yazi.toLocaleLowerCase("tr-TR");

// Eşleşme: adın HERHANGİ bir kelimesi yazılanla başlıyorsa → soyadı da bulunur ("ulu" → Hamdi Ulukaya)
function eslesiyor(kisi: AramaKisisi, aranan: string): boolean {
  const kelimeler = kucult(kisi.ad).split(" "); // "Hamdi Ulukaya" → ["hamdi", "ulukaya"]
  return kelimeler.some((kelime) => kelime.startsWith(aranan)) || kucult(kisi.ad).startsWith(aranan);
}

const EN_FAZLA = 5; // Planın istediği: en fazla 5 öneri

// 📚 Kaynak: WAI-ARIA APG "Editable Combobox With List Autocomplete"
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
export default function AramaKutusu({ kisiler, kapat }: { kisiler: AramaKisisi[]; kapat: () => void }) {
  const router = useRouter();
  const [yazi, setYazi] = useState(""); // Kutuya yazılan
  const [acik, setAcik] = useState(false); // Öneri listesi açık mı?
  const [vurgulu, setVurgulu] = useState(-1); // Klavyeyle vurgulanan öneri (-1 = hiçbiri)

  const listeId = useId(); // Listenin kimliği (aria-controls bunu gösterecek)
  const aranan = kucult(yazi.trim());
  // filter: eşleşenler · slice(0, 5): en fazla 5
  const oneriler = aranan ? kisiler.filter((kisi) => eslesiyor(kisi, aranan)).slice(0, EN_FAZLA) : [];
  const listeGorunur = acik && oneriler.length > 0;

  // Bir kişiye git: listeyi kapat, aramayı kapat, kişi sayfasını aç
  function git(kisi: AramaKisisi) {
    setAcik(false);
    kapat();
    router.push(`/kisiler/${kisi.slug}`);
  }

  // ⌨️ Klavye (kaynaktaki tablo)
  function tusaBasildi(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      // ↓ (Alt ile: sadece listeyi aç) · yoksa bir sonraki öneri, sondan sonra başa
      e.preventDefault(); // İmleç kutunun sonuna zıplamasın
      setAcik(true);
      if (!e.altKey && oneriler.length > 0) setVurgulu((vurgulu + 1) % oneriler.length);
    } else if (e.key === "ArrowUp") {
      // ↑ bir önceki öneri · ilkteyken (ya da hiçbiri vurgulu değilken) sonuncuya
      e.preventDefault();
      setAcik(true);
      if (oneriler.length > 0) setVurgulu(vurgulu <= 0 ? oneriler.length - 1 : vurgulu - 1);
    } else if (e.key === "Enter") {
      // Enter: öneri vurguluysa o kişiye git. Değilse form gönderilir → /kisiler?ara=... (eski davranış)
      if (listeGorunur && vurgulu >= 0) {
        e.preventDefault();
        git(oneriler[vurgulu]);
      }
    } else if (e.key === "Escape") {
      // Esc: liste açıksa SADECE listeyi kapat · kapalıysa kutuyu temizle · boşsa aramayı kapat
      e.stopPropagation(); // Header'ın "Esc'de aramayı kapat" kulağına gitmesin (önce listeyi kapatmak istiyoruz)
      // preventDefault: type="search" kutularda TARAYICI Esc'de yazıyı kendiliğinden siler.
      // Biz önce sadece listeyi kapatmak istiyoruz (kaynak: "If the listbox is displayed, closes it") → tarayıcının işini durdur
      e.preventDefault();
      if (listeGorunur) {
        setAcik(false);
        setVurgulu(-1);
      } else if (yazi) {
        setYazi("");
      } else {
        kapat();
      }
    }
  }

  return (
    // relative: öneri listesi kutunun hemen altına (absolute) yerleşsin
    <form action="/kisiler" className="relative">
      <input
        type="search"
        name="ara"
        placeholder="Ara..."
        aria-label="Sitede ara"
        autoFocus
        autoComplete="off" // Tarayıcının kendi eski aramalar listesi bizimkinin üstüne binmesin
        // ===== Combobox etiketleri (kaynaktaki "Role, Property, State" tablosu) =====
        role="combobox" // "Ben öneri listesi olan bir kutuyum"
        aria-autocomplete="list" // Öneriler açılır listede, yazılana göre
        aria-expanded={listeGorunur} // Liste şu an açık mı
        aria-controls={listeId} // Listemin kimliği
        // Odak kutuda kalır; vurgulanan önerinin kimliği burada (yoksa undefined = etiket hiç yazılmaz)
        aria-activedescendant={listeGorunur && vurgulu >= 0 ? `${listeId}-${vurgulu}` : undefined}
        value={yazi}
        onChange={(e) => {
          setYazi(e.target.value);
          setAcik(true);
          setVurgulu(-1); // Yeni harf → vurgu sıfırlansın
        }}
        onKeyDown={tusaBasildi}
        onBlur={kapat} // Kutudan çıkınca aramayı kapat (eski davranış)
        className="w-36 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm focus:border-rose-800 focus:outline-none sm:w-52"
      />

      {/* Öneri listesi: role="listbox". Kapalıyken de sayfada durur (hidden): aria-controls'un gösterdiği id hep var olsun */}
      <ul
        id={listeId}
        role="listbox"
        aria-label="Kişi önerileri"
        hidden={!listeGorunur}
        className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 text-left shadow-xl"
      >
        {oneriler.map((kisi, sira) => (
          <li
            key={kisi.slug}
            id={`${listeId}-${sira}`} // aria-activedescendant bu kimliği gösterir
            role="option"
            aria-selected={sira === vurgulu} // Sadece vurgulanan seçenekte true
            // onMouseDown + preventDefault: tıklayınca kutu odağı kaybetmesin (yoksa onBlur aramayı kapatır, tıklama kaybolur)
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => git(kisi)}
            onMouseEnter={() => setVurgulu(sira)}
            className={`cursor-pointer px-4 py-2 ${sira === vurgulu ? "bg-amber-100" : ""}`}
          >
            <span className="block font-serif text-base text-stone-900">{kisi.ad}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-rose-800">{kisi.konu}</span>
          </li>
        ))}
      </ul>
    </form>
  );
}