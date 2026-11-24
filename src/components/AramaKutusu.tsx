"use client"; // Yazmayı, tuşları ve tıklamayı dinleyecek → tarayıcıda çalışsın

import { useId, useState, type KeyboardEvent } from "react"; // useId = benzersiz kimlik (id) · useState = hafıza · KeyboardEvent = tuş olayının tipi
import { useRouter } from "next/navigation"; // Kod içinden sayfa değiştirmek için (Enter ile kişiye git)

// Öneri listesinde bir kişi: ad, adres, konuları ve klip başlıkları (biyografi vb. tarayıcıya gönderilmez)
export type AramaKisisi = { ad: string; slug: string; konular: string[]; basliklar: string[] };

// Türkçe küçük harf: toLocaleLowerCase("tr-TR") → "I" → "ı", "İ" → "i"
// (Sadece toLowerCase() deseydik "ILICALI" → "ilicali" olurdu, "ılıcalı" aramasıyla eşleşmezdi)
const kucult = (yazi: string) => yazi.toLocaleLowerCase("tr-TR");

// Bir yazı arananla başlıyor mu? Bütünü YA DA herhangi bir kelimesi.
// "Hamdi Ulukaya" + "ulu" → evet (soyadı) · "Milyarlık Vesting Dersi" + "vest" → evet · "harekete geçmek" + "geç" → evet
function basliyor(yazi: string, aranan: string): boolean {
  const kucuk = kucult(yazi);
  return kucuk.startsWith(aranan) || kucuk.split(" ").some((kelime) => kelime.startsWith(aranan));
}

// Kişi aranana uyuyor mu? Uyuyorsa önerinin ALT SATIRINDA ne yazacağını döner, uymuyorsa null.
// Sıra: 1) ad → ilk konusu yazılır · 2) konu (EKİP, VİZYON…) → o konu · 3) klip adı → o klibin adı
// Böylece ziyaretçi kişinin NEDEN önerildiğini görür ("vest" → Mark Zuckerberg / Milyarlık Vesting Dersi)
function eslesme(kisi: AramaKisisi, aranan: string): string | null {
  if (basliyor(kisi.ad, aranan)) return kisi.konular[0];
  const konu = kisi.konular.find((k) => basliyor(k, aranan)); // find: uyan ilk konu, yoksa undefined
  if (konu) return konu;
  const baslik = kisi.basliklar.find((b) => basliyor(b, aranan));
  if (baslik) return baslik;
  return null; // hiçbiri uymadı
}

const EN_FAZLA = 5; // Planın istediği: en fazla 5 öneri

// Bu kutu İKİ yerde kullanılıyor:
//  1) Üst menüde (Header): küçük, açılınca odaklanır, kutudan çıkınca kapanır → kapat verilir
//  2) Kişiler sayfasında: büyük, hep açık, yanında "Ara" düğmesi → buyuk verilir, kapat verilmez
type Ozellikler = {
  kisiler: AramaKisisi[];
  kapat?: () => void; // ? = sadece üst menüde var (Kişiler sayfasında kutu kapanmaz)
  buyuk?: boolean; // Kişiler sayfasındaki büyük kutu mu?
  ilkYazi?: string; // Kişiler sayfasında adresteki ?ara= değeri: sayfa açılınca kutuda dursun
  konu?: string; // Kişiler sayfasında seçili konu: aramada kaybolmasın diye forma gizli eklenir
};

// 📚 Kaynak: WAI-ARIA APG "Editable Combobox With List Autocomplete"
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
export default function AramaKutusu({ kisiler, kapat, buyuk = false, ilkYazi = "", konu }: Ozellikler) {
  const router = useRouter();
  const [yazi, setYazi] = useState(ilkYazi); // Kutuya yazılan (Kişiler sayfasında adresteki aramayla başlar)
  const [acik, setAcik] = useState(false); // Öneri listesi açık mı?
  const [vurgulu, setVurgulu] = useState(-1); // Klavyeyle vurgulanan öneri (-1 = hiçbiri)

  const listeId = useId(); // Listenin kimliği (aria-controls bunu gösterecek)
  const aranan = kucult(yazi.trim());
  // Her kişiye "neden uydu" yazısını ekle (map) → uymayanları at (filter) → en fazla 5 (slice)
  const oneriler = aranan
    ? kisiler
        .map((kisi) => ({ kisi, alt: eslesme(kisi, aranan) }))
        .filter((oneri) => oneri.alt !== null)
        .slice(0, EN_FAZLA)
    : [];
  const listeGorunur = acik && oneriler.length > 0;

  // Bir kişiye git: listeyi kapat, aramayı kapat, kişi sayfasını aç
  function git(kisi: AramaKisisi) {
    setAcik(false);
    kapat?.(); // ?.() = kapat varsa çağır, yoksa (Kişiler sayfası) hiçbir şey yapma
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
        git(oneriler[vurgulu].kisi);
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
        kapat?.();
      }
    }
  }

  return (
    // relative: öneri listesi kutunun hemen altına (absolute) yerleşsin
    // Kişiler sayfasında: kutu + Ara düğmesi yan yana (flex), kutu geniş
    // Kişiler sayfasında: altı çizgili tek satır (kapsül yok), sağında "Ara"
    <form action="/kisiler" className={buyuk ? "relative flex w-full items-center gap-2 border-b border-stone-400 focus-within:border-rose-800" : "relative"}>
      <input
        type="search"
        name="ara"
        placeholder={buyuk ? "İsim, konu, klip" : "Ara..."}
        aria-label="Sitede ara"
        autoFocus={!buyuk} // Üst menüde açılınca hemen yazılabilsin · Kişiler sayfasında sayfa açılınca klavye fırlamasın
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
        // Kutudan çıkınca: üst menüde aramayı kapat · Kişiler sayfasında sadece listeyi kapat
        onBlur={() => (kapat ? kapat() : setAcik(false))}
        className={`bg-transparent text-sm focus:outline-none ${
          buyuk ? "w-full min-w-0 py-2" : "w-36 rounded-full border border-stone-300 px-4 py-1.5 focus:border-rose-800 sm:w-52"
        }`}
      />
      {/* Kişiler sayfasında: seçili konu aramada kaybolmasın + bordo "Ara" yazısı */}
      {buyuk && konu && <input type="hidden" name="konu" value={konu} />}
      {buyuk && (
        <button
          type="submit"
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-rose-800 transition-colors hover:text-rose-950"
        >
          Ara
        </button>
      )}

      {/* Öneri listesi: role="listbox". Kapalıyken de sayfada durur (hidden): aria-controls'un gösterdiği id hep var olsun */}
      <ul
        id={listeId}
        role="listbox"
        aria-label="Kişi önerileri"
        hidden={!listeGorunur}
        // Liste zemini krem (beyaz değil). Üst menüde sağa, Kişiler sayfasında sola yaslı
        className={`absolute top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-stone-200 bg-amber-50 py-1 text-left shadow-xl ${
          buyuk ? "left-0" : "right-0"
        }`}
      >
        {oneriler.map(({ kisi, alt }, sira) => (
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
            {/* Alt satır: neden önerildi (konu ya da klip adı) */}
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-rose-800">{alt}</span>
          </li>
        ))}
      </ul>
    </form>
  );
}