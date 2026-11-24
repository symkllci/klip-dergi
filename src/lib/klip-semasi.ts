import { z } from "zod";

// 📚 Kaynak: zod.dev → Basic usage (z.object, safeParse)
// API'nin cevabının KALIBI (şema). Hocanın taslağı:
// { "klipler": [ { "reel", "url", "yayinTarihi", "baslik", "kaynak": { "videoBasligi", "youtubeId" }, "kisiler": [] } ] }
// Zod = kapıdaki bekçi: her kaydı bu kalıba göre kontrol eder. TypeScript tipi YAZARKEN, Zod site ÇALIŞIRKEN kontrol eder.

// Klibin alındığı YouTube videosu
const KaynakSemasi = z.object({
  videoBasligi: z.string().min(1), // boş yazı olmasın
  youtubeId: z.string().regex(/^[\w-]{11}$/, "YouTube kimliği 11 karakter olmalı"), // ör. sD09TB7M7u4
});

// Tek bir klip kaydı
export const KlipSemasi = z.object({
  reel: z.string().regex(/^[\w-]+$/, "reel kodu harf, rakam, - ve _ olmalı"), // ör. Ddqm-BsAxNj
  url: z.url(), // geçerli bir adres
  // Tarih: ya sadece gün ("2026-10-01") YA DA tam tarih-saat ("2026-10-01T12:00:00Z"). union = "ya biri ya öteki"
  yayinTarihi: z.union([z.iso.date(), z.iso.datetime()]),
  baslik: z.string().min(1),
  kaynak: KaynakSemasi.optional(), // optional = olmayabilir (kaynağı bulunamayan 4 klip)
  kisiler: z.array(z.string().min(1)).min(1), // en az bir kişi
});

// Cevabın dış kabı: önce sadece "klipler bir liste mi?" diye bakıyoruz.
// Kayıtları TEK TEK KlipSemasi ile kontrol edeceğiz ki bozuk bir kayıt diğerlerini de yakmasın.
export const CevapSemasi = z.object({
  klipler: z.array(z.unknown()), // unknown = "ne olduğunu henüz bilmiyorum, sonra bakacağım"
});

// Şemadan TypeScript tipi üret: kalıbı iki kez (hem Zod hem types.ts) yazmıyoruz
export type ApiKlip = z.infer<typeof KlipSemasi>;