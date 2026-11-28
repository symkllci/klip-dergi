// HABER ÇEK: Google News RSS'ten her kişinin iş/girişimcilik haberlerini bulur → src/data/haberler.json'a EKLER
//
// Çalıştırma:  npx tsx scripts/haber-cek.ts          (GitHub Actions her Pazartesi bunu çalıştırır, sonra PR açar)
//              npx tsx scripts/haber-cek.ts --gun 30 (elle denerken: son 30 gün)
// Süzgeçler (hocanın planı):
//   1) Başlıkta kişinin TAM ADI geçmeli ("Acun Ilıcalı")
//   2) Kaynak, scripts/haber-kaynaklari.json listesindeki sitelerden biri olmalı
//   3) Aynı haberin kopyaları elenir (aynı link ya da çok benzer başlık)
//   4) Tarih: İLK çalıştırmada son 90 gün, sonra sadece son 7 gün → editörün sildiği haber bir daha gelmez
// Sadece başlık, kaynak, tarih ve link alınır. Haberin metni ve fotoğrafı ALINMAZ (onlar haber sitesinin).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Haber = { kisi: string; kaynak: string; tarih: string; baslik: string; url: string };
type RssHaberi = { baslik: string; url: string; tarih: Date; kaynakAdi: string; site: string };

const KOK = process.cwd();
const HABER_DOSYASI = path.join(KOK, "src", "data", "haberler.json");
const kisiler: { slug: string; name: string }[] = JSON.parse(readFileSync(path.join(KOK, "src", "data", "people.json"), "utf8"));
const { kaynaklar }: { kaynaklar: { ad: string; site: string }[] } = JSON.parse(
  readFileSync(path.join(KOK, "scripts", "haber-kaynaklari.json"), "utf8"),
);
const izinliSiteler = new Set(kaynaklar.map((k) => k.site));

// ===== Yardımcılar =====
// Türkçe küçük harf + tırnakları birleştir: "ACUN ILICALI’DAN" → "acun ılıcalı'dan"
const kucult = (s: string) => s.toLocaleLowerCase("tr-TR").replace(/[’‘`´]/g, "'");
// Karşılaştırma için kelimeler: noktalama yok, 2 harften kısa kelime yok
const kelimeler = (s: string) => new Set(kucult(s).replace(/[^0-9a-zçğıöşüâîû\s]/g, " ").split(/\s+/).filter((k) => k.length > 2));
// İki başlık ne kadar benziyor? Ortak kelime / toplam kelime (0 = hiç, 1 = aynı)
function benzerlik(a: string, b: string): number {
  const A = kelimeler(a), B = kelimeler(b);
  const ortak = [...A].filter((k) => B.has(k)).length;
  return ortak / (new Set([...A, ...B]).size || 1);
}
const AYNI_HABER = 0.6; // %60'tan fazla ortak kelime = aynı haber

// XML'deki özel işaretleri çöz: &amp; → &, &#39; → '
function coz(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
const etiket = (xml: string, ad: string) => coz(xml.match(new RegExp(`<${ad}[^>]*>([\\s\\S]*?)</${ad}>`))?.[1] ?? "").trim();

// ===== RSS'i çek ve oku =====
async function rssCek(ad: string): Promise<RssHaberi[]> {
  const adres = `https://news.google.com/rss/search?q=${encodeURIComponent(`"${ad}"`)}&hl=tr&gl=TR&ceid=TR:tr`;
  const cevap = await fetch(adres, { headers: { "User-Agent": "KlipDergi-haber-cek/1.0 (haftalik, editor onayli)" } });
  if (!cevap.ok) throw new Error(`Google News ${cevap.status}`);
  const xml = await cevap.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const kaynakAdi = etiket(item, "source");
    const site = (item.match(/<source url="https?:\/\/([^"/]+)/)?.[1] ?? "").replace(/^www\./, "");
    // Google başlığın sonuna " - Kaynak" ekliyor → at
    const baslik = etiket(item, "title").replace(new RegExp(`\\s+-\\s+${kaynakAdi.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "");
    return { baslik, url: etiket(item, "link"), tarih: new Date(etiket(item, "pubDate")), kaynakAdi, site };
  });
}

// ===== Ana akış =====
async function main() {
  // İlk çalıştırma = haberler.json henüz YOK. (Boş liste [] olsa bile dosya varsa ilk değil: editör hepsini silse de eski haberler geri gelmez)
  const ilkKez = !existsSync(HABER_DOSYASI);
  const eskiler: Haber[] = ilkKez ? [] : JSON.parse(readFileSync(HABER_DOSYASI, "utf8"));
  const gunArg = process.argv.indexOf("--gun");
  const gun = gunArg > 0 ? Number(process.argv[gunArg + 1]) : ilkKez ? 90 : 7;
  const sinir = new Date(Date.now() - gun * 24 * 60 * 60 * 1000);
  console.log(`[haber-cek] ${ilkKez ? "İLK çalıştırma" : "haftalık"} → son ${gun} gün · ${kaynaklar.length} kaynak · ${kisiler.length} kişi\n`);

  const yeniler: Haber[] = [];
  for (const kisi of kisiler) {
    let rss: RssHaberi[];
    try {
      rss = await rssCek(kisi.name);
    } catch (hata) {
      console.log(`  ✖ ${kisi.slug}: ${hata instanceof Error ? hata.message : hata}`);
      continue;
    }
    const tamAd = kucult(kisi.name);
    const adiGecen = rss.filter((h) => kucult(h.baslik).includes(tamAd)); // 1) başlıkta tam ad
    const kaynakUygun = adiGecen.filter((h) => izinliSiteler.has(h.site)); // 2) izinli site
    const tarihUygun = kaynakUygun.filter((h) => h.tarih >= sinir); // 4) tarih
    // 3) kopyalar: daha önce eklenmiş ya da bu turda eklenmiş, aynı link / benzer başlık
    const kisininHaberleri = () => [...eskiler, ...yeniler].filter((h) => h.kisi === kisi.slug);
    let eklenen = 0;
    for (const h of tarihUygun.sort((a, b) => b.tarih.getTime() - a.tarih.getTime())) {
      const kopya = kisininHaberleri().some((e) => e.url === h.url || benzerlik(e.baslik, h.baslik) >= AYNI_HABER);
      if (kopya) continue;
      const kaynak = kaynaklar.find((k) => k.site === h.site)!.ad; // listedeki düzgün ad
      yeniler.push({ kisi: kisi.slug, kaynak, tarih: h.tarih.toISOString().slice(0, 10), baslik: h.baslik, url: h.url });
      eklenen++;
    }
    console.log(`  ${kisi.slug.padEnd(18)} RSS ${String(rss.length).padStart(3)} → adı geçen ${String(adiGecen.length).padStart(3)} → kaynak uygun ${kaynakUygun.length} → son ${gun} gün ${tarihUygun.length} → YENİ ${eklenen}`);
    await new Promise((r) => setTimeout(r, 1000)); // Google'a nazik ol: istekler arası 1 sn
  }

  // Yeni + eski, en yeni üstte. Dosya hep aynı düzende yazılır → PR'daki fark (diff) okunaklı olur
  const hepsi = [...yeniler, ...eskiler].sort((a, b) => b.tarih.localeCompare(a.tarih) || a.kisi.localeCompare(b.kisi));
  writeFileSync(HABER_DOSYASI, JSON.stringify(hepsi, null, 2) + "\n");
  console.log(`\n[haber-cek] yeni haber: ${yeniler.length} · toplam: ${hepsi.length} → src/data/haberler.json`);
}

main().catch((hata) => {
  console.error("✖", hata);
  process.exit(1);
});