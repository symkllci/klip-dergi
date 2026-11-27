import Link from "next/link";
import { Lora } from "next/font/google";
import { yol, type Dil, type Sozluk } from "@/lib/sozluk"; // Dil, sözlük ve dile göre adres

const baslikFontu = Lora({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });

// Sütun başlıklarının ortak görünüşü: küçük, BÜYÜK HARF, aralıklı, beyaz
const sutunBasligi = "text-xs font-semibold uppercase tracking-widest text-white";
// Sosyal medya düğmelerinin ortak görünüşü: yuvarlak, ince beyaz çerçeve, üstüne gelince beyaz dolar
const simgeDugmesi = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition-colors hover:bg-white hover:text-rose-800";

// Alt bilgi: her sayfanın en altında. Bordo zemin, beyaz yazı. Yazılar sözlükten (s)
export default function Footer({ dil, s }: { dil: Dil; s: Sozluk }) {
  return (
    <footer className="mt-16 bg-rose-800 px-6 pb-8 pt-14 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Üst: ortada logo ve tek cümle */}
        <div className="text-center">
          <Link href={yol(dil, "/")} className={`${baslikFontu.className} text-4xl font-bold italic sm:text-5xl`}>
            {s.genel.siteAdi}
          </Link>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">{s.genel.aciklama}</p>
        </div>

        {/* Orta: 3 sütun, ortalı. Üstünde ince çizgi. Telefonda alt alta */}
        <div className="mt-10 grid gap-8 border-t border-white/20 pt-10 text-center sm:grid-cols-3">
          {/* Dergi */}
          <div>
            <p className={sutunBasligi}>{s.footer.dergi}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link href={yol(dil, "/hakkinda")} className="hover:text-white hover:underline">{s.genel.hakkimizda}</Link></li>
              <li><Link href={yol(dil, "/kisiler")} className="hover:text-white hover:underline">{s.genel.kisiler}</Link></li>
            </ul>
          </div>

          {/* İletişim. DEMO: gerçek adres hocadan gelince mailto: linki olacak */}
          <div>
            <p className={sutunBasligi}>{s.footer.iletisim}</p>
            <p className="mt-4 text-sm text-white/80">info@klipdergi.com</p>
          </div>

          {/* Sosyal medya */}
          <div>
            <p className={sutunBasligi}>{s.footer.takip}</p>
            <div className="mt-4 flex justify-center gap-3">
              {/* Instagram (gerçek) */}
              <a href="https://www.instagram.com/viralgirisimci/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={simgeDugmesi}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* X / Twitter. DEMO */}
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className={simgeDugmesi}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3z" />
                </svg>
              </a>
              {/* YouTube. DEMO */}
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={simgeDugmesi}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Alt satır: telif solda, başa dön sağda */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/20 pt-6 text-xs text-white/70 sm:flex-row sm:justify-between">
          <p>{s.footer.telif}</p>
          <a href="#" className="hover:text-white">{s.footer.basaDon}</a>
        </div>
      </div>
    </footer>
  );
}