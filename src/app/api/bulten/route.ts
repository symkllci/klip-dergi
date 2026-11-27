import { z } from "zod";
import { getSozluk, type Dil } from "@/lib/sozluk";

// BÜLTEN KAYDI: sunucu ucu (route handler). Form buraya POST ile gönderir: /api/bulten
// 📚 Next.js Route Handlers: app/.../route.ts içinde POST adında bir fonksiyon = o adrese gelen POST isteğini karşılar
//
// ⚠️ Hocanın kuralı: e-postaların saklanacağı yer henüz belli değil.
// Bu yüzden kayıt GERÇEK BİR YERE YAZILMIYOR, sadece terminale yazılıyor (console.log).
// Gerçek kişilerin e-postasını toplamıyoruz; denemelerde ornek@ornek.com gibi uydurma adresler.

// Gelen verinin kalıbı (Zod bekçisi, 23 Kasım'daki gibi)
const KayitSemasi = z.object({
  eposta: z.email(), // geçerli e-posta mı?
  onay: z.literal(true), // onay kutusu işaretli mi? (literal = tam olarak true olmalı)
  dil: z.enum(["tr", "en"]), // hangi dildeki formdan geldi
});

// Aynı e-postanın ikinci kez kaydını yakalamak için hafıza.
// Set = tekrarsız liste. Sunucu yeniden başlayınca SIFIRLANIR: gerçek bir veritabanı değil, sadece deneme için.
const kayitlilar = new Set<string>();

export async function POST(istek: Request) {
  // 1) Gövdeyi oku. Bozuk JSON gelirse çökme, genel hata dön
  const govde = await istek.json().catch(() => null);
  const sonuc = KayitSemasi.safeParse(govde);

  if (!sonuc.success) {
    // Hangi alan hatalı? Önce onay, sonra e-posta: kullanıcıya tek, anlaşılır bir mesaj
    const alanlar = sonuc.error.issues.map((sorun) => sorun.path[0]);
    const kod = alanlar.includes("onay") ? "onayYok" : alanlar.includes("eposta") ? "gecersizEposta" : "genelHata";
    return Response.json({ ok: false, kod }, { status: 400 }); // 400 = "isteğin hatalı"
  }

  const { onay, dil } = sonuc.data;
  // Büyük-küçük harf ve boşluk farkı aynı adres sayılsın: " Ornek@Ornek.com " = "ornek@ornek.com"
  const eposta = sonuc.data.eposta.trim().toLowerCase();

  // 2) Aynı e-posta ikinci kez mi?
  if (kayitlilar.has(eposta)) {
    return Response.json({ ok: false, kod: "ayniEposta" }, { status: 409 }); // 409 = "çakışma: zaten var"
  }
  kayitlilar.add(eposta);

  // 3) Kayıt: onay metni ve zamanı da yanında. Onay metnini formdan değil SÖZLÜKTEN alıyoruz:
  //    kullanıcının ekranda gördüğü cümlenin aynısı, tarayıcıdan değiştirilemez
  const kayit = {
    eposta,
    onay,
    onayMetni: getSozluk(dil as Dil).bulten.onayMetni,
    onayZamani: new Date().toISOString(), // ör. "2026-11-27T20:15:03.120Z" (UTC)
    dil,
  };
  console.log("[bulten] yeni kayıt (sadece terminal, hiçbir yere yazılmadı):", kayit);

  return Response.json({ ok: true }, { status: 201 }); // 201 = "oluşturuldu"
}