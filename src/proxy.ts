import { NextResponse, type NextRequest } from "next/server";

// PROXY = kapıdaki görevli. Her istek sayfaya gitmeden önce buradan geçer.
// 📚 Next.js Internationalization belgesi: sayfalar app/[lang]/ içinde, dil adresin başında.
// Bizim farkımız: Türkçe adresler DEĞİŞMESİN (/kisiler kalsın, /tr/kisiler olmasın).
//   /kisiler     → içeride /tr/kisiler açılır, adres çubuğu /kisiler kalır (rewrite = yeniden yazma)
//   /en/kisiler  → olduğu gibi geçer (İngilizce)
//   /tr/kisiler  → /kisiler'e gönderilir (redirect = yönlendirme), aynı sayfanın iki adresi olmasın
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // İngilizce: dokunma, olduğu gibi geçsin
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // Biri elle /tr yazarsa: Türkçe adresin kısa hâline gönder (/tr/kisiler → /kisiler)
  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/"; // "/tr" harflerini at (3 harf)
    return NextResponse.redirect(url);
  }

  // Geri kalan her şey Türkçe: içeride /tr ekle, ziyaretçi fark etmez
  const url = request.nextUrl.clone();
  url.pathname = `/tr${pathname}`;
  return NextResponse.rewrite(url);
}

// Görevli hangi adreslere baksın? Next.js'in kendi dosyalarına (_next), api'ye
// ve noktalı dosyalara (kapak.jpg, favicon.ico, ses.mp3) BAKMASIN: onlar dil değil, dosya.
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};